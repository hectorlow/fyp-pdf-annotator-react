import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const EditCategoryModal = ({ open, handleClose }) => {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [category, setCategory] = useState({
    name: '',
    codes: '',
  });

  useEffect(() => {
    let savedCategories = window.localStorage.getItem('fyp_categories');
    savedCategories = JSON.parse(savedCategories);
    if (savedCategories === null) savedCategories = [];

    setCategoryList(savedCategories);

    console.log(savedCategories, 'saved categories');
  }, [open]);

  const handleSelectedCategory = (event) => {
    setSelectedCategory(event.target.value);
    const cat = categoryList.find((item) => item.name === event.target.value);
    console.log(cat, 'selected cat');
    if (Array.isArray(cat.codes)) cat.codes = cat.codes.join('\n');
    setCategory(cat);
  };

  const handleCategoryChange = (event) => {
    setCategory({
      ...category,
      name: event.target.value,
    });
  };

  const handleCodesChange = (event) => {
    setCategory({
      ...category,
      codes: event.target.value,
    });
  };

  const handleDelete = () => {
    const categories = categoryList.filter(
      (item) => item.name !== selectedCategory,
    );
    setCategoryList(categories);
    setCategory({
      name: '',
      codes: '',
    });
    window.localStorage.setItem('fyp_categories', JSON.stringify(categories));
  };

  const handleCancel = () => {
    setSelectedCategory('');
    setCategory({
      name: '',
      codes: '',
    });
    handleClose();
  };

  const handleSave = () => {
    const index = categoryList.findIndex(
      (item) => item.name === selectedCategory,
    );

    categoryList[index] = {
      name: category.name,
      codes: category.codes.split('\n').filter(
        (str) => str.replace(/\s/g, '').length > 0,
      ),
    };
    console.log(categoryList, 'cat list');

    window.localStorage.setItem('fyp_categories', JSON.stringify(categoryList));
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select and Edit Category</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedCategory}
            label="Category"
            onChange={handleSelectedCategory}
          >
            {categoryList.map((item) => (
              <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          autoFocus
          margin="normal"
          label="Category name"
          fullWidth
          variant="standard"
          value={category.name}
          onChange={handleCategoryChange}
        />
        <TextField
          autoFocus
          margin="normal"
          label="Codes (Enter to input multiple codes)"
          fullWidth
          variant="standard"
          multiline
          value={category.codes}
          onChange={handleCodesChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete}>Delete Category</Button>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCategoryModal;
