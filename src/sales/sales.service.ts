import { Get, HttpException, Injectable, Param } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { formatFecha, generateBodySales } from 'src/function/generalFuntion';
import { Types } from "mongoose";


@Injectable()
export class SalesService {

    constructor(
        @InjectModel('SaveSale') private SaveSale: Model<any>,
        @InjectModel('Producto') private productoModel: Model<any>,
        @InjectModel('ProductosStock') private productoStockModel: Model<any>,
        @InjectModel('SaveSaleDetails') private SaveSaleDetailsModel: Model<any>,
        @InjectConnection() private readonly connection: Connection,

    ) { }

    async GetSalesByWeek(dates: any) {

        let dateInit = new Date(`${dates.dateInit}T00:00:00.000Z`);
        let dateEnd = new Date(`${dates.dateEnd}T23:59:59.999Z`);

        dateInit.setHours(0, 0, 0, 0);
        dateEnd.setHours(23, 59, 59, 999);

        let response = await this.SaveSale.find({
            DateSave: { $gte: dateInit, $lte: dateEnd }
        });

        return response;
    }

    async GetSalesByWeekAndStores(dates: any) {

        let dateInit = new Date(`${dates.dateInit}T00:00:00.000Z`);
        let dateEnd = new Date(`${dates.dateEnd}T23:59:59.999Z`);

        dateInit.setHours(0, 0, 0, 0);
        dateEnd.setHours(23, 59, 59, 999);

        let response = await this.SaveSale.find({
            DateSave: { $gte: dateInit, $lte: dateEnd },
            IdStore: dates.store
        });

        return response;
    }

    async getSalesById(idSale: String) {
        return this.SaveSale.find({ IdVenta: idSale })
    }

    async SaveSales(products: any, session: { validator?: boolean; session: any; }) {
        try {

            const res = await this.SaveSale.insertOne(products, session.session);

            await this.SaveSaleDetails(products, session.session);

            await session.session.commitTransaction();
            session.session.endSession();

            return {
                response: "Venta registrada correctamente",
                status: 200,
                data:   {
                    PaymentType: products.PaymentType,
                    PaymentReceived: products.PaymentReceived,
                    CustomerChange: products.CustomerChange,
                    IVA: products.IVA,
                    Total: products.Total,
                    TotalWithoutIVA: products.TotalWithoutIVA,
                    DateSales: products.DateSales,
                    IdVenta: products.IdVenta,
                    IdStore: products.IdStore,
                    IdCashRegister: products.IdCashRegister,
                    IdEmployee: products.IdEmployee,
                    cambio: (products.PaymentReceived - products.Total),
                }
            };

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
            let newDetailsProducts = await generateBodySales(products, 0, 3, 0);

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

    async totalProducts(products: any) {

        let totalSales = 0;
        let totalPrice = 0;

        products.forEach(product => {
            totalPrice = product.precio * product.numeroDePiezas
            totalSales += totalPrice;
        });

        return totalSales;
    }

    async RecalculateSale(products: any, SalesInformation: any) {
        try {
            const idVenta = await this.generateUniqueSaleId();

            let sale = await generateBodySales(products, idVenta, 1, 0);

            let totalSales = await this.totalProducts(products);

            if (totalSales > SalesInformation.PaymentReceived) {
                throw new HttpException({
                    status: 400,
                    error: 'No puedes adicionar un monton menor al coobro.',
                }, 400);
            }

            let saleSave = await generateBodySales(SalesInformation, idVenta, 2, totalSales);
            sale.forEach(sale => {
                saleSave.products.push(sale);
            });

            return saleSave;

        } catch (error) {

            throw new HttpException({
                status: 500,
                error: 'Existe un error en el servidor.',
                message: error.message.errorResponse.errmsg,
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

    async SubtractStockAndSaveSale(products: any, IdStore: String) {

        const session = await this.connection.startSession();
        session.startTransaction();

        try {


            const removeProductsFromStock = products.map(
                (product: { idProduct: string }) => new Types.ObjectId(product.idProduct)
            );

            const numberOfPize = await this.productoStockModel.find(
                { IdProduct: { $in: removeProductsFromStock }, IdStore: IdStore },
                { IdProduct: 1, Stock: 1,IdStore: 1 }
            ).session(session).lean();

            if (!numberOfPize || numberOfPize.length !== products.length) {
                throw new HttpException({
                    status: 404,
                    error: 'No se pudieron obtener los productos',
                }, 404);
            }

            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                const currentProduct = numberOfPize.find(
                  p => p.IdProduct.equals(new Types.ObjectId(product.idProduct))
                );
                if (!currentProduct) continue;

                const newStock = currentProduct.Stock - product.numeroDePiezas;

                if (newStock < 0) {
                    throw new HttpException({
                        status: 400,
                        error: 'Stock insuficiente para el producto',
                    }, 400);
                }

                await this.productoStockModel.updateOne(
                    { idProduct: product.idProduct, IdStore: IdStore },
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

        }
    }

    async GetInfoProduct(sale: any) {
        try {

            const productosConInfo = await Promise.all(sale.products.map(async (product) => {

                const info = await this.productoModel.findOne(
                    { _id: new Types.ObjectId(product.idProduct) },
                    { PrecioPublico: 1, GananciaPorUnidad : 1, _id: 0 }
                ).exec();

                return {
                    ...product,
                    fecha: formatFecha(),
                    precio: info?.PrecioPublico || 0,
                    ganancia: info?._doc?.GananciaPorUnidad  || 0
                };

            }));

            return productosConInfo;

        } catch (error) {

            throw new HttpException({
                status: 404,
                error: 'Ocurrio algo en el sistema',
                message: error,
            }, 404);

        }
    }

}
