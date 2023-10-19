import {Schema, model} from "mongoose"
import paginate from 'mongoose-paginate-v2'

const productSchema = new Schema({
    title : {
        type: String,
        required : true
    },
    description: {
        type: String,
        required : true
    },
    category : {
        type: String,
        required : true
    },
    code : {
        type: String,
        unique : true,
        required : true
    },
    price : {
        type: Number,
        required : true
    },
    status : {
        type: Boolean,
        default: true
    },
    stock : {
        type: Number,
        required : true
    },
    thumbnail : [],
})
productSchema.plugin(paginate)

const productModel = model ("products",productSchema)

export default productModel