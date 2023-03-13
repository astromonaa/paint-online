const ImageController = require('../controllers/ImageController')

const router = require('express').Router()

router.get('/image', ImageController.getCanvas)
router.post('/image', ImageController.saveCanvas)

module.exports = router