import dbConnect from '../utils/dbConnect.util.js';
import argsUtil from '../utils/args.util.js';

const { persistence } = argsUtil;

let data = {};

switch (persistence) {
  case 'memory':
    console.log('conectado al sistema de memoria');
    const { default: productsManagerMemory } = await import(
      './memory/ProductsManager.memory.js'
    );
    const { default: UsersManagerMemory } = await import(
      './memory/UsersManager.memory.js'
    );
    const { default: CartsManagerMemory } = await import(
      './memory/CartsManager.memory.js'
    );

    data = {
      ProductsManager: productsManagerMemory,
      UsersManager: UsersManagerMemory,
      CartsManager: CartsManagerMemory,
    };
    break;
  case 'fs':
    console.log('conectado al sistema de archivos');
    const { default: ProductsManagerFS } = await import(
      './fs/ProductsManager.fs.js'
    );
    const { default: UsersManagerFS } = await import('./fs/UsersManager.fs.js');
    const { default: CartsManagerFS } = await import('./fs/CartsManager.fs.js');

    data = {
      ProductsManager: ProductsManagerFS,
      UsersManager: UsersManagerFS,
      CartsManager: CartsManagerFS,
    };
    break;
  default:
    console.log('connectado a mongoDB');
    dbConnect();
    const { default: ProductsManagerMongo } = await import(
      './mongo/managers/products.manager.js'
    );
    const { default: UsersManagerMongo } = await import(
      './mongo/managers/users.manager.js'
    );
    const { default: CartsManagerMongo } = await import(
      './mongo/managers/carts.manager.js'
    );
    data = {
      ProductsManager: ProductsManagerMongo,
      UsersManager: UsersManagerMongo,
      CartsManager: CartsManagerMongo,
    };
    break;
}

export default data;
