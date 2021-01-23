const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express();
const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, '../public')
const userRouter = require('./routers/userRouter')
const shopRouter = require('./routers/shopRouter')
require('./db/booksopDB')

app.use(cors());
app.use(express.json())
app.use(express.static(publicDirectoryPath))
app.use(userRouter)
app.use(shopRouter)
app.listen(port, () => {
    console.log('server runs, port:', port)
})
