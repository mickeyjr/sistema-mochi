import { Schema } from 'mongoose';

export const SaveSaleSchema = new Schema({
  IdVenta: String,
  Total: Number,
  TotalWithoutIVA: Number,
  PaymentType:String,
  CustomerChange: Number,
  IVA: Number,
  PaymentReceived: Number,
  products: Array,
  DateSales: String,
  SalesLocation: String,
  IdStore: String,
  IdCashRegister: String,
  DateSave: Date
}, {
  collection: 'SaveSale' 
});