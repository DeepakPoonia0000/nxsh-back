import express from 'express';
import { addCategoryHierarchy } from '../../controllers/seller/categoryController.js';


const router = express.Router();

router.post('/createCategory', addCategoryHierarchy)

export default router;
