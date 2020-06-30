const db = require('../db')
const shortid = require('shortid')

// Books list
module.exports.bookList = (req, res) => res.render('./books/books.pug', { books: db.get('books').value()})

// Search for a book
module.exports.searchBook =  (req, res) => {
    var q = req.query.q
    var matchedBook = db.get('books').value().filter((book) => {
        return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1
    })
    res.render('books/books.pug', { books: matchedBook, q})
}

// Create book router
module.exports.bookRoute =  (req, res) => {
    res.render('books/create_book.pug')    
}

// View book by id
module.exports.view = (req,res) => {
    var id = req.params.id
    var book = db.get('books').find({id: id}).value()
    res.render('books/view_book.pug', {
        book: book
    })
}

// Edit book title
module.exports.edit = (req,res) => {
    var id = req.params.id
    var book = db.get('books').find({id: id}).value()
    res.render('books/edit_book.pug', {
        book: book
    })
}

module.exports.editId = (req,res) => {
    var id = req.params.id
    var book = db.get('books').find({id: id}).value()
    
    db.get('books')
    .find({title: book.title}, {description: book.description})
    .assign({ title: req.body.title}, {description: req.body.description})
    .write()
    
    res.redirect('/books')
}

// Delete a book
module.exports.delete =  (req,res) => {
    var id = req.params.id
    var book = db.get('books').find({id: id}).value()
    res.render('books/delete_book.pug', {
        book: book
    })
}

module.exports.deletePost = (req,res) => {
    var id = req.params.id
    var book = db.get('books').find({id: id}).value()
    
    db.get('books')
    .remove({title: book.title})
    .write()
    
    res.redirect('/books')
}

// Create new book
module.exports.create = (req, res) => {
    req.body.id = shortid.generate()
    db.get('books').push(req.body).write()
    res.redirect('/books')
}