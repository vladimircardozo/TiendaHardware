import Product  from "../models/product.model.js";

const create = async (data) => {
    try {
        const one = await Product.create(data)
        return one;
    } catch (error) {
        throw error
    }
};

const read = async ({limit = 10, page = 1, sort, query, availability} = {})  => {
    try {
        let filter = {};

        if (query) {
            filter.$or = [
                {category: {$regex: query, $options: "i"}},
                {title: {$regex: query, $options: "i"}}
            ];
        }

        let sortOptions = {};
        if (sort) {
            sortOptions.price = sort === "asc" ? 1 : -1;
        }

        const products = await  Product.find(filter)
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .lean(); //.lean() devuelve los documentos como objetos JavaScript "planos" en lugar de instancias de Mongoose
        
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / parseInt(limit));

        return {
            status: "succes",
            payload: products,
            totalProducts,
            totalPages,
            page: parseInt(page),
            hasPrevPage: page > 1,
            hastNextPage: parse < totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null
        };
    } catch (error) {
        throw error;
    }
};

const readById = async (id) => {
    try {
        return await Product.findById(id).lean()
    } catch (error) {
        throw error
    }
}

const readByEmail = async (email) => {
    try {
        const one = await this.model.findOne({ email }).lean()
        return one
    } catch (error) {
        throw error
    }
}

const update = async (id, data) => {
    try {
    const opt = { new: true }.lean() // devuelve el objeto luego de la configuración
    const one  = await Product.findByIdAndUpdate(id, data, opt);
    return  one;
    } catch (error) {
        throw error
    }
}

const destroy = async (id) => {
    try {
        const one = await Product.findByIdAndDelete(id)
        return  one;
    } catch (error) {
        throw error
    }
}

export { create, read, readById, readByEmail, update,  destroy }
