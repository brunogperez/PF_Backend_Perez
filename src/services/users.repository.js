export default class UsersRepository {
  constructor(dao) {
    this.dao = dao
  }

  getUsers = async ()=> await this.dao.getUsers()

  getUserById = async (id) => await this.dao.getUserById(id)

  getUserByEmail = async (email) =>  await this.dao.getUserByEmail(email)

  createUser = async (user) => await this.dao.createUser(user)

  changeUserPassword = async (user, password) =>  await this.dao.updateUser(user, password)

  switchRole = async (user) => {
    const role = user?.role != "admin" ? (user?.role == "user" ? "premium" : "user") : "admin"
    const result = await this.dao.updateUser(user, role, "role")
    return result
  }

  deleteUser = async (id) => await this.dao.deleteUser(id)

  deleteUsers = async (filter) => await this.dao.deleteUsers(filter)
  
  updateUser = async (id, updateData) => {
    // This will update any fields provided in updateData
    // The DAO method now accepts either an ID or an object with _id
    const result = await this.dao.updateUser(id, updateData);
    return result;
  }
}
