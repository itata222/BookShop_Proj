const express = require('express')
const User = require('../models/userModel')
const Book = require('../models/bookModel')
const authUserMiddleWare = require('../middlewares/auth')



const router = new express.Router();

router.post('/bookshop/create-user', async (req, res) => {
    try {
        const user = new User(req.body)
        const currentToken = await user.generateAuthToken();
        res.send({ user, currentToken })
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: err.message
        })
    }
})

router.post('/bookshop/login', async (req, res) => {
    try {
        const user = await User.findUserbyEmailAndPassword(req.body.email, req.body.password)
        const currentToken = await user.generateAuthToken();
        res.send({ user, currentToken })
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: err.message
        })
    }
})

router.post('/bookshop/logout', authUserMiddleWare, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenDoc) => tokenDoc.token !== req.token)
        await req.user.save()
        res.send(req.user)
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: 'something went wrong'
        })
    }
})



router.post('/bookshop/user-addToCart', authUserMiddleWare, async (req, res) => {
    const title = req.body.title
    const buyedBook = await Book.findOne({ title })
    try {
        const user = req.user;
        user.myBooks = user.myBooks.concat({ book: buyedBook })
        await user.save();
        res.send({ buyedBook, user })
    }
    catch (err) {
        res.status(500).send(err)
    }
})

router.get('/bookshop/user-cart', authUserMiddleWare, async (req, res) => {
    try {
        await req.user.populate('myBooks.book').execPopulate();
        res.send(req.user.myBooks)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.post('/bookshop/customer-addToCart', async (req, res) => {
    const title = req.body.title
    try {
        const buyedBook = await Book.findOne({ title })
        if (!buyedBook)
            res.status(404).send({
                status: 404,
                message: 'book no longer exist'
            })
        res.send(buyedBook)
    }
    catch (err) {
        res.status(500).send(err)
    }
})
router.post('/bookshop/customer-cart', async (req, res) => {
    const booksAddedTitles = req.body.booksAdded || []
    try {
        let cartBooks = [];
        for (let bookTitle of booksAddedTitles) {
            const bookInCart = await Book.findOne({ title: bookTitle });
            cartBooks.push(bookInCart)
        }
        res.send(cartBooks)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.patch('/bookshop/user-edit-cart', authUserMiddleWare, async (req, res) => {
    const allRemainingBooks = req.body;
    try {
        req.user.myBooks = [];
        for (let bookTitle in allRemainingBooks) {
            const bookDoc = await Book.findOne({ "title": allRemainingBooks[bookTitle] })
            req.user.myBooks = req.user.myBooks.concat({ book: bookDoc })
        }
        await req.user.save();
        res.send(req.user.myBooks)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})


module.exports = router