// Renderiza la vista inicial con los productos
const showRealTimeProducts = async (req, res, next) => {
    try {
        res.render("realTimeProducts"); // Renderiza la vista para WebSocket
    } catch (error) {
        return next(error);
    }
};

export { showRealTimeProducts };
