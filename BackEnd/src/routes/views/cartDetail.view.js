const showCartDetail = async (req, res, next) => {
    try {
        const cartId = req.params.cartId; 
        const cart = await getCartById(cartId);

        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }
        
        res.render("cartDetail", { cart });
    } catch (error) {
        console.error("Error al mostrar los detalles del carrito:", error);
        return next(error);
    }
}

export { showCartDetail };