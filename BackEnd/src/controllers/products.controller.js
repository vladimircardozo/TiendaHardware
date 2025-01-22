import {
    createService,
    readService,
    // readByIdService,
    updateService,
    destroyService,
  } from '../services/products.service.js';
  
  async function handleCreate(req, res) {
    const newProduct = await createService(req.body);
    res.status(201).json(newProduct);
  }
  
  async function handleRead(req, res) {
    const products = await readService();
    res.status(200).json(products);
  }
  
//   async function handleReadById(req, res) {
//     const { id } = req.params;
//     const product = await readByIdService(id);
  
//     if (product) {
//       res.status(200).json(product);
//     } else {
//       res.status(404).json({ message: 'Producto no encontrado' });
//     }
//   }
  
  async function handleUpdate(req, res) {
    const { id } = req.params;
    const updatedProduct = await updateService(id, req.body);
  
    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  }
  
  async function handleDestroy(req, res) {
    const { id } = req.params;
    const deletedProduct = await destroyService(id);
  
    if (deletedProduct) {
      res.status(200).json({ message: 'Producto eliminado' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  }
  
  export {
    handleCreate,
    handleRead,
    // handleReadById,
    handleUpdate,
    handleDestroy,
  };
  