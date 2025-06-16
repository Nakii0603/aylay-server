import express from "express";
import upload from "../middleware/multer.js";
import {
    uploadProduct,
    updateProduct,
    getAllProducts,
    deleteProduct,
    getProductsByCreator
} from "../controllers/productController.js";


const router = express.Router();

router.get("/getAllProducts", getAllProducts);
router.get("/getAllShopPruduct/:createdBy", getProductsByCreator);
router.post("/upload", upload.single("image"), uploadProduct);
router.put("/update/:productId", upload.single("image"), updateProduct);
router.delete("/delete/:productId", deleteProduct);

export default router;
