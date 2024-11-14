import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'products';

const schema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String },
    category: { type: String, required: true },
    status: { type: Boolean, default: true }
});

const Product = mongoose.model(collection, schema);

export default Product;