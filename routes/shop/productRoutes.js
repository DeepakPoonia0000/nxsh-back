import express from 'express';
import { createProduct } from '../../controllers/seller/productController.js';
import upload from '../../utils/multer.js';

const router = express.Router();

router.post('/createProduct',
    upload.fields([
        { name: "productImages", maxCount: 4 },
        { name: "productVideo", maxCount: 1 },
    ]),
    createProduct
)

export default router;
