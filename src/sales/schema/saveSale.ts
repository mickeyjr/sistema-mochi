import { Schema } from 'mongoose';

export const SaveSaleSchema = new Schema({
  IdVenta: String,
  products: Array
}, {
  collection: 'SaveSale' 
});