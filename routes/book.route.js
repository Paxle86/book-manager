var express = require('express')
var router = express.Router()
var controller = require('../controllers/book.controller')


// Books list
router.get('/', controller.bookList)

// Search for a book
router.get('/search', controller.searchBook)

// Create book router
router.get('/create', controller.bookRoute)

// View book by id
router.get('/:id', controller.view)

// Edit book title
router.get('/edit/:id', controller.edit)

router.post('/edit/:id', controller.editId)

// Delete a book
router.get('/delete/:id', controller.delete)

router.post('/delete/:id', controller.deletePost)

// Create new book
router.post('/create', controller.create)



module.exports = router