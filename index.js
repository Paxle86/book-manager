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
db.defaults({ books: [] })
  .write()


app.get('/', (req,res) => res.render('index.pug'))

app.get('/books', (req, res) => res.render('./books/books.pug', { books: db.get('books').value()}))

app.get('/books/search', (req, res) => {
    var q = req.query.q
    var matchedBook = db.get('books').value().filter((book) => {
        return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1
    })
    res.render('books/books.pug', { books: matchedBook, q})
})


app.get('/books/create', (req, res) => {
    res.render('books/create.pug')    
})

app.get('/books/:id', (req,res) => {
    var id = req.params.id
    var book = db.get('books').find({id: id}).value()
    res.render('books/view.pug', {
        book: book
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
    .find({title: book.title})
    .assign({ title: req.body.title})
    .write()
    
    res.redirect('/books')
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


// Create new book
app.post('/books/create', (req, res) => {
    req.body.id = shortid.generate()
    db.get('books').push(req.body).write()
    res.redirect('/books')
})
app.listen(port, () => console.log(`Server running on port ${port}`))