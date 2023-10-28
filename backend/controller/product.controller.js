const { ProductModel } = require("../models/product.model");

require("dotenv").config();

// ^ create a new product ++++++++++++++++++++++++++++++++++
const createProduct = async (req, res) => {
  try {
    const productData = req.body; // Assuming product data is sent in the request body

    // Create a new product using the ProductModel
    const product = new ProductModel(productData);

    await product.save();

    return res.status(201).json({
      msg: "Product created successfully",
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "An error occurred while creating the product",
      error: error.message,
      success: false,
    });
  }
};

// ^ get a list of all products ++++++++++++++++++++++++++++++++++
const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();

    return res.status(200).json({
      msg: "Retrieved all products successfully",
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "An error occurred while retrieving products",
      error: error.message,
      success: false,
    });
  }
};

// ^ update a product ++++++++++++++++++++++++++++++++++
const updateProduct = async (req, res) => {
  const productId = req.params.productId;
  const updatedData = req.body;

  try {
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    for (const key in updatedData) {
      if (Object.hasOwnProperty.call(updatedData, key)) {
        product[key] = updatedData[key];
      }
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An error occurred while updating the product",
    });
  }
};

// ^ delete a product ++++++++++++++++++++++++++++++++++
const deleteProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    await product.remove();

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An error occurred while deleting the product",
    });
  }
};

// ^ search product ++++++++++++++++++++++++++++++++++
const searchProducts = async (req, res) => {
  const { keywords, category, minPrice, maxPrice } = req.query;

  try {
    const query = {};

    if (keywords) {
      query.$text = { $search: keywords };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice && maxPrice) {
      query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    }

    const products = await ProductModel.find(query);

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An error occurred while searching for products",
    });
  }
};

// ^ add reviews to product ++++++++++++++++++++++++++++++++++
const addProductReview = async (req, res) => {
  const { productId } = req.params;
  const { reviewText, rating } = req.body;

  try {
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    product.reviews.push({
      reviewText,
      rating,
      user: req.userId,
    });

    const totalReviews = product.reviews.length;
    const totalRatings = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const newAverageRating = totalReviews > 0 ? totalRatings / totalReviews : 0;

    product.rating = newAverageRating;
    product.totalReviewCount = totalReviews;
    product.totalReviewSum = totalRatings;

    await product.save();

    return res
      .status(201)
      .json({ success: true, message: "Review added successfully", product });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An error occurred while adding the review",
    });
  }
};

//  ^ add product to wishlist ++++++++++++++++++++++++++++++++++

const addProductToWishlist = async (req, res) => {
  const { productId } = req.params;
  const { userId } = req.body;

  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.wishlist.includes(productId)) {
      return res
        .status(400)
        .json({ success: false, error: "Product is already in the wishlist" });
    }

    user.wishlist.push(productId);

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An error occurred while adding the product to the wishlist",
    });
  }
};

module.exports = { addProductToWishlist };

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  searchProducts,
  addProductReview,
  addProductToWishlist,
};
