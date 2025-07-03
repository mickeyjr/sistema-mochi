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
  IdEmployee: String,
  EstadoDelProducto: String,
  InStock: Boolean,
  GananciaPorUnidad: Number,
  Fecha: String,
  Lugar: String,
  Imagen: String,
  IdProduct:String,
  FechaEndExits: String
}, {
  collection: 'Productos' 
});