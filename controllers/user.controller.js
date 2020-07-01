const db = require('../db')
const shortid = require('shortid')

// user list
module.exports.user = (req, res) => res.render('./users/users.pug', { users: db.get('users').value()})

// search user
module.exports.search = (req, res) => {
    var q = req.query.q
    var matchedUser = db.get('users').value().filter((user) => {
        return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1
    })
    res.render('users/users.pug', { users: matchedUser, q})
}

//create user route
module.exports.create = (req, res) => {
    res.render('users/create_user.pug')    
}

// view user by id

module.exports.userId = (req,res) => {
    var id = req.params.id
    var user = db.get('users').find({id: id}).value()
    res.render('users/view_user.pug', {
        user: user
    })
}

// edit user name, phone
module.exports.edit = (req,res) => {
    var id = req.params.id
    var user = db.get('users').find({id: id}).value()
    res.render('users/edit_user.pug', {
        user: user
    })
}
module.exports.editId = (req,res) => {
    var id = req.params.id
    var user = db.get('users').find({id: id}).value()
    
    db.get('users')
    .find({name: user.name}, {phone: user.phone})
    .assign({ name: req.body.name}, {phone: req.body.phone})
    .write()
    
    res.redirect('/users')
}

// delete user by id

module.exports.delete = (req,res) => {
    var id = req.params.id
    var user = db.get('users').find({id: id}).value()
    res.render('users/delete_user.pug', {
        user: user
    })
}

module.exports.deletePost = (req,res) => {
    var id = req.params.id
    var user = db.get('users').find({id: id}).value()
    
    db.get('users')
    .remove({name: user.name}, {phone: user.phone})
    .write()
    
    res.redirect('/users')
}

// Create new user

module.exports.newUser = (req, res) => {
    req.body.id = shortid.generate()
    
    
        db.get('users').push(req.body).write()
        res.redirect('/users')
    }
    
    
    
    