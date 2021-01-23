const express = require('express')
// const Admin = require('../models/adminModel')
const authMiddleWare = require('../src/middlewares/auth')

const router = new express.Router();


router.delete('/bookshop/admins/delete', authMiddleWare, async (req, res) => {
    const _id = req.query.id;
    try {
        const book = await Book.findByIdAndDelete(_id)
        if (!book) {
            return res.status(400).send({
                status: 400,
                message: 'didnt entered a book to delete'
            })
        }
        res.send('deleted book:' + book)
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: err.message
        })
    }
})


router.patch('/bookshops/admins/edit', authMiddleWare, async (req, res) => {
    const _id = req.query.id;
    const availableEdits = ['title', 'description', 'price']
    for (let key in req.body) {
        if (!availableEdits.includes(key))
            return res.status(404).send({
                status: 404,
                message: 'didnt entered valid key to edit a specific book'
            })
    }
    try {
        const book = await Book.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true
        })
        res.send('the book after editing:' + book)
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: err.message
        })
    }
})

router.post('/bookshop/admins/create', authMiddleWare, async (req, res) => {
    const book = new Book(req.body)
    try {
        await book.save()
        res.send(book)
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: err.message
        })
    }
})


router.get("/bookshop/admins/get-all", authMiddleWare, async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            return res.status(404).send({
                status: 404,
                message: "no admins",
            });
        }
        res.send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router