import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import mongoose, { isValidObjectId } from "mongoose";

function isValidObjectID(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

class CartManager {
    async getCartById(cid) {
        return await Cart.findById(cid).populate('products.productId');
    }

    async createCart() {
        const newCart = new Cart();
        return await newCart.save();
    }

    async addProductToCart(cid, pid) {
        if (!isValidObjectID(cid) || !isValidObjectId(pid)) throw new Error("ID invalido para cart o product");

        const cart = await Cart.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const productData = await Product.findById(pid);
    if (!productData) throw new Error("Producto no encontrado");

    const productIndex = cart.products.findIndex(p => p.productId.toString() === pid);

    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push( { productId: pid, quantity: 1, name: productData.name, price: productData.price });
    }

    return await cart.save();
    }

    async clearCart(cid) {
        const cart = await Cart.findById(cid);
        if (!cart) throw new Error("Carrito no encontrado");

        cart.products = [];
        return await cart.save();
    }

    async removeProductFromCart(cid, pid) {
        const cart = await Cart.findById(cid);
        if (!cart) throw new Error("Carrito no encontrado");

        const productExists = cart.products.some(p => p.productId.toString() === pid);
        if (!cart) throw new Error("Producto no encontrado en el carrito");

        cart.products = cart.products.filter( p = p.productId.toString() !== pid);
        return await cart.save();
    }

    async updateCart(cid, products) {
        return await Cart.findByIdAndUpdate(cid, {products}, { new: true });
    }

    async updateProductQuantify(cid, pid, quantity) {
        return await Cart.findByIdAndUpdate(
            {_id: cid, "products.productId": pid},
            {$set: { "products.$.quantity": quantity }},
            {new: true}
        );
    }
}

export default new CartManager();