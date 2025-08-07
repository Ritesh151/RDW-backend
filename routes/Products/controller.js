const productModel = require("./model");
const path = require("path");
const fs = require("fs");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      measurements,
      materialUsed,
      description,
      otherDescription,
    } = req.body;

    if (!req.files || !req.files.productImage) {
      return res
        .status(400)
        .json({ response: false, message: "Product image is required." });
    }

    // Get the uploaded product image
    const productImage = req.files.productImage;

    // Validate file type (optional)
    const allowedExtensions = /png|jpeg|jpg/;
    const extension = path.extname(productImage.name).toLowerCase();
    if (!allowedExtensions.test(extension)) {
      return res.status(400).json({
        response: false,
        message: "Invalid file type. Only PNG, JPEG, and JPG are allowed.",
      });
    }

    // Save the product image to a directory
    const uploadPath = path.join(__dirname, "../uploads", productImage.name);
    await productImage.mv(uploadPath); // Move file to the desired path

    // Handle other images
    const otherImages = req.files.otherImages;
    const otherImagesPaths = [];
    if (otherImages) {
      if (Array.isArray(otherImages)) {
        for (const image of otherImages) {
          const otherImagePath = path.join(__dirname, "../uploads", image.name);
          await image.mv(otherImagePath);
          otherImagesPaths.push(otherImagePath);
        }
      } else {
        const otherImagePath = path.join(
          __dirname,
          "../uploads",
          otherImages.name
        );
        await otherImages.mv(otherImagePath);
        otherImagesPaths.push(otherImagePath);
      }
    }

    // Save product details to the database (pseudo-code)
    const newProduct = new productModel({
      name,
      price,
      category,
      measurements,
      materialUsed,
      description,
      otherDescription,
      productImage: `/uploads/${productImage.name}`,
      otherImages: otherImagesPaths.map(
        (imgPath) => `/uploads/${path.basename(imgPath)}`
      ),
    });

    // Simulate database save
    const result = await newProduct.save();

    res.status(201).json({
      response: true,
      message: "Product added successfully!",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: false, error: error.message });
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    if (products.length === 0) {
      return res
        .status(404)
        .json({ response: false, message: "No Product Created Yet!" });
    }
    res.status(200).json({
      response: true,
      message: "All Products Fetched!",
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: false, error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ response: false, message: "Product Not Found!" });
    }
    res.status(200).json({
      response: true,
      message: "Product Fetched Successfully!",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: false, error: error.message });
  }
};

exports.updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      category,
      measurements,
      materialUsed,
      description,
      otherDescription,
    } = req.body;

    // Fetch the current product from the database
    const currentProduct = await productModel.findById(id);
    if (!currentProduct) {
      return res
        .status(404)
        .json({ response: false, message: "Product Not Found!" });
    }

    let updatedData = {
      name: name || currentProduct.name,
      price: price || currentProduct.price,
      category:category || currentProduct.category,
      measurements: measurements || currentProduct.measurements,
      materialUsed: materialUsed || currentProduct.materialUsed,
      description: description || currentProduct.description,
      otherDescription: otherDescription || currentProduct.otherDescription,
    };

    // Handle `productImage` (replace if provided, keep old if not)
    if (req.files && req.files.productImage) {
      const productImage = req.files.productImage;

      // Validate file type
      const allowedExtensions = /png|jpeg|jpg/;
      const extension = path.extname(productImage.name).toLowerCase();
      if (!allowedExtensions.test(extension)) {
        return res.status(400).json({
          response: false,
          message: "Invalid file type. Only PNG, JPEG, and JPG are allowed.",
        });
      }

      // Save the new product image
      const uploadPath = path.join(__dirname, "../uploads", productImage.name);
      await productImage.mv(uploadPath);

      // Add the new product image path to the updated data
      updatedData.productImage = `/uploads/${productImage.name}`;
    } else {
      // Keep the old product image if no new one is provided
      updatedData.productImage = currentProduct.productImage;
    }

    // Handle `otherImages` (append new ones to existing)
    if (req.files && req.files.otherImages) {
      const otherImages = req.files.otherImages;
      const otherImagesPaths = currentProduct.otherImages || [];

      if (Array.isArray(otherImages)) {
        for (const image of otherImages) {
          const otherImagePath = path.join(__dirname, "../uploads", image.name);
          await image.mv(otherImagePath);
          otherImagesPaths.push(`/uploads/${path.basename(otherImagePath)}`);
        }
      } else {
        const otherImagePath = path.join(
          __dirname,
          "../uploads",
          otherImages.name
        );
        await otherImages.mv(otherImagePath);
        otherImagesPaths.push(`/uploads/${path.basename(otherImagePath)}`);
      }

      // Add the merged list of other images to the updated data
      updatedData.otherImages = otherImagesPaths;
    } else {
      // Keep the old other images if no new ones are provided
      updatedData.otherImages = currentProduct.otherImages;
    }

    // Update the product in the database
    const result = await productModel.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
    });

    res
      .status(200)
      .json({ response: true, message: "Product Updated!", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: false, error: error.message });
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productModel.findByIdAndDelete(id);
    if (!result) {
      return res
        .status(404)
        .json({ response: false, message: "Product Not Found!" });
    }
    res
      .status(200)
      .json({ response: true, message: "Product Deleted Succesfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: false, error: error.message });
  }
};
