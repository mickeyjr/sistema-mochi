import mongoose, { Schema } from 'mongoose';

export const ProductByStoreSchema = new Schema({
  IdProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Productos',
    required: true
  },
  IdStore: String,
  Fecha: String,
  Date: Date,
  InStock: Boolean,
  IdEmployee: String,
  Lugar: String,
  EstadoDelProducto: String,
  PrecioPublico: Number,
  Descripcion: String,
  CodigoChino: String,
  CodigoBarras: String,
  Nombre: String
}, {
  collection: 'ProductByStore',
  toObject: { virtuals: true },
  toJSON: { virtuals: true }, 
});
ProductByStoreSchema.virtual('imagenes', {
  ref: 'ImageProduct',
  localField: 'IdProduct',
  foreignField: 'IdProduct',
});