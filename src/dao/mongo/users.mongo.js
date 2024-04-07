import userModel from './models/users.model.js'

export default class Users {

  constructor() { }

  getUsers = async () => userModel.find()

  getUserById = async (id) => userModel.findById(id).lean().exec()

  getUserByEmail = async (email) => userModel.findOne({ email })

  createUser = async (user) => userModel.create(user)

  updateUser = async (user, value, field = 'password') => {
    const updateObj = {}
    updateObj[field] = value
    return userModel.updateOne({ _id: user._id }, { $set: updateObj })
  }
  
  deleteUser = async (id) => await userModel.findByIdAndDelete(id)

  deleteUsers = async (filter) => {
    await userModel.deleteMany(filter)
  }
  
}