import React, { useState } from 'react';
import {
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  FormControl,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import WcIcon from '@mui/icons-material/Wc';

// Color palette
const PRIMARY_COLOR = '#0A6A7A';
const SECONDARY_COLOR = '#0A2F68';

const CategoriesFilter = ({ categories, handleFilters }) => {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState(['Men', 'Women', 'Unisex']);

  const handleToggle = (categoryId) => {
    const currentIndex = checked.indexOf(categoryId);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(categoryId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    handleFilters(newChecked);
  };

  const handleAccordionChange = (gender) => {
    setExpanded((prev) =>
      prev.includes(gender)
        ? prev.filter((g) => g !== gender)
        : [...prev, gender]
    );
  };

  // Organize categories by gender
  const categoriesByGender = {
    Men: categories.filter((cat) => cat.gender === 'Men'),
    Women: categories.filter((cat) => cat.gender === 'Women'),
    Unisex: categories.filter((cat) => cat.gender === 'Unisex'),
  };

  // Get subcategories for a parent
  const getSubcategories = (parentId, genderCategories) => {
    return genderCategories.filter((cat) => cat.parentCategory === parentId);
  };

  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'Men':
        return <ManIcon sx={{ color: PRIMARY_COLOR, fontSize: 22 }} />;
      case 'Women':
        return <WomanIcon sx={{ color: '#DB2777', fontSize: 22 }} />;
      case 'Unisex':
        return <WcIcon sx={{ color: '#8B5CF6', fontSize: 22 }} />;
      default:
        return null;
    }
  };

  const getGenderColor = (gender) => {
    switch (gender) {
      case 'Men':
        return PRIMARY_COLOR;
      case 'Women':
        return '#DB2777';
      case 'Unisex':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  const renderCategorySection = (genderCategories, gender) => {
    if (genderCategories.length === 0) return null;

    const parentCategories = genderCategories.filter((cat) => cat.isParent);
    const topLevelCategories = genderCategories.filter(
      (cat) => !cat.isParent && !cat.parentCategory
    );

    return (
      <Accordion
        expanded={expanded.includes(gender)}
        onChange={() => handleAccordionChange(gender)}
        sx={{
          boxShadow: 'none',
          border: '1px solid #E5E8EB',
          borderRadius: '8px !important',
          mb: 2,
          '&:before': { display: 'none' },
          overflow: 'hidden',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: '#F8F9FA',
            minHeight: '56px',
            '&:hover': {
              backgroundColor: '#F0F1F3',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {getGenderIcon(gender)}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                color: getGenderColor(gender),
              }}
            >
              {gender}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#6B7280',
                backgroundColor: 'white',
                px: 1,
                py: 0.25,
                borderRadius: '12px',
                fontWeight: 600,
              }}
            >
              {genderCategories.length}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          {/* Parent Categories with Subcategories */}
          {parentCategories.map((parent) => {
            const subcategories = getSubcategories(parent._id, genderCategories);
            return (
              <Box key={parent._id} sx={{ mb: 1 }}>
                {/* Parent Category Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked.includes(parent._id)}
                      onChange={() => handleToggle(parent._id)}
                      sx={{
                        color: getGenderColor(gender),
                        '&.Mui-checked': {
                          color: getGenderColor(gender),
                        },
                      }}
                      size="small"
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {parent.name}
                    </Typography>
                  }
                  sx={{
                    width: '100%',
                    m: 0,
                    px: 2,
                    py: 1,
                    '&:hover': {
                      backgroundColor: '#F8F9FA',
                    },
                  }}
                />

                {/* Subcategories */}
                {subcategories.length > 0 && (
                  <Box sx={{ pl: 5, pr: 2, pb: 1 }}>
                    {subcategories.map((sub) => (
                      <FormControlLabel
                        key={sub._id}
                        control={
                          <Checkbox
                            checked={checked.includes(sub._id)}
                            onChange={() => handleToggle(sub._id)}
                            sx={{
                              color: getGenderColor(gender),
                              '&.Mui-checked': {
                                color: getGenderColor(gender),
                              },
                            }}
                            size="small"
                          />
                        }
                        label={
                          <Typography sx={{ fontSize: '0.9rem', color: '#4B5563' }}>
                            {sub.name}
                          </Typography>
                        }
                        sx={{
                          width: '100%',
                          m: 0,
                          py: 0.5,
                          '&:hover': {
                            backgroundColor: '#F8F9FA',
                          },
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            );
          })}

          {/* Top-level Categories (no parent) */}
          {topLevelCategories.map((cat) => (
            <FormControlLabel
              key={cat._id}
              control={
                <Checkbox
                  checked={checked.includes(cat._id)}
                  onChange={() => handleToggle(cat._id)}
                  sx={{
                    color: getGenderColor(gender),
                    '&.Mui-checked': {
                      color: getGenderColor(gender),
                    },
                  }}
                  size="small"
                />
              }
              label={
                <Typography sx={{ fontSize: '0.95rem' }}>
                  {cat.name}
                </Typography>
              }
              sx={{
                width: '100%',
                m: 0,
                px: 2,
                py: 1,
                '&:hover': {
                  backgroundColor: '#F8F9FA',
                },
              }}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 700,
          color: SECONDARY_COLOR,
          fontSize: '1.1rem',
        }}
      >
        Filter by Categories
      </Typography>

      <Box>
        {renderCategorySection(categoriesByGender.Men, 'Men')}
        {renderCategorySection(categoriesByGender.Women, 'Women')}
        {renderCategorySection(categoriesByGender.Unisex, 'Unisex')}
      </Box>

      {categories.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          No categories available
        </Typography>
      )}
    </FormControl>
  );
};

export default CategoriesFilter;