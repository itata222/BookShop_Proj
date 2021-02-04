const express = require('express')
const Book = require('../models/bookModel')

const router = new express.Router();

router.get('/bookshop/home', async (req, res) => {
    try {
        const books = await Book.find({})
        if (!books)
            return res.status(404).send({
                status: 404,
                message: 'no books found'
            })
        res.send(books)
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: 'something went wrong'
        })
    }
})

router.get('/bookshop/search', async (req, res) => {
    const title = req.query.title;
    const minPrice = req.query.minPrice || 0
    const maxPrice = req.query.maxPrice
    try {
        let books;
        if (!maxPrice && title)
            books = await Book.find({ $and: [{ title: { $regex: title, $options: 'i' } }, { price: { $gte: minPrice } }] })
        else if (!maxPrice && !title)
            books = await Book.find({ price: { $gte: minPrice } })
        else if (maxPrice && !title)
            books = await Book.find({ $and: [{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }] })
        else
            books = await Book.find({ $and: [{ title: { $regex: title, $options: 'i' } }, { price: { $gte: minPrice } }, { price: { $lte: maxPrice } }] })

        if (books.length === 0)
            return res.status(404).send({
                status: 404,
                message: '0 results'
            })
        res.send(books)
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: err.message
        })
    }
})

router.get('/bookshop/book-page', async (req, res) => {
    const title = req.query.title;
    try {
        const book = await Book.findOne({ title })
        if (!book) {
            res.status(404).send({
                status: 404,
                message: 'Book not exist'
            })
        }
        res.send(book)
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: "something went wrong"
        })
    }
})

router.get('/bookshop/category-books', async (req, res) => {
    const category = req.query.category
    try {
        const books = await Book.find({ category })
        if (!books) {
            res.status(404).send({
                status: 404,
                message: 'Book not exist'
            })
        }
        res.send(books)
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: "something went wrong"
        })
    }
})



module.exports = router
