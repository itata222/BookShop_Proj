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
        // $and: [ { <expression1> }, { <expression2> } , ... , { <expressionN> } ] }
        //  kennel.find({ $and: [{ age: { $gt: 2 } }, { age: { $lte: 4 } }] }
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



module.exports = router
