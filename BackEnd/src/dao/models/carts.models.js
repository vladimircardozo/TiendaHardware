import mongoose from 'mongoose';

// Define a schema for individual products within a cart
const productInCartSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
});

const cartSchema = new mongoose.Schema({
    products: [productInCartSchema]  
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
