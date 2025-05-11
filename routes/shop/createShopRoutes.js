import express from 'express';
import upload from '../../utils/multer.js';
import { getLevelOneCategories } from '../../controllers/seller/categoryController.js';
import authenticate from '../../middlewares/seller/sellerMiddleware.js';
import { createShop, getUserShop } from '../../controllers/seller/shopController.js';

const router = express.Router();

router.post('/createShop',
    authenticate,
    upload.fields([
        { name: "shopImage", maxCount: 1 },
    ]),
    createShop
);

router.get('/getShop', authenticate, getUserShop)
router.get('/categories',
    authenticate,
    getLevelOneCategories
)

export default router;
