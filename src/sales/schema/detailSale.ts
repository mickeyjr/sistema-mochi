import { Schema } from 'mongoose';

export const SaveSaleDetailsSchema = new Schema({
    IdVenta:String,
    Ganancia:Number,
    Fecha:String,
    products: Array,
    Lugar: String,
}, {
  collection: 'SaveSaleDetails' 
});

