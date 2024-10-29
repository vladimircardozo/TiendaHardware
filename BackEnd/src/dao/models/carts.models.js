import mongoose, { Types } from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            productId : { type: mongoose.Schema.Types.ObjectId, ref:  'Product', require: true},
            quantity: { type: Number, default: 1 }
        }
    ]
},  { timestamps: true });

const Cart  = mongoose.model('Cart', cartSchema);

export default Cart;

