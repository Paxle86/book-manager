var express = require('express')
var router = express.Router()
const db = require('../db')
const shortid = require('shortid')

// Users list
router.get('/', (req, res) => res.render('./users/users.pug', { users: db.get('users').value()}))


// Search for a user
router.get('/search', (req, res) => {
    var q = req.query.q
    var matchedUser = db.get('users').value().filter((user) => {
        return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1
    })
    res.render('users/users.pug', { users: matchedUser, q})
})



// Create user router
router.get('/create', (req, res) => {
    res.render('users/create_user.pug')    
})


// View user by id
router.get('/:id', (req,res) => {
    var id = req.params.id
    var user = db.get('users').find({id: id}).value()
    res.render('users/view_user.pug', {
        user: user
    })
})



// Edit user name, phone number
router.get('/edit/:id', (req,res) => {
    var id = req.params.id
    var user = db.get('users').find({id: id}).value()
    res.render('users/edit_user.pug', {
        user: user
    })
})

router.post('/edit/:id', (req,res) => {
    var id = req.params.id
    var user = db.get('users').find({id: id}).value()
    
    db.get('users')
    .find({name: user.name}, {phone: user.phone})
    .assign({ name: req.body.name}, {phone: req.body.phone})
    .write()
    
    res.redirect('/users')
})


// Delete a user
router.get('/delete/:id', (req,res) => {
    var id = req.params.id
    var user = db.get('users').find({id: id}).value()
    res.render('users/delete_user.pug', {
        user: user
    })
})

router.post('/delete/:id', (req,res) => {
    var id = req.params.id
    var user = db.get('users').find({id: id}).value()
    
    db.get('users')
    .remove({name: user.name}, {phone: user.phone})
    .write()
    
    res.redirect('/users')
})



// Create new user
router.post('/create', (req, res) => {
    req.body.id = shortid.generate()
    db.get('users').push(req.body).write()
    res.redirect('/users')
})

module.exports = router