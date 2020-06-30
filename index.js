const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
var bookRouter = require('./routes/book.route')
var userRouter = require('./routes/user.route')
var transactionRouter = require('./routes/transactions.route')
// Home page
app.get('/', (req,res) => res.render('index.pug'))

// book routers
app.use('/books', bookRouter)

// user routers

app.use('/users', userRouter)

// transactions router

app.use('/transactions', transactionRouter)

app.listen(port, () => console.log(`Server running on port ${port}`))