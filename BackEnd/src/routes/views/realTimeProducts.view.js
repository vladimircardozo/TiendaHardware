import Product from "../../data/mongo/models/product.model.js";

// Renderiza la vista inicial con los productos
const showRealTimeProducts = async (req, res, next) => {
    try {
        res.render("realTimeProducts"); // Renderiza la vista para WebSocket
    } catch (error) {
        next(error);
    }
};

export { showRealTimeProducts };
