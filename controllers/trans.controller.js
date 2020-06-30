const db = require('../db')
const shortid = require('shortid')

// Transactions list
module.exports.transList = (req, res) => res.render('transactions/trans.pug', { transactions: db.get('transactions').value()})

// Search for a user transaction
// Search for a book transaction
module.exports.search = (req, res) => {
    var q = req.query.q
    var matchedTrans = db.get('transactions').value().filter((transaction) => {
        if ((transaction.user.toLowerCase().indexOf(q.toLowerCase()) !== -1) || (transaction.book.toLowerCase().indexOf(q.toLowerCase()) !== -1)) {
            return true
        }
    })
    res.render('transactions/trans.pug', { transactions: matchedTrans, q})
}

// Create transaction router
module.exports.create = (req, res) => {
    var users = db.get('users').value()
    var books = db.get('books').value()
    res.render('transactions/create_trans.pug', {users, books})    
}
// Create new transaction
module.exports.createTrans = (req, res) => {
    req.body.id = shortid.generate()
    db.get('transactions').push(req.body).write()
    res.redirect('/transactions')
}

// View transactions by id
module.exports.viewId = (req,res) => {
    var id = req.params.id
    var transaction = db.get('transactions').find({id: id}).value()
    res.render('transactions/view_trans.pug', {
        transaction: transaction
    })
}

// Delete a transaction
module.exports.delete = (req,res) => {
    var id = req.params.id
    var transaction = db.get('transactions').find({id: id}).value()
    res.render('transactions/delete_trans.pug', {
        transaction: transaction
    })
}

module.exports.deletePost = (req,res) => {
    var id = req.params.id
    var transaction = db.get('transactions').find({id: id}).value()
    
    db.get('transactions')
    .remove({user: transaction.user}, {book: transaction.book})
    .write()
    
    res.redirect('/transactions')
}
// Edit user , book in transactions
module.exports.edit = (req,res) => {
    var id = req.params.id
    var users = db.get('users').value()
    var books = db.get('books').value()
    var transaction = db.get('transactions').find({id: id}).value()
    res.render('transactions/edit_trans.pug', {
        transaction: transaction,users, books
    })
}

module.exports.editId = (req,res) => {
    var id = req.params.id
    var transaction = db.get('transactions').find({id: id}).value()
    
    db.get('transactions')
    .find({user: transaction.user}, {book: transaction.book})
    .assign({ user: req.body.user}, {book: req.body.book})
    .write()
    
    res.redirect('/transactions')
}