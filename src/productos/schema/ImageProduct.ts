import mongoose, { Schema } from 'mongoose';

export const ImageProductSchema = new Schema({
  IdProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Productos',
    required: true,
  },
  ImagenMimeType: {
    type: String,
  },
  ImagenBuffer: {
    type: Buffer,
  }
}, {
  collection: 'ImageProduct',
  timestamps: true,
});
