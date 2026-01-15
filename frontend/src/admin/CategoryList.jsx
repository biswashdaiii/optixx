import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Box,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import WcIcon from '@mui/icons-material/Wc';
import Layout from '../core/Layout';
import AdminSidebar from '../components/AdminSidebar';
import { isAuthenticated } from '../auth';
import { getCategories } from './apiAdmin';

const CategoryList = () => {
  const { user } = isAuthenticated();
  const [categories, setCategories] = React.useState([]);

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  React.useEffect(() => {
    loadCategories();
  }, []);

  // Organize categories by gender
  const categoriesByGender = {
    Men: categories.filter(cat => cat.gender === 'Men'),
    Women: categories.filter(cat => cat.gender === 'Women'),
    Unisex: categories.filter(cat => cat.gender === 'Unisex'),
  };

  // Get subcategories for a parent
  const getSubcategories = (parentId) => {
    return categories.filter(cat => cat.parentCategory === parentId);
  };

  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'Men':
        return <ManIcon sx={{ color: '#0A6A7A' }} />;
      case 'Women':
        return <WomanIcon sx={{ color: '#DB2777' }} />;
      case 'Unisex':
        return <WcIcon sx={{ color: '#8B5CF6' }} />;
      default:
        return null;
    }
  };

  const getGenderColor = (gender) => {
    switch (gender) {
      case 'Men':
        return '#0A6A7A';
      case 'Women':
        return '#DB2777';
      case 'Unisex':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  const renderCategoryTree = (genderCategories, gender) => {
    const parentCategories = genderCategories.filter(cat => cat.isParent);
    const topLevelCategories = genderCategories.filter(cat => !cat.isParent && !cat.parentCategory);

    return (
      <Box sx={{ mb: 3 }}>
        {/* Parent Categories with Subcategories */}
        {parentCategories.map((parent) => {
          const subcategories = getSubcategories(parent._id);
          return (
            <Accordion key={parent._id} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  {getGenderIcon(gender)}
                  <Typography sx={{ fontWeight: 600, color: '#0A2F68' }}>
                    {parent.name}
                  </Typography>
                  <Chip 
                    label='Parent Category' 
                    size='small' 
                    sx={{ 
                      backgroundColor: `${getGenderColor(gender)}20`,
                      color: getGenderColor(gender),
                      fontWeight: 600,
                      ml: 'auto',
                    }} 
                  />
                  {subcategories.length > 0 && (
                    <Chip 
                      label={`${subcategories.length} subcategories`} 
                      size='small' 
                      sx={{ backgroundColor: '#F3F4F6' }} 
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {subcategories.length > 0 ? (
                  <Box sx={{ pl: 4 }}>
                    {subcategories.map((sub) => (
                      <Box 
                        key={sub._id} 
                        sx={{ 
                          py: 1.5,
                          px: 2,
                          mb: 1,
                          borderLeft: `3px solid ${getGenderColor(gender)}`,
                          backgroundColor: '#F9FAFB',
                          borderRadius: '4px',
                        }}
                      >
                        <Typography variant='body2' sx={{ fontWeight: 500 }}>
                          {sub.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant='body2' color='text.secondary' sx={{ fontStyle: 'italic' }}>
                    No subcategories yet
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}

        {/* Top-level Categories (no parent) */}
        {topLevelCategories.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant='subtitle2' sx={{ color: '#6B7280', mb: 1, px: 2 }}>
              Top-Level Categories
            </Typography>
            {topLevelCategories.map((cat) => (
              <Box 
                key={cat._id} 
                sx={{ 
                  py: 1.5,
                  px: 2,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  border: '1px solid #E5E8EB',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                {getGenderIcon(gender)}
                <Typography sx={{ fontWeight: 500 }}>
                  {cat.name}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Layout
      title='Category List'
      description={`Hey ${user.name} ready to manage categories?`}
    >
      <Grid container spacing={2}>
        <AdminSidebar />
        <Grid size={{ xs: 12, md: 9 }}>
          <Card elevation={3}>
            <CardHeader
              title='Category Management'
              subheader='Organize your products by gender and category'
              sx={{ bgcolor: 'background.paper' }}
            />
            <Divider />
            <CardContent>
              {/* Men's Categories */}
              {categoriesByGender.Men.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      mb: 2,
                      pb: 1,
                      borderBottom: '2px solid #0A6A7A',
                    }}
                  >
                    <ManIcon sx={{ color: '#0A6A7A', fontSize: 28 }} />
                    <Typography variant='h6' sx={{ fontWeight: 700, color: '#0A6A7A' }}>
                      Men's Categories
                    </Typography>
                    <Chip 
                      label={`${categoriesByGender.Men.length} total`} 
                      size='small'
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                  {renderCategoryTree(categoriesByGender.Men, 'Men')}
                </Box>
              )}

              {/* Women's Categories */}
              {categoriesByGender.Women.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      mb: 2,
                      pb: 1,
                      borderBottom: '2px solid #DB2777',
                    }}
                  >
                    <WomanIcon sx={{ color: '#DB2777', fontSize: 28 }} />
                    <Typography variant='h6' sx={{ fontWeight: 700, color: '#DB2777' }}>
                      Women's Categories
                    </Typography>
                    <Chip 
                      label={`${categoriesByGender.Women.length} total`} 
                      size='small'
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                  {renderCategoryTree(categoriesByGender.Women, 'Women')}
                </Box>
              )}

              {/* Unisex Categories */}
              {categoriesByGender.Unisex.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      mb: 2,
                      pb: 1,
                      borderBottom: '2px solid #8B5CF6',
                    }}
                  >
                    <WcIcon sx={{ color: '#8B5CF6', fontSize: 28 }} />
                    <Typography variant='h6' sx={{ fontWeight: 700, color: '#8B5CF6' }}>
                      Unisex Categories
                    </Typography>
                    <Chip 
                      label={`${categoriesByGender.Unisex.length} total`} 
                      size='small'
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                  {renderCategoryTree(categoriesByGender.Unisex, 'Unisex')}
                </Box>
              )}

              {categories.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant='body1' color='text.secondary'>
                    No categories found. Create your first category to get started!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default CategoryList;