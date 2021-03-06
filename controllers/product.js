const { validationResult } = require('express-validator');
const Product = require('../models/product');




exports.allProducts = (req, res, next) => {
    Product.find().then(products => {
        res.status(200).json({ products: products });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).then(product => {
        if (!product) {
            const error = new Error('No item found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ product: product });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.createProduct = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Validation failed', errors: errors.array() })
    }
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        rate: req.body.rate,
        category: req.body.category,
        description: req.body.description,
    });

    product.save().then(productDetails => {
        console.log(productDetails);
        res.status(200).json({
            message: 'Product saved!',
            product: productDetails
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.updateProduct = (req, res, next) => {
    const productId = req.params.productId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    Product.findById(productId).then(product => {
        if (!product) {
            const error = new Error('No item found');
            error.statusCode = 404;
            throw error;
        }
        product.name = req.body.name;
        product.image = req.body.image;
        product.rate = req.body.rate;
        product.category = req.body.category;
        product.description = req.body.description;
        return product.save();
    }).then(details => {
        res.status(200).json({ message: 'Product updated!', product: details });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.deleteProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                const error = new Error('No item found');
                error.statusCode = 404;
                throw error;
            }
            return Product.findByIdAndRemove(productId)
        }).then(productDeleted => {
            res.status(200).json({ message: 'Product deleted', product: productDeleted });
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
