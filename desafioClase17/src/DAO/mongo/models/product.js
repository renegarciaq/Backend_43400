import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
const collection = 'Products'

const schema = new mongoose.Schema({
    title: {
        type: String,
        index: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        unique: true
    },
    stock: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    category: {
        type: String
    },
    thumbnails: []
})

schema.plugin(mongoosePaginate)

const productModel = mongoose.model(collection, schema)

export default productModel