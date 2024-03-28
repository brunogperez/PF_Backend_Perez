import mongoose from 'mongoose'

const usersCollection = 'users'
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  cart_id: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'carts' 
    },
  role: { 
    type: String, default: 'user', 
    enum: ['user', 'admin', 'premium'] 
  },
  last_login: { 
    type: Date, 
    default: Date.now 
  }
})

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v
    return ret
  }
});

const userModel = mongoose.model(usersCollection, userSchema)

export default userModel