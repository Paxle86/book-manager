var express = require('express')
var router = express.Router()
var controller = require('../controllers/trans.controller')

// Transactions list
router.get('/', controller.transList)
// Search for a user transaction
// Search for a book transaction
router.get('/search', controller.search)

// Create transaction router
router.get('/create', controller.create)
// Create new transaction
router.post('/create', controller.createTrans)

// View transactions by id
router.get('/:id', controller.viewId)

// Delete a transaction
router.get('/delete/:id', controller.delete)

router.post('/delete/:id', controller.deletePost)
// Edit user , book in transactions
router.get('/edit/:id', controller.edit)

router.post('/edit/:id', controller.editId)


module.exports = router