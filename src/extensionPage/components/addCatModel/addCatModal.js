import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const AddCatModal = ({ open, handleClose }) => {
  const [category, setCategory] = useState('');
  const [codes, setCodes] = useState('');

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleCodesChange = (event) => {
    setCodes(event.target.value);
  };

  const handleCancel = () => {
    setCategory('');
    setCodes('');
    handleClose();
  };

  const handleSave = () => {
    let categories = window.localStorage.getItem('fyp_categories');
    categories = JSON.parse(categories);
    if (categories === null || categories === undefined) {
      categories = [];
    }

    const newCategory = {
      name: category,
      codes: codes.split('\n').filter(
        (str) => str.replace(/\s/g, '').length > 0,
      ),
    };

    categories.push(newCategory);
    window.localStorage.setItem('fyp_categories', JSON.stringify(categories));
    setCategory('');
    setCodes('');
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Category</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="normal"
          label="Category name"
          fullWidth
          variant="standard"
          value={category}
          onChange={handleCategoryChange}
        />
        <TextField
          autoFocus
          margin="normal"
          label="Codes (Enter to input multiple codes)"
          fullWidth
          variant="standard"
          multiline
          value={codes}
          onChange={handleCodesChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCatModal;
