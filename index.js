const express = require('express')
const app = express()
const port = 3000
const shortid = require('shortid')
app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ books: [], users: [] })
  .write()

// Home page
app.get('/', (req,res) => res.render('index.pug'))

// Books list
app.get('/books', (req, res) => res.render('./books/books.pug', { books: db.get('books').value()}))
// Users list
app.get('/users', (req, res) => res.render('./users/users.pug', { users: db.get('users').value()}))

// Search for a book
app.get('/books/search', (req, res) => {
    var q = req.query.q
    var matchedBook = db.get('books').value().filter((book) => {
        return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1
    })
    res.render('books/books.pug', { books: matchedBook, q})
})
// Search for a user
app.get('/users/search', (req, res) => {
    var q = req.query.q
    var matchedUser = db.get('users').value().filter((user) => {
        return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1
    })
    res.render('users/users.pug', { users: matchedUser, q})
})


// Create book router
app.get('/books/create', (req, res) => {
    res.render('books/create_book.pug')    
})

// Create user router
app.get('/users/create', (req, res) => {
    res.render('users/create_user.pug')    
})

// View book by id
app.get('/books/:id', (req,res) => {
    var id = req.params.id
    var book = db.get('books').find({id: id}).value()
    res.render('books/view_book.pug', {
        book: book
    })
})
// View user by id
app.get('/users/:id', (req,res) => {
    var id = req.params.id
    var user = db.get('users').find({id: id}).value()
    res.render('users/view_user.pug', {
        user: user
    })
})

// Edit book title
app.get('/books/edit/:id', (req,res) => {
    var id = req.params.id
    var book = db.get('books').find({id: id}).value()
    res.render('books/edit_book.pug', {
        book: book
    })
})

app.post('/books/edit/:id', (req,res) => {
    var id = req.params.id
    var book = db.get('books').find({id: id}).value()
    
    db.get('books')
    .find({title: book.title}, {description: book.description})
    .assign({ title: req.body.title}, {description: req.body.description})
    .write()
    
    res.redirect('/books')
})

// Edit user name, phone number
app.get('/users/edit/:id', (req,res) => {
    var id = req.params.id
    var user = db.get('users').find({id: id}).value()
    res.render('users/edit_user.pug', {
        user: user
    })
})

app.post('/users/edit/:id', (req,res) => {
    var id = req.params.id
    var user = db.get('users').find({id: id}).value()
    
    db.get('users')
    .find({name: user.name}, {phone: user.phone})
    .assign({ name: req.body.name}, {phone: req.body.phone})
    .write()
    
    res.redirect('/users')
})
// Delete a book
app.get('/books/delete/:id', (req,res) => {
    var id = req.params.id
    var book = db.get('books').find({id: id}).value()
    res.render('books/delete_book.pug', {
        book: book
    })
})

app.post('/books/delete/:id', (req,res) => {
    var id = req.params.id
    var book = db.get('books').find({id: id}).value()
    
    db.get('books')
    .remove({title: book.title})
    .write()
    
    res.redirect('/books')
})

// Delete a user
app.get('/users/delete/:id', (req,res) => {
    var id = req.params.id
    var user = db.get('users').find({id: id}).value()
    res.render('users/delete_user.pug', {
        user: user
    })
})

app.post('/users/delete/:id', (req,res) => {
    var id = req.params.id
    var user = db.get('users').find({id: id}).value()
    
    db.get('users')
    .remove({name: user.name}, {phone: user.phone})
    .write()
    
    res.redirect('/users')
})


// Create new book
app.post('/books/create', (req, res) => {
    req.body.id = shortid.generate()
    db.get('books').push(req.body).write()
    res.redirect('/books')
})

// Create new user
app.post('/users/create', (req, res) => {
    req.body.id = shortid.generate()
    db.get('users').push(req.body).write()
    res.redirect('/users')
})

app.listen(port, () => console.log(`Server running on port ${port}`))