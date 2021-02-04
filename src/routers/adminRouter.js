const express = require('express')
const Admin = require('../models/adminModel')
const Book = require('../models/bookModel')
const authAdminMiddleWare = require('../middlewares/authAdmin')


const router = new express.Router();

router.post('/bookshop/create-admin', async (req, res) => {
    try {
        const admin = new Admin(req.body)
        const currentToken = await admin.generateAuthToken();
        res.send({ admin, currentToken })
    } catch (err) {
        console.log(err)
        res.status(400).send({
            status: 400,
            message: err.message
        })
    }
})

router.post('/bookshop/login-admin', async (req, res) => {
    try {
        const admin = await Admin.findadminbyEmailAndPassword(req.body.email, req.body.password)
        const currentToken = await admin.generateAuthToken();
        res.send({ admin, currentToken })
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: err.message
        })
    }
})

router.post('/bookshop/logout-admin', authAdminMiddleWare, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((tokenDoc) => tokenDoc.token !== req.token)
        await req.admin.save()
        res.send(req.admin)
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: 'something went wrong'
        })
    }
})


router.post('/bookshop/admins/create-book', authAdminMiddleWare, async (req, res) => {
    try {
        const book = new Book(req.body)
        let savedBook = await book.save()
        console.log(savedBook)
        res.send(book)
    } catch (err) {
        console.log('---------------------------------')
        let finalError = "";
        let seperateError = err.message.split(',');
        for (let partErr of seperateError) {
            const firstSign = partErr.indexOf('`');
            partErr = partErr.substring(firstSign)
            finalError += partErr + " ";
        }
        finalError = finalError.replaceAll('`', '')
        const pointIndex = finalError.indexOf('.')
        finalError = finalError.slice(0, pointIndex)

        // finalError = finalError.replaceAll(' is required.', ',');
        // console.log(finalError, '1')
        // const lastChar = finalError.lastIndexOf(',');
        // finalError = finalError.slice(0, lastChar);
        // console.log(finalError, '2')
        // const lastCharSep = finalError.lastIndexOf(',');
        // finalError = finalError.slice(0, lastCharSep) + ' and' + finalError.slice(lastCharSep + 1);
        // console.log(finalError, '3')
        // finalError = finalError.split(',').length > 0 ? finalError + ' are required' : finalError + ' is required';
        // console.log(finalError, '4')

        const errObj = {
            status: 500,
            message: finalError
        }
        console.log(errObj)
        res.status(500).send(errObj)
    }
})

router.delete('/bookshop/admins/delete-book', authAdminMiddleWare, async (req, res) => {
    const _id = req.query.id;
    try {
        const book = await Book.findByIdAndDelete(_id)
        if (!book) {
            return res.status(400).send({
                status: 400,
                message: 'didnt entered a book to delete'
            })
        }
        res.send(book)
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: err.message
        })
    }
})


router.patch('/bookshop/admins/edit-book', authAdminMiddleWare, async (req, res) => {
    const _id = req.query.id;
    const availableEdits = ['image', 'title', 'author', 'description', 'price', 'category', 'year_published']
    for (let key in req.body) {
        if (!availableEdits.includes(key))
            return res.status(404).send({
                status: 404,
                message: 'didnt entered valid key to edit a specific book' + key
            })
    }
    try {
        console.log(_id)
        const book = await Book.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true
        })
        console.log(book)
        res.send(book)
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: err.message
        })
        console.log(err.message)
    }
})

module.exports = router