import { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2'

const cartSchema = new Schema({
    products: {
        type: [{
            id_prod: {
                type: Schema.Types.ObjectId,
                ref: 'products',
                required: false, // Cambiado a false para permitir valores nulos
                default: undefined
            },
            quantity: {
                type: Number,
                required: false,
                default:undefined
            },
        }],
        required: false,
        unique: false,
        default: []
    },
});

cartSchema.pre('findOne', function () {
    this.populate('products.id_prod');
});

cartSchema.plugin(paginate)

const cartModel = model('carts', cartSchema);

export default cartModel;