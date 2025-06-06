import userModel from './models/users.model.js'

export default class Users {

  constructor() { }

  getUsers = async () => userModel.find()

  getUserById = async (id) => userModel.findById(id).lean().exec()

  getUserByEmail = async (email) => userModel.findOne({ email })

  createUser = async (user) => userModel.create(user)

  updateUser = async (user, updateData) => {
    const userId = user._id || user;
    return userModel.findByIdAndUpdate(
      userId, 
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean().exec();
  }
  
  deleteUser = async (id) => await userModel.findByIdAndDelete(id)

  deleteUsers = async (filter) => {
    await userModel.deleteMany(filter)
  }
  
}