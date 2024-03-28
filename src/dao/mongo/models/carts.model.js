import mongoose from 'mongoose'

const cartCollection = 'carts'
const cartSchema = new mongoose.Schema({
  products:[
    {
        _id: false,
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'products'
        },
        quantity: {
            type:Number,
            required:[true, 'La cantidad del producto es requerida']
        }
    }
]
})

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel