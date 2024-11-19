const showProductDetail = async (req, res, next) => {
    try {
        res.render("productDetail");
    } catch (error) {
        next(error);
    }
}

export { showProductDetail };