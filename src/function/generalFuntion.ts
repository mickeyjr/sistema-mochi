const sharp = require('sharp');

export function formatFecha(fecha = new Date()) {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const YY = fecha.getFullYear().toString().slice(2); // últimos 2 dígitos del año
    const MM = pad(fecha.getMonth() + 1); // meses desde 0
    const DD = pad(fecha.getDate());
    const hh = pad(fecha.getHours());
    const mm = pad(fecha.getMinutes());
    const ss = pad(fecha.getSeconds());

    return `${DD}/${MM}/${YY}-${hh}:${mm}:${ss}`;
}

export function generateBodySales(body,idVenta, type: number, totalSales ){
        let sale;
        if(type == 1){
            sale = body.map(product => ({
                "IdVenta": idVenta,
                "Nombre": product.nombre,
                "Precio": product.precio,
                "NumeroDePiezas": product.numeroDePiezas,
                "Ganancia": product.ganancia * product.numeroDePiezas,
                //"Fecha": product.fecha,
                "Imagen": product.imagen,
            }))
        }else if (type == 2){
            sale = {
                "IdVenta": idVenta,
                "Total": totalSales,
                "TotalWithoutIVA": totalSales - (totalSales * .16),
                "PaymentReceived": body.PaymentReceived,
                "PaymentType":body.PaymentType,
                "CustomerChange": body.PaymentReceived - totalSales,
                "DateSales": formatFecha(),
                "DateSave":  new Date(),
                "SalesLocation": body.SalesLocation,
                "IVA": totalSales * .16,
                "IdStore": body.IdStore,
                "IdCashRegister": body.IdCashRegister,
                "IdEmployee": body.IdEmployee,
                "products": []
            }
        }else if(type == 3){
            sale = {
                "Total": body.Total,
                "TotalWithoutIVA": body.TotalWithoutIVA,
                "PaymentType": body.PaymentType,
                "CustomerChange": body.CustomerChange,
                "IVA": body.IVA,
                "PaymentReceived": body.PaymentReceived,
                "IdStore": body.IdStore,
                "IdCashRegister": body.IdCashRegister,
                "IdEmployee": body.IdEmployee,
                "DateSales": body.DateSales,
                "IdVenta": body.IdVenta,
                "products": body.products,
                "Ganancia": body.products.reduce((total, item) => total + item.Ganancia, 0),
                "Fecha": formatFecha(),
                "DateSave":  new Date(),
                "SalesLocation": body.SalesLocation,
            };
        }

        return sale; 
    }
export function generarIdPorFecha() {
  const fecha = new Date().toISOString().replace(/[-:TZ.]/g, '');
  const random = Math.floor(Math.random() * 10000); 
  return `${fecha}${random}`;
}

export async function reduceImageBuffer(
  buffer: Buffer,
  opciones?: { ancho?: number; calidad?: number }
): Promise<Buffer> {
  const { ancho = 300, calidad = 80 } = opciones || {};

  try {
    return await sharp(buffer)
    .resize({ width: ancho }) 
    .jpeg({ quality: calidad }) 
    .toBuffer();
  } catch (error) {
    console.log(error);
    return error
  }

}
