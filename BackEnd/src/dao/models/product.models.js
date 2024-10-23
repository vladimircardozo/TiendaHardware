import mongoose from  'mongoose';

//Anulamos comportamiento de renombre por defecto de colecciones
mongoose.pluralize(null);

//Indicamos colección 
const collection = 'products';

//Generamos esquema
const schema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String },
    categoria: { type: String, required: true },
    status: { type: Boolean, default: true }
})

//Generamos model
const model = mongoose.model(collection, schema);

export default model;