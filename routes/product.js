const express = require('express');
const isGuarded = require('../middleware/isLoggedIn')

const router = express.Router();
const productController = require('../controllers/product');
const { body } = require('express-validator');

router.get('/products', productController.allProducts);

router.get('/product/:productId', productController.product);

router.post('/product', isGuarded, [
    body('name').trim().isLength({ min: 4 }),
    body('image').trim(),
    body('rate').trim().isNumeric({ no_symbols: true }),
    body('category').trim(),
    body('description').trim(),
], productController.createProduct)

router.put('/product/:productId', isGuarded, [
    body('name').trim().isLength({ min: 4 }),
    body('image').trim(),
    body('rate').trim().isNumeric({ no_symbols: true }),
    body('category').trim(),
    body('description').trim(),
], productController.updateProduct)

router.delete('/product/:productId', isGuarded, productController.deleteProduct);

module.exports = router;
