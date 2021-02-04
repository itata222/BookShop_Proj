const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
        trim: true,

    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    year_published: {
        type: Number,
        required: true,
        min: 1500,
        max: 2025
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10
    },
    price: {
        type: Number,
        required: true,
        min: 1
    }
}, {
    timestamps: true
})

// bookSchema.methods.toJSON = function () {
//     const book = this;
//     const bookObj = book.toObject();

//     return bookObj;
// };

const Book = mongoose.model('Book', bookSchema)

module.exports = Book