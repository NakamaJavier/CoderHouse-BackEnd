import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const ticketSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchase_datetime: {
        type: Date
    },
    amount: {
        type: Number,
    },
    purchaser: {
        type: String
    },
    detail: {
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
    }

})

//evito que se pase code como parametro
ticketSchema.pre('validate', function(next) {
    this.code = uuidv4(); // Genera un UUID único si no se proporciona un valor para code
    this.date = Date.now
    next();
})

ticketSchema.pre('findOne', function () {
    this.populate('products.id_prod');
});

const ticketModel = model ("ticket",ticketSchema)

export default ticketModel