// seeding of db with data [run <node indexCategories.js> to seed]

const mongoose = require('mongoose');
const Category = require('./models/category.model');

const categoryList = [
  { "id": 1, "name": "Women", "parent": null },
  { "id": 2, "name": "Clothing", "parent": 1 },
  { "id": 3, "name": "Dresses", "parent": 2 },
  { "id": 4, "name": "Casual Dresses", "parent": 3 },
  { "id": 5, "name": "Summer Dresses", "parent": 4 },
  { "id": 6, "name": "Maxi Dresses", "parent": 4 },
  { "id": 7, "name": "Shift Dresses", "parent": 4 },
  { "id": 8, "name": "Party Dresses", "parent": 3 },
  { "id": 9, "name": "Cocktail Dresses", "parent": 8 },
  { "id": 10, "name": "Evening Gowns", "parent": 8 },
  { "id": 11, "name": "Mini Dresses", "parent": 8 },
  { "id": 12, "name": "T-Shirts", "parent": 1 },
  { "id": 13, "name": "Printed T-shirts", "parent": 12 },
  { "id": 14, "name": "Graphic Tees", "parent": 13 },
  { "id": 15, "name": "Logo Tees", "parent": 13 },
  { "id": 16, "name": "Patterned Tees", "parent": 13 },
  { "id": 17, "name": "Casual T-Shirts", "parent": 12 },
  { "id": 18, "name": "V-Neck Tees", "parent": 17 },
  { "id": 19, "name": "Crew Neck Tees", "parent": 17 },
  { "id": 20, "name": "Sleeveless Tees", "parent": 17 },
  { "id": 21, "name": "Plain T-Shirts", "parent": 12 },
  { "id": 22, "name": "Basic Tees", "parent": 21 },
  { "id": 23, "name": "Solid Color Tees", "parent": 21 },
  { "id": 24, "name": "Long Sleeve Tees", "parent": 21 },
  { "id": 25, "name": "Men", "parent": null },
  { "id": 26, "name": "Footwear", "parent": 25 },
  { "id": 27, "name": "Branded", "parent": 26 },
  { "id": 28, "name": "Nike", "parent": 27 },
  { "id": 29, "name": "Adidas", "parent": 27 },
  { "id": 30, "name": "Puma", "parent": 27 },
  { "id": 31, "name": "Non Branded", "parent": 26 },
  { "id": 32, "name": "Local Brands", "parent": 31 },
  { "id": 33, "name": "Handmade", "parent": 31 },
  { "id": 34, "name": "Budget Options", "parent": 31 },
  { "id": 35, "name": "T-Shirts", "parent": 25 },
  { "id": 36, "name": "Printed T-shirts", "parent": 35 },
  { "id": 37, "name": "Graphic Tees", "parent": 36 },
  { "id": 38, "name": "Logo Tees", "parent": 36 },
  { "id": 39, "name": "Patterned Tees", "parent": 36 },
  { "id": 40, "name": "Casual T-Shirts", "parent": 35 },
  { "id": 41, "name": "V-Neck Tees", "parent": 40 },
  { "id": 42, "name": "Crew Neck Tees", "parent": 40 },
  { "id": 43, "name": "Henley Tees", "parent": 40 },
  { "id": 44, "name": "Plain T-Shirts", "parent": 35 },
  { "id": 45, "name": "Basic Tees", "parent": 44 },
  { "id": 46, "name": "Solid Color Tees", "parent": 44 },
  { "id": 47, "name": "Long Sleeve Tees", "parent": 44 },
  { "id": 48, "name": "Shirts", "parent": 25 },
  { "id": 49, "name": "Party Shirts", "parent": 48 },
  { "id": 50, "name": "Dress Shirts", "parent": 49 },
  { "id": 51, "name": "Club Shirts", "parent": 49 },
  { "id": 52, "name": "Silk Shirts", "parent": 49 },
  { "id": 53, "name": "Casual Shirts", "parent": 48 },
  { "id": 54, "name": "Button Down Shirts", "parent": 53 },
  { "id": 55, "name": "Flannel Shirts", "parent": 53 },
  { "id": 56, "name": "Denim Shirts", "parent": 53 },
  { "id": 57, "name": "Plain Shirts", "parent": 48 },
  { "id": 58, "name": "Oxford Shirts", "parent": 57 },
  { "id": 59, "name": "Poplin Shirts", "parent": 57 },
  { "id": 60, "name": "Chambray Shirts", "parent": 57 }
]


mongoose.connect('mongodb://localhost:27017/mern-app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const insertCategories = async () => {
  try {
    await Category.deleteMany({});
    await Category.insertMany(categoryList);
    console.log('Categories inserted successfully');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error inserting categories:', err);
    mongoose.disconnect();
  }
};

insertCategories();
