import { Schema } from 'mongoose';

export const SaveSaleDetailsSchema = new Schema({
    IdVenta:String,
    Ganancia:Number,
    Fecha:String,
    products: Array,
    SalesLocation: String,
    Total: Number,
    TotalWithoutIVA: Number,
    PaymentType:String,
    CustomerChange: Number,
    IVA: Number,
    PaymentReceived: Number,
    DateSales: String,
    IdCashRegister: String,
    IdStore: String,
    DateSave: Date

}, {
  collection: 'SaveSaleDetails' 
});

