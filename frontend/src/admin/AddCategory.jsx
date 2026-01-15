import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import Layout from '../core/Layout';
import AdminSidebar from '../components/AdminSidebar';
import { isAuthenticated } from '../auth';
import { createCategory, getCategories } from './apiAdmin';

const AddCategory = () => {
  const [values, setValues] = useState({
    name: '',
    gender: '',
    parentCategory: '',
    isParent: false,
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAuthenticated();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        // Filter only parent categories for the dropdown
        const parentCats = data.filter(cat => cat.isParent === true);
        setCategories(parentCats);
      }
    });
  };

  const handleChange = (field) => (e) => {
    setError('');
    setSuccess(false);
    setValues({ ...values, [field]: e.target.value });
  };

  const handleIsParentChange = (e) => {
    const isParent = e.target.value === 'parent';
    setValues({ 
      ...values, 
      isParent,
      parentCategory: isParent ? '' : values.parentCategory 
    });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Prepare category data
    const categoryData = {
      name: values.name,
      gender: values.gender,
      isParent: values.isParent,
      parentCategory: values.isParent ? null : values.parentCategory || null,
    };

    createCategory(user._id, token, categoryData).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setError('');
        setSuccess(true);
        setValues({
          name: '',
          gender: '',
          parentCategory: '',
          isParent: false,
        });
        loadCategories(); // Reload categories
      }
    });
  };

  // Filter parent categories by selected gender
  const getFilteredParentCategories = () => {
    if (!values.gender) return [];
    return categories.filter(cat => cat.gender === values.gender);
  };

  const newCategoryForm = () => (
    <Box
      component='form'
      onSubmit={clickSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        maxWidth: 500,
        width: '100%',
      }}
    >
      {/* Category Name */}
      <TextField
        label='Category Name'
        variant='outlined'
        value={values.name}
        onChange={handleChange('name')}
        required
        fullWidth
        helperText='e.g., Sunglasses, Eyeglasses, Sports Glasses'
      />

      {/* Gender Selection */}
      <FormControl fullWidth required>
        <InputLabel>Gender</InputLabel>
        <Select
          value={values.gender}
          onChange={handleChange('gender')}
          label='Gender'
        >
          <MenuItem value='Men'>Men</MenuItem>
          <MenuItem value='Women'>Women</MenuItem>
          <MenuItem value='Unisex'>Unisex</MenuItem>
        </Select>
        <FormHelperText>Select the target gender for this category</FormHelperText>
      </FormControl>

      {/* Category Type */}
      <FormControl fullWidth required>
        <InputLabel>Category Type</InputLabel>
        <Select
          value={values.isParent ? 'parent' : 'subcategory'}
          onChange={handleIsParentChange}
          label='Category Type'
        >
          <MenuItem value='parent'>Parent Category (Main Section)</MenuItem>
          <MenuItem value='subcategory'>Subcategory</MenuItem>
        </Select>
        <FormHelperText>
          {values.isParent 
            ? 'This will be a main category section' 
            : 'This will be nested under a parent category'}
        </FormHelperText>
      </FormControl>

      {/* Parent Category Selection (only show if not creating parent) */}
      {!values.isParent && (
        <FormControl fullWidth>
          <InputLabel>Parent Category (Optional)</InputLabel>
          <Select
            value={values.parentCategory}
            onChange={handleChange('parentCategory')}
            label='Parent Category (Optional)'
            disabled={!values.gender}
          >
            <MenuItem value=''>
              <em>None (Top Level)</em>
            </MenuItem>
            {getFilteredParentCategories().map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name} ({cat.gender})
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {!values.gender 
              ? 'Select gender first to see available parent categories'
              : 'Select a parent category or leave empty for top-level'}
          </FormHelperText>
        </FormControl>
      )}

      <Button
        type='submit'
        variant='contained'
        size='large'
        sx={{ 
          alignSelf: 'flex-start', 
          px: 4,
          backgroundColor: '#0A2F68',
          '&:hover': {
            backgroundColor: '#082554',
          },
        }}
      >
        Create Category
      </Button>
    </Box>
  );

  const showSuccess = () => {
    if (success) {
      return (
        <Alert severity='success' sx={{ width: '100%' }}>
          Category <strong>{values.name}</strong> has been created successfully!
        </Alert>
      );
    }
  };

  const showError = () => {
    if (error) {
      return (
        <Alert severity='error' sx={{ width: '100%' }}>
          {error}
        </Alert>
      );
    }
  };

  const goBack = () => (
    <Button
      component={Link}
      to='/admin/dashboard'
      variant='outlined'
      sx={{ mt: 2 }}
    >
      Back to Dashboard
    </Button>
  );

  return (
    <Layout
      title='Add a new category'
      description={`Hey ${user.name}, ready to add a new category?`}
    >
      <Grid container spacing={2}>
        <AdminSidebar />
        <Grid size={{ xs: 12, md: 9 }}>
          <Card elevation={3}>
            <CardHeader
              title='Add New Category'
              sx={{ bgcolor: 'background.paper' }}
            />
            <Divider />
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  alignItems: 'flex-start',
                }}
              >
                {showSuccess()}
                {showError()}
                {newCategoryForm()}
                {goBack()}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default AddCategory;