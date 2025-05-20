const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route POST /api/products
// @desc Create a new product
// @access Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Server error' });
  }
});

// @route PUT /api/products/:id
// @desc Update a product by ID
// @access Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product Not Found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route DELETE /api/products/:id
// @desc Delete a product by ID
// @access Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product Removed!' });
    } else {
      res.status(404).json({ message: 'Product Not Found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route GET /api/products
// @desc Get all products with optional filters
// @access Public
router.get('/', async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {};
   
    // Filter logic
    

// Normalize and build filters
if (collection && collection.trim().toLowerCase() !== "all") {
  query.collections = { $regex: new RegExp(`^${collection.trim()}`, "i") };
}

if (category && category.trim().toLowerCase() !== "all") {
  query.category = { $regex: new RegExp(`^${category.trim()}`, "i") };
}

if (gender && gender.trim() !== "") {
  query.gender = { $regex: new RegExp(`^${gender.trim()}`, "i") };
}

if (material && material.trim() !== "") {
  query.material = { $in: material.split(",").map(m => m.trim()) };
}

if (brand && brand.trim() !== "") {
  query.brand = { $in: brand.split(",").map(b => b.trim()) };
}

if (size && size.trim() !== "") {
  const normalizedSizes = size.split(",").map(s => s.toLowerCase().trim());
  query.sizes = { $in: normalizedSizes };
}

if (color && color.trim() !== "") {
  query.colors = { $in: color.split(",").map(c => c.trim()) };
}

if (minPrice || maxPrice) {
  query.price = {};
  if (minPrice) query.price.$gte = Number(minPrice);
  if (maxPrice) query.price.$lte = Number(maxPrice);
}

if (search && search.trim() !== "") {
  query.$or = [
    { name: { $regex: search.trim(), $options: "i" } },
    { description: { $regex: search.trim(), $options: "i" } },
  ];
}
    // if (collection && collection.toLowerCase() !== 'all') {
    //   query.collections = { $regex: new RegExp(`^${collection}$`, 'i') };
    // }

    // if (category && category.toLowerCase() !== 'all') {
    //   query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    // }
    // if (gender) {
    //   query.gender = { $regex: new RegExp(`^${gender}$`, 'i') };
    // }

    // if (material && material.trim() !== "") {
    //   query.material = { $in: material.split(",") };
    // }
    // if (brand && brand.trim() !== "") {
    //   query.brand = { $in: brand.split(",") };
    // }

    // if (size) {
    //   const normalizedSizes = size.split(",").map(s => s.toLowerCase());
    //   query.sizes = { $in: normalizedSizes };
    // }

    // if (color) {
    //   query.colors = { $in: [color] };
    // }

    // if (minPrice || maxPrice) {
    //   query.price = {};
    //   if (minPrice) query.price.$gte = Number(minPrice);
    //   if (maxPrice) query.price.$lte = Number(maxPrice); // ✅ Corrected
    // }

    // if (search) {
    //   query.$or = [
    //     { name: { $regex: search, $options: 'i' } },
    //     { description: { $regex: search, $options: 'i' } },
    //   ];
    // }

    // Sort Logic
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case 'priceAsc':
          sort = { price: 1 };
          break;
        case 'priceDesc':
          sort = { price: -1 };
          break;
        case 'popularity':
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }
    console.log("Final query:", query);
    const products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route GET /api/products/best-seller
// @desc Retrieve the highest-rated product
// @access Public
router.get('/best-seller', async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 });
    if (bestSeller) {
      res.json(bestSeller);
    } else {
      res.status(404).json({ message: 'No best seller found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route GET /api/products/new-arrivals
// @desc Get latest 8 products
// @access Public
router.get('/new-arrivals', async (req, res) => {
  try {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(newArrivals);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route GET /api/products/:id
// @desc Get a single product by ID
// @access Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product Not Found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route GET /api/products/similar/:id
// @desc Get 4 similar products by gender + category
// @access Public
router.get('/similar/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const similarProducts = await Product.find({
      _id: { $ne: product._id },
      gender: product.gender,
      category: product.category,
    }).limit(4);

    res.json(similarProducts);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;