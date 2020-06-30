var express = require('express')
var router = express.Router()
const db = require('../db')
const shortid = require('shortid')


// Books list
router.get('/', (req, res) => res.render('./books/books.pug', { books: db.get('books').value()}))

// Search for a book
router.get('/search', (req, res) => {
    var q = req.query.q
    var matchedBook = db.get('books').value().filter((book) => {
        return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1
    })
    res.render('books/books.pug', { books: matchedBook, q})
})

// Create book router
router.get('/create', (req, res) => {
    res.render('books/create_book.pug')    
})

// View book by id
router.get('/:id', (req,res) => {
    var id = req.params.id
    var book = db.get('books').find({id: id}).value()
    res.render('books/view_book.pug', {
        book: book
    })
})

// Edit book title
router.get('/edit/:id', (req,res) => {
    var id = req.params.id
    var book = db.get('books').find({id: id}).value()
    res.render('books/edit_book.pug', {
        book: book
    })
})

router.post('/edit/:id', (req,res) => {
    var id = req.params.id
    var book = db.get('books').find({id: id}).value()
    
    db.get('books')
    .find({title: book.title}, {description: book.description})
    .assign({ title: req.body.title}, {description: req.body.description})
    .write()
    
    res.redirect('/books')
})

// Delete a book
router.get('/delete/:id', (req,res) => {
    var id = req.params.id
    var book = db.get('books').find({id: id}).value()
    res.render('books/delete_book.pug', {
        book: book
    })
})

router.post('/delete/:id', (req,res) => {
    var id = req.params.id
    var book = db.get('books').find({id: id}).value()
    
    db.get('books')
    .remove({title: book.title})
    .write()
    
    res.redirect('/books')
})

// Create new book
router.post('/create', (req, res) => {
    req.body.id = shortid.generate()
    db.get('books').push(req.body).write()
    res.redirect('/books')
})



module.exports = router