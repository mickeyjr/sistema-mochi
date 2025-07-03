import { Schema } from 'mongoose';

export const ProductStockSchema = new Schema({
    IdProduct: String,
    Stock: Number,
    IdStore: String
}, {
  collection: 'ProductosStock' 
});