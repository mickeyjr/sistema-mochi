import { Schema } from 'mongoose';

export const ProductByStoreSchema = new Schema({
  IdProduct: String,
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
  collection: 'ProductByStore' 
});