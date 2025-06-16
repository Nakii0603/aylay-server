import cloudinary from "../utils/cloudinary.js";
import Product from "../models/Product.js";
import { v4 as uuidv4 } from "uuid";

export const uploadProduct = async (req, res) => {
  try {
    const { title, content, price, category, subCategory, createdBy } = req.body;

    if (!title || !content || !price || !category || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "Title, content, price, category, and createdBy are required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required.",
      });
    }

    // Upload the image to Cloudinary with transformations (resize)
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
      resource_type: "image",
      transformation: [
        { width: 1000, crop: "scale" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    const customProductId = uuidv4();
    const newProduct = new Product({
      title,
      content,
      price,
      category,
      subCategory,
      createdBy,
      productId: customProductId,
      image: result.secure_url,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product uploaded successfully!",
      product: newProduct,
    });
  } catch (err) {
    console.error("Error during upload:", err.message);
    res.status(500).json({
      success: false,
      message: "Error uploading product or saving to database.",
      error: err.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Update image if a new one is uploaded
    if (req.file) {
      if (product.image) {
        const publicId = product.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
        resource_type: "image",
        transformation: [
          { width: 1000, crop: "scale" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      product.image = result.secure_url;
    }

    // Update only provided fields
    const updatableFields = ['title', 'content', 'price', 'category', 'subCategory'];
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product,
    });
  } catch (err) {
    console.error("Error during update:", err.message);
    res.status(500).json({
      success: false,
      message: "Error updating product.",
      error: err.message,
    });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found.",
      });
    }

    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    console.error("Error during fetching products:", err.message);
    res.status(500).json({
      success: false,
      message: "Error fetching products from the database.",
      error: err.message,
    });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Delete image from Cloudinary
    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }

    await Product.deleteOne({ productId });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({
      success: false,
      message: "Error deleting product.",
      error: err.message,
    });
  }
};

export const getProductsByCreator = async (req, res) => {
  try {
    const { createdBy } = req.params;

    if (!createdBy) {
      return res.status(400).json({
        success: false,
        message: "createdBy parameter is required.",
      });
    }

    const products = await Product.find({ createdBy });

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    console.error("Error fetching products by creator:", err.message);
    res.status(500).json({
      success: false,
      message: "Error retrieving products by creator.",
      error: err.message,
    });
  }
};
