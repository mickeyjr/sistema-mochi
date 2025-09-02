import { Schema } from 'mongoose';

export const ProductStockSchema = new Schema({
    idProduct: String,
    Stock: Number,
    IdStore: String
}, {
  collection: 'ProductosStock' 
});