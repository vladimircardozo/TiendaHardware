import { readById } from "../../data/mongo/managers/products.manager.js";

const showProductDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await readById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.render("productDetail", { product });
    } catch (error) {
        return next(error);
    }
}

export { showProductDetail };