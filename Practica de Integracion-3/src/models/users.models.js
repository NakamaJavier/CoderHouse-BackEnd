import { Schema, model } from "mongoose";

const userSchema = new Schema({
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
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        default: 'user'
    },
    age: {
        type: Number,
        required: true
    },
    id_cart: {
        type: Schema.Types.ObjectId, //Id autogenerado de MongoDB
        ref: 'carts',
    }
    
})

userSchema.pre('findOne', function () {
    this.populate('id_cart');
});
userSchema.pre('findOne', function () {
    this.populate({ path: 'id_cart', populate: 'products.id_prod' });
});
const userModel = model('users', userSchema)
export default userModel