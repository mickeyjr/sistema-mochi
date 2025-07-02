import { Schema } from 'mongoose';

export const ProductStockSchema = new Schema({
    idProduct: String,
    stock: Number
}, {
  collection: 'ProductosStock' 
});