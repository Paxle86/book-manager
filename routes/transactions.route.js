var express = require('express')
var router = express.Router()
const db = require('../db')
const shortid = require('shortid')

// Transactions list
router.get('/', (req, res) => res.render('transactions/trans.pug', { transactions: db.get('transactions').value()}))
// Search for a user transaction
// Search for a book transaction
router.get('/search', (req, res) => {
    var q = req.query.q
    var matchedTrans = db.get('transactions').value().filter((transaction) => {
        if ((transaction.user.toLowerCase().indexOf(q.toLowerCase()) !== -1) || (transaction.book.toLowerCase().indexOf(q.toLowerCase()) !== -1)) {
            return true
        }
    })
    res.render('transactions/trans.pug', { transactions: matchedTrans, q})
})

// Create transaction router
router.get('/create', (req, res) => {
    var users = db.get('users').value()
    var books = db.get('books').value()
    res.render('transactions/create_trans.pug', {users, books})    
})
// Create new transaction
router.post('/create', (req, res) => {
    req.body.id = shortid.generate()
    db.get('transactions').push(req.body).write()
    res.redirect('/transactions')
})

// View transactions by id
router.get('/:id', (req,res) => {
    var id = req.params.id
    var transaction = db.get('transactions').find({id: id}).value()
    res.render('transactions/view_trans.pug', {
        transaction: transaction
    })
})

// Delete a transaction
router.get('/delete/:id', (req,res) => {
    var id = req.params.id
    var transaction = db.get('transactions').find({id: id}).value()
    res.render('transactions/delete_trans.pug', {
        transaction: transaction
    })
})

router.post('/delete/:id', (req,res) => {
    var id = req.params.id
    var transaction = db.get('transactions').find({id: id}).value()
    
    db.get('transactions')
    .remove({user: transaction.user}, {book: transaction.book})
    .write()
    
    res.redirect('/transactions')
})
// Edit user , book in transactions
router.get('/edit/:id', (req,res) => {
    var id = req.params.id
    var users = db.get('users').value()
    var books = db.get('books').value()
    var transaction = db.get('transactions').find({id: id}).value()
    res.render('transactions/edit_trans.pug', {
        transaction: transaction,users, books
    })
})

router.post('/edit/:id', (req,res) => {
    var id = req.params.id
    var transaction = db.get('transactions').find({id: id}).value()
    
    db.get('transactions')
    .find({user: transaction.user}, {book: transaction.book})
    .assign({ user: req.body.user}, {book: req.body.book})
    .write()
    
    res.redirect('/transactions')
})


module.exports = router