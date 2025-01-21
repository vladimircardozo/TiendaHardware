import UserDTO from "../dto/user.dto.js"
import data from "../data/index.factory.js"
const { UsersManager } = data

class UsersRepository {
  createRepository = async (data) => {
    data = new UserDTO(data)
    return await UsersManager.create(data);
  }
  readRepository = async () => await UsersManager.read();
  updateRepository = async (id, data) => await UsersManager.update(id, data);
  destroyRepository = async (id) => await UsersManager.destroy(id);
}

const repository = new UsersRepository();
const { createRepository, readRepository, updateRepository, destroyRepository } = repository;
export { createRepository, readRepository, updateRepository, destroyRepository };