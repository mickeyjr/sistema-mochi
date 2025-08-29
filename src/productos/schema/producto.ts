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
  Imagen: Object,
  IdProduct: String,
  FechaEndExits: String,
  ImagenMimeType: String,
  ImagenBuffer: Buffer,
  Serie: String,
  Brand: String
}, {
  collection: 'Productos',
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

ProductosSchema.virtual('imagenes', {
  ref: 'ImageProduct',
  localField: '_id',
  foreignField: 'IdProduct',
});