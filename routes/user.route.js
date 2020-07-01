var express = require('express')
var router = express.Router()

var controller = require('../controllers/user.controller')
var validate = require('../validate/user.validate')
// Users list
router.get('/', controller.user)


// Search for a user
router.get('/search', controller.search)



// Create user router
router.get('/create', controller.create)


// View user by id
router.get('/:id', controller.userId)



// Edit user name, phone number
router.get('/edit/:id', controller.edit)

router.post('/edit/:id', controller.editId)


// Delete a user
router.get('/delete/:id', controller.delete)

router.post('/delete/:id', controller.deletePost)



// Create new user
router.post('/create', validate.userValidate, controller.newUser)

module.exports = router