import mongoose, { Schema } from 'mongoose';

export const ProductStockSchema = new Schema({
    IdProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Productos',
      required: true
    },
    Stock: Number,
    IdStore: String
}, {
  collection: 'ProductosStock' 
});