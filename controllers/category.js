const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.categoryById = async (req, res, next, id) => {
  try {
    const category = await Category.findById(id)
      .populate('parentCategory', 'name gender')
      .exec();
    if (!category) {
      return res.status(400).json({
        error: "Category doesn't exist",
      });
    }
    req.category = category;
    next();
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.create = async (req, res) => {
  const category = new Category(req.body);
  try {
    const data = await category.save();
    // Populate parent category details before sending response
    const populatedData = await Category.findById(data._id)
      .populate('parentCategory', 'name gender')
      .exec();
    res.json({ data: populatedData });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.read = (req, res) => {
  return res.json(req.category);
};

exports.update = async (req, res) => {
  const category = req.category;
  
  // Update all fields from request body
  category.name = req.body.name;
  category.gender = req.body.gender;
  category.isParent = req.body.isParent;
  category.parentCategory = req.body.parentCategory || null;
  
  try {
    const data = await category.save();
    // Populate parent category details
    const populatedData = await Category.findById(data._id)
      .populate('parentCategory', 'name gender')
      .exec();
    res.json(populatedData);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.remove = async (req, res) => {
  const category = req.category;
  
  try {
    // Check if this is a parent category with children
    if (category.isParent) {
      const childrenCount = await Category.countDocuments({ 
        parentCategory: category._id 
      });
      
      if (childrenCount > 0) {
        return res.status(400).json({
          error: `Cannot delete this parent category. It has ${childrenCount} subcategories. Please delete or reassign subcategories first.`
        });
      }
    }
    
    await category.remove();
    res.json({
      message: 'Category deleted successfully',
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.list = async (req, res) => {
  try {
    const data = await Category.find()
      .populate('parentCategory', 'name gender')
      .sort({ gender: 1, isParent: -1, name: 1 }) // Sort by gender, then parents first, then name
      .exec();
    res.json(data);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

// New endpoint: Get categories by gender
exports.listByGender = async (req, res) => {
  const { gender } = req.params;
  
  try {
    const data = await Category.find({ gender })
      .populate('parentCategory', 'name gender')
      .sort({ isParent: -1, name: 1 })
      .exec();
    res.json(data);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

// New endpoint: Get parent categories only
exports.listParents = async (req, res) => {
  try {
    const data = await Category.find({ isParent: true })
      .sort({ gender: 1, name: 1 })
      .exec();
    res.json(data);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

// New endpoint: Get subcategories of a parent
exports.listSubcategories = async (req, res) => {
  const { parentId } = req.params;
  
  try {
    const data = await Category.find({ parentCategory: parentId })
      .populate('parentCategory', 'name gender')
      .sort({ name: 1 })
      .exec();
    res.json(data);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};