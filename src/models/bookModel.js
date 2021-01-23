const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    author: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
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
    },
    usersInCart: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ]
}, {
    timestamps: true
})

bookSchema.methods.toJSON = function () {
    const book = this;
    const bookObj = book.toObject();

    delete bookObj.usersInCart;

    return bookObj;
};

const Book = mongoose.model('Book', bookSchema)

module.exports = Book