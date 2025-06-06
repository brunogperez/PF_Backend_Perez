export default class UsersRepository {
  constructor(dao) {
    this.dao = dao
  }

  getUsers = async ()=> await this.dao.getUsers()

  getUserById = async (id) => await this.dao.getUserById(id)

  getUserByEmail = async (email) =>  await this.dao.getUserByEmail(email)

  createUser = async (user) => await this.dao.createUser(user)

  changeUserPassword = async (user, password) =>  await this.dao.updateUser(user, password)

 
  switchRole = async (userId, currentRole, newRole) => {
    let roleToSet = newRole;
    
    // Si no se proporciona un nuevo rol, alternamos entre 'user' y 'premium'
    if (!newRole) {
      roleToSet = currentRole === 'user' ? 'premium' : 'user';
    }
    
    // Validar que el rol sea uno de los permitidos
    if (!['user', 'premium', 'admin'].includes(roleToSet)) {
      throw new Error('Rol no válido. Los roles permitidos son: user, premium, admin');
    }
    
    // Actualizar el rol del usuario
    const updatedUser = await this.dao.updateUser(userId, { role: roleToSet });
    return updatedUser;
  }

  deleteUser = async (id) => await this.dao.deleteUser(id)

  deleteUsers = async (filter) => await this.dao.deleteUsers(filter)
  
  updateUser = async (id, updateData) => {

    const result = await this.dao.updateUser(id, updateData);
    return result;
  }
}
