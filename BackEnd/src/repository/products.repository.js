import productsDTO from "../dto/product.dto.js"
import data from "../data/index.factory.js"
const { ProductsManager } = data 

async function createRepository(data) {
    data = new productsDTO(data)
    const response = await ProductsManager.create(data);
    return response;
}
async function readRepository() {
    const response = await ProductsManager.read();
    return response;
  }
  async function updateRepository(id, data) {
    const response = await ProductsManager.update(id, data);
    return response;
  }
  
  const destroyRepository = async (id) => await ProductsManager.destroy(id);
  
  export { createRepository, readRepository, updateRepository, destroyRepository };