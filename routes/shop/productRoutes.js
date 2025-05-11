import express from 'express';
import { createProduct, getShopProduct } from '../../controllers/seller/productController.js';
import upload from '../../utils/multer.js';
import { getCategoryTree } from '../../controllers/seller/categoryController.js';
import authenticate from '../../middlewares/seller/shopMiddleware.js';

const router = express.Router();

router.post('/createProduct', authenticate,
    upload.fields([
        { name: "productImages", maxCount: 4 },
        // { name: "productVideo", maxCount: 1 },
    ]),
    createProduct
);



router.get('/getShopProducts',
    authenticate,
    getShopProduct
)

router.get('/categoryTree',
    authenticate,
    getCategoryTree
)

export default router;
