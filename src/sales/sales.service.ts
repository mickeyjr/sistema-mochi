import { HttpException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { formatFecha } from 'src/function/date';
import { SaveSaleDetailsSchema } from './schema/detailSale';

@Injectable()
export class SalesService {

    constructor(
        @InjectModel('SaveSale') private SaveSale: Model<any>,
        @InjectModel('Producto') private productoModel: Model<any>,
        @InjectModel('ProductosStock') private productoStockModel: Model<any>,
        @InjectModel('SaveSaleDetails') private SaveSaleDetailsModel: Model<any>,
        @InjectConnection() private readonly connection: Connection,

    ) { }

    async SaveSales(products: any, session: { validator?: boolean; session: any; }) {
        try {
    
            const res = await this.SaveSale.insertOne(products, session.session);

            await this.SaveSaleDetails(products, session.session);

            await session.session.commitTransaction();
            session.session.endSession();

            return { response: "Venta registrada correctamente", status: 200};
        } catch (error) {
            await session.session.abortTransaction();
            session.session.endSession();
            throw new HttpException({
                status: 500,
                error: 'Existe un error en el servidor.',
                message: error,
              }, 500);
        }

    }

    async SaveSaleDetails(products: any, session: { validator?: boolean; session: any; }) {
        try {
            const newDetailsProducts = {
                "IdVenta": products.IdVenta,
                "products": products.products,
                "Ganancia": products.products.reduce((total, item) => total + item.Ganancia, 0),
                "Fecha": products.products[0].Fecha,
                "Lugar": products.products[0].Lugar,
            };
            const res = await this.SaveSaleDetailsModel.insertOne(newDetailsProducts, session.session);
        } catch (error) {
            await session.session.abortTransaction();
            session.session.endSession();
            throw new HttpException({
                status: 500,
                error: 'Existe un error en el servidor.',
                message: error,
              }, 500);
        }
    }

    async RecalculateSale(products: any) {
        try {
            const idVenta = await this.generateUniqueSaleId();
            const sale = products.map(product => ({
                "IdVenta": idVenta,
                "Nombre": product.nombre,
                "Precio": product.precio,
                "NumeroDePiezas": product.numeroDePiezas,
                "Ganancia": product.ganancia * product.numeroDePiezas,
                "Fecha": product.fecha,
                "Lugar": product.lugar,
                "Imagen": product.imagen
            }))
            let saleSave = {
                "IdVenta": idVenta,
                products: sale
            }
            return saleSave;
        } catch (error) {
            throw new HttpException({
                status: 500,
                error: 'Existe un error en el servidor.',
                message: error,
              }, 500);
        }
    }


    async generateUniqueSaleId() {
        let unique = false;
        let saleId = 0;

        while (!unique) {
            saleId = Math.floor(1000000000 + Math.random() * 9000000000);

            const exists = await this.SaveSale.exists({ IdVenta: saleId });
            if (!exists) {
                unique = true;
            }
        }

        return saleId;
    }

    async SubtractStockAndSaveSale(products: any) {
        const session = await this.connection.startSession();
        session.startTransaction();

        try {

            const removeProductsFromStock: string[] = products.map((product: { idProduct: string }) => product.idProduct);

            const numberOfPize = await this.productoStockModel.find(
                { idProduct: { $in: removeProductsFromStock } },
                { idProduct: 1, stock: 1 }
            ).session(session).lean();

            if (!numberOfPize || numberOfPize.length !== products.length) {
                throw new HttpException({
                    status: 404,
                    error: 'No se pudieron obtener los productos',
                  }, 404);
            }

            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                const currentProduct = numberOfPize.find(p => p.idProduct === product.idProduct);
                if (!currentProduct) continue;

                const newStock = currentProduct.stock - product.numeroDePiezas;

                if (newStock < 0) {
                    throw new HttpException({
                        status: 400,
                        error: 'Stock insuficiente para el producto',
                      }, 400);
                }

                await this.productoStockModel.updateOne(
                    { idProduct: product.idProduct },
                    { $set: { stock: newStock } },
                    { session }
                );
            }

            return { validator: true, session };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw new HttpException({
                status: 500,
                error: 'Existe un error en el servidor.',
                message: error,
              }, 500);
            //throw error;
        }
    }

    async GetInfoProduct(products: any[]) {
        try {
            const productosConInfo = await Promise.all(products.map(async (product) => {
                const info = await this.productoModel.findOne(
                    { idProduct: product.idProduct },
                    { PrecioPublico: 1, Ganancia: 1, _id: 0 }
                ).exec();
                return {
                    ...product,
                    fecha: formatFecha(),
                    precio: info?.PrecioPublico || 0,
                    ganancia: info?._doc?.Ganancia || 0
                };
            }));

            return productosConInfo;
        } catch (error) {
            throw new HttpException({
                status: 404,
                error: 'Ocurrio algo en el sistema',
                message:error,
            }, 404);
        }
    }

}
