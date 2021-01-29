const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
        trim: true,

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