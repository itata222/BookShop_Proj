const express = require('express')
const User = require('../models/userModel')
const Book = require('../models/bookModel')
const authUserMiddleWare = require('../middlewares/auth')
const authAdminMiddleWare = require('../middlewares/authAdmin')


const router = new express.Router();

router.post('/bookshop/create-user', async (req, res) => {
    const user = new User(req.body)
    await user.generateAuthToken();
    try {
        res.send(user)
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: err.message
        })
    }
})

router.patch('/bookshop/edit-user', authUserMiddleWare, async (req, res) => {
    const allowedUpdates = ['name', 'age', 'email', 'password']
    for (let key in req.body) {
        if (!allowedUpdates.includes(key))
            return res.status(400).send({
                status: 400,
                message: 'bad request'
            })
    }
    try {
        for (let update in req.body)
            req.user[update] = req.body[update]
        await req.user.save()
        res.send(req.user)
    } catch (err) {
        res.status(500).send({
            status: 400,
            message: err.message
        })
    }
})

router.delete('/bookshop/delete-user', authUserMiddleWare, async (req, res) => {
    try {
        await req.user.remove()
        res.send('user deleted')
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.post('/bookshop/login', async (req, res) => {
    try {
        const user = await User.findUserbyEmailAndPassword(req.body.email, req.body.password)
        await user.generateAuthToken();
        res.send(user)
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
        res.send()
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: 'something went wrong'
        })
    }
})

router.post('/bookshop/getNewToken-user', authUserMiddleWare, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenDoc) => tokenDoc.token !== req.token)
        const newToken = await req.user.generateAuthToken();
        res.send({ newToken })
    }
    catch (err) {
        res.status(500).send({
            status: 500,
            message: 'run out of time'
        })
    }
})

router.post('/bookshop/addToCart', authUserMiddleWare, async (req, res) => {
    const title = req.query.title
    try {
        if (title) {
            const user = req.user;
            const book = Book.find({ title })
            book.usersInCart = book.usersInCart.concat({ user })
            await book.save();
            res.send()
        } else {
            res.status(400).send({
                message: 'lack of src'
            })
        }

    } catch (err) {
        res.status(500).send()
    }
})

router.get('bookshop/user-cart', authUserMiddleWare, async (req, res) => {
    try {
        await req.user.populate('myBooks').execPopulate();
        res.send(req.user.tasks)
    } catch (err) {
        res.status(500).send(err)
    }
})

//-------------------------------------user----------------------------------
//-------------------------------------user----------------------------------

router.post('/bookshop/admins/create-book', authAdminMiddleWare, async (req, res) => {
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
        res.send('deleted book:' + book)
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: err.message
        })
    }
})


router.patch('/bookshop/admins/edit-book', authAdminMiddleWare, async (req, res) => {
    const _id = req.query.id;
    const availableEdits = ['image', 'title', 'author', 'description', 'price']
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
        res.send(book)
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: err.message
        })
    }
})


router.get("/bookshop/admins/getAll-Users", authAdminMiddleWare, async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false });
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