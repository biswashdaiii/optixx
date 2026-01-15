import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CircularProgress,
  Typography,
} from '@mui/material';
import Layout from '../core/Layout';
import AdminSidebar from '../components/AdminSidebar';
import { isAuthenticated } from '../auth';
import { createProduct, getCategories } from './apiAdmin';

const AddProduct = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '',
    categories: [],
    gender: '',
    category: '',
    shipping: '',
    quantity: '',
    photo: null,
    model3D: null,
    loading: false,
    error: '',
    createdProduct: '',
    formData: new FormData(),
  });

  const [touched, setTouched] = useState({
    name: false,
    description: false,
    price: false,
    gender: false,
    category: false,
    shipping: false,
    quantity: false,
    photo: false,
    model3D: false,
  });

  const { user, token } = isAuthenticated();

  const {
    name,
    description,
    price,
    categories,
    gender,
    category,
    shipping,
    quantity,
    loading,
    error,
    createdProduct,
    formData,
  } = values;

  // Form validation
  const validate = () => {
    return (
      name.trim() !== '' &&
      description.trim() !== '' &&
      price > 0 &&
      gender !== '' &&
      category !== '' &&
      shipping !== '' &&
      quantity > 0 &&
      formData.get('photo') !== null
    );
  };

  const isFormValid = validate();

  // Load categories
  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, categories: data });
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  // Filter categories by selected gender
  const getFilteredCategories = () => {
    if (!gender) return [];
    return categories.filter(cat => cat.gender === gender);
  };

  // Handle input changes
  const handleChange = (name) => (event) => {
    const value =
      name === 'photo' || name === 'model3D'
        ? event.target.files[0]
        : event.target.value;

    // Update formData
    const newFormData = new FormData();
    for (let [key, val] of formData.entries()) {
      if (key !== name) newFormData.set(key, val);
    }
    if (value) newFormData.set(name, value);

    // Reset category when gender changes
    const updates = { [name]: value, formData: newFormData, error: '' };
    if (name === 'gender') {
      updates.category = '';
    }

    setValues({ ...values, ...updates });
    setTouched({ ...touched, [name]: true });
  };

  const handleBlur = (field) => () => {
    setTouched({ ...touched, [field]: true });
  };

  // Submit form
  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: '', loading: true });

    createProduct(user._id, token, formData).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          name: '',
          description: '',
          photo: null,
          model3D: null,
          price: '',
          quantity: '',
          gender: '',
          category: '',
          shipping: '',
          loading: false,
          createdProduct: data.name,
          formData: new FormData(),
        });
        setTouched({
          name: false,
          description: false,
          price: false,
          gender: false,
          category: false,
          shipping: false,
          quantity: false,
          photo: false,
          model3D: false,
        });
      }
    });
  };

  // Form JSX
  const newPostForm = () => (
    <Box component='form' onSubmit={clickSubmit} sx={{ fullWidth: true }}>
      {/* Product Name */}
      <TextField
        label='Product Name'
        variant='outlined'
        fullWidth
        margin='normal'
        value={name}
        onChange={handleChange('name')}
        onBlur={handleBlur('name')}
        error={touched.name && name.trim() === ''}
        helperText={
          touched.name && name.trim() === '' 
            ? 'Product name is required' 
            : 'e.g., Aviator Classic Sunglasses'
        }
        required
      />

      {/* Description */}
      <TextField
        label='Description'
        variant='outlined'
        fullWidth
        margin='normal'
        multiline
        rows={4}
        value={description}
        onChange={handleChange('description')}
        onBlur={handleBlur('description')}
        error={touched.description && description.trim() === ''}
        helperText={
          touched.description && description.trim() === '' 
            ? 'Description is required' 
            : 'Detailed product description'
        }
        required
      />

      {/* 2D Photo */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant='outlined'
          component='label'
          fullWidth
          color={touched.photo && !formData.get('photo') ? 'error' : 'primary'}
          sx={{ py: 1.5 }}
        >
          {formData.get('photo') ? `Photo: ${formData.get('photo').name}` : 'Upload Product Photo *'}
          <input
            type='file'
            name='photo'
            accept='image/*'
            onChange={handleChange('photo')}
            onBlur={handleBlur('photo')}
            hidden
          />
        </Button>
        {touched.photo && !formData.get('photo') && (
          <FormHelperText error>Product photo is required</FormHelperText>
        )}
        {!touched.photo && (
          <FormHelperText>Upload a clear image of the product</FormHelperText>
        )}
      </Box>

      {/* 3D Model (Optional) */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant='outlined'
          component='label'
          fullWidth
          color='primary'
          sx={{ py: 1.5 }}
        >
          {formData.get('model3D') ? `3D Model: ${formData.get('model3D').name}` : 'Upload 3D Model (Optional)'}
          <input
            type='file'
            name='model3D'
            accept='.glb,.gltf,.obj'
            onChange={handleChange('model3D')}
            onBlur={handleBlur('model3D')}
            hidden
          />
        </Button>
        <FormHelperText>
          Optional: Upload a 3D model for virtual try-on feature
        </FormHelperText>
      </Box>

      {/* Price */}
      <TextField
        label='Price (Rs.)'
        variant='outlined'
        fullWidth
        margin='normal'
        type='number'
        value={price}
        onChange={handleChange('price')}
        onBlur={handleBlur('price')}
        error={touched.price && (price === '' || price <= 0)}
        helperText={
          touched.price && (price === '' || price <= 0) 
            ? 'Price must be greater than 0' 
            : 'Enter price in Nepali Rupees'
        }
        required
        inputProps={{ min: 0, step: 0.01 }}
      />

      {/* Quantity */}
      <TextField
        label='Quantity in Stock'
        variant='outlined'
        fullWidth
        margin='normal'
        type='number'
        value={quantity}
        onChange={handleChange('quantity')}
        onBlur={handleBlur('quantity')}
        error={touched.quantity && (quantity === '' || quantity <= 0)}
        helperText={
          touched.quantity && (quantity === '' || quantity <= 0) 
            ? 'Quantity must be greater than 0' 
            : 'Available stock quantity'
        }
        required
        inputProps={{ min: 0 }}
      />

      <Divider sx={{ my: 3 }} />

      <Typography variant='h6' sx={{ mb: 2, fontWeight: 600, color: '#0A2F68' }}>
        Product Classification
      </Typography>

      {/* Gender Selection */}
      <FormControl fullWidth margin='normal' error={touched.gender && gender === ''}>
        <InputLabel id='gender-label'>Gender *</InputLabel>
        <Select
          labelId='gender-label'
          value={gender}
          label='Gender *'
          onChange={handleChange('gender')}
          onBlur={handleBlur('gender')}
        >
          <MenuItem value=''><em>Select gender</em></MenuItem>
          <MenuItem value='Men'>Men</MenuItem>
          <MenuItem value='Women'>Women</MenuItem>
          <MenuItem value='Unisex'>Unisex</MenuItem>
        </Select>
        {touched.gender && gender === '' && (
          <FormHelperText>Gender is required</FormHelperText>
        )}
        {!touched.gender && (
          <FormHelperText>Select the target gender for this product</FormHelperText>
        )}
      </FormControl>

      {/* Category Selection (filtered by gender) */}
      <FormControl 
        fullWidth 
        margin='normal' 
        error={touched.category && category === ''}
        disabled={!gender}
      >
        <InputLabel id='category-label'>Category *</InputLabel>
        <Select
          labelId='category-label'
          value={category}
          label='Category *'
          onChange={handleChange('category')}
          onBlur={handleBlur('category')}
        >
          <MenuItem value=''><em>Select a category</em></MenuItem>
          {getFilteredCategories().map((c) => (
            <MenuItem key={c._id} value={c._id}>
              {c.name}
              {c.parentCategory && ' (Subcategory)'}
              {c.isParent && ' (Parent)'}
            </MenuItem>
          ))}
        </Select>
        {touched.category && category === '' && (
          <FormHelperText>Category is required</FormHelperText>
        )}
        {!gender && (
          <FormHelperText>Select gender first to see available categories</FormHelperText>
        )}
        {gender && getFilteredCategories().length === 0 && (
          <FormHelperText error>
            No categories available for {gender}. Please create categories first.
          </FormHelperText>
        )}
        {gender && getFilteredCategories().length > 0 && !touched.category && (
          <FormHelperText>
            Select the product category from {gender}'s collection
          </FormHelperText>
        )}
      </FormControl>

      {/* Shipping */}
      <FormControl fullWidth margin='normal' error={touched.shipping && shipping === ''}>
        <InputLabel id='shipping-label'>Shipping Available *</InputLabel>
        <Select
          labelId='shipping-label'
          value={shipping}
          label='Shipping Available *'
          onChange={handleChange('shipping')}
          onBlur={handleBlur('shipping')}
        >
          <MenuItem value=''><em>Select shipping option</em></MenuItem>
          <MenuItem value='0'>No</MenuItem>
          <MenuItem value='1'>Yes</MenuItem>
        </Select>
        {touched.shipping && shipping === '' && (
          <FormHelperText>Shipping option is required</FormHelperText>
        )}
        {!touched.shipping && (
          <FormHelperText>Is this product available for shipping?</FormHelperText>
        )}
      </FormControl>

      <Button
        type='submit'
        variant='contained'
        fullWidth
        size='large'
        sx={{ 
          mt: 4,
          py: 1.5,
          backgroundColor: '#0A2F68',
          '&:hover': {
            backgroundColor: '#082554',
          },
        }}
        disabled={!isFormValid || loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Create Product'}
      </Button>
    </Box>
  );

  return (
    <Layout
      title='Add a new product'
      description={`Hey ${user.name}, ready to add a new product?`}
    >
      <Grid container spacing={2}>
        <AdminSidebar />
        <Grid size={{ xs: 12, md: 9 }}>
          <Card elevation={3}>
            <CardHeader 
              title='Add New Product' 
              subheader='Fill in the product details below'
              sx={{ bgcolor: 'background.paper' }} 
            />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                {error && <Alert severity='error'>{error}</Alert>}
                {createdProduct && (
                  <Alert severity='success'>
                    {`${createdProduct} has been created successfully!`}
                  </Alert>
                )}
                {newPostForm()}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default AddProduct;