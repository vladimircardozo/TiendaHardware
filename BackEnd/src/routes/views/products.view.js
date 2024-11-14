import Product from "../../data/mongo/models/product.model.js"

const showProducts = async (req, res, next) => {
    try {
        const products = await Product.find()

        res.render("products", { products })

    } catch (error) {
        return next(error)
    }
}

export { showProducts };