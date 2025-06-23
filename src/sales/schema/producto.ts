import { Schema } from 'mongoose';

export const ProductosSchema = new Schema({
  CodigoChino: String,
  CodigoBarras: String,
  Nombre: String,
  Descripcion: String,
  PrecioCosto: Number,
  PrecioUnitario: Number,
  PrecioPublico: Number,
  Contenido: Number,
  stock: Number,
  EstadoDelProducto: String,
  InStock: Boolean,
  Ganancia: Number,
  Fecha: String,
  Lugar: String,
  Imagen: String,
}, {
  collection: 'Productos' 
});