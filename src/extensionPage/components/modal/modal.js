import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

const paperStyle = {
  sx: {
    width: 500,
  },
};

const Modal = ({ open, handleClose, id, filename }) => {
  const [categoryList, setCategoryList] = useState([]);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [categoryCodes, setCategoryCodes] = useState([]);
  const [code, setCode] = useState('');

  useEffect(() => {
    if (id === '') return;

    // get highlight of id passed
    let highlights = window.localStorage.getItem(`${filename}_array`);
    highlights = JSON.parse(highlights);
    if (highlights === null) highlights = [];

    const highlight = highlights.filter((item) => item.id === id)[0];

    // get categories
    let categories = window.localStorage.getItem('fyp_categories');
    categories = JSON.parse(categories);
    if (categories === null) categories = [];
    setCategoryList(categories);

    if (highlight.category !== 'not set yet') {
      const selectedCategory = categories.filter(
        (item) => item.name === highlight.category,
      )[0];

      // return if category has been deleted
      if (!selectedCategory) return;

      setCategory(highlight.category);
      setCategoryCodes(
        selectedCategory.codes,
      );
    }

    setCode(highlight.code);
    setText(highlight.text);
  }, [open, id]);

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
    const selectedCategory = categoryList.filter(
      (item) => item.name === event.target.value,
    )[0];
    setCategoryCodes(
      selectedCategory.codes,
    );
    setCode('');
  };

  const handleChangeCode = (event) => {
    setCode(event.target.value);
  };

  const handleSave = () => {
    if (category === '') return;

    let highlights = window.localStorage.getItem(`${filename}_array`);
    highlights = JSON.parse(highlights);
    const index = highlights.findIndex((item) => item.id === id);
    highlights[index] = {
      ...highlights[index],
      category,
      code,
    };
    window.localStorage.setItem(
      `${filename}_array`, JSON.stringify(highlights),
    );

    handleClose();
  };

  return (
    <Dialog
      PaperProps={paperStyle}
      onClose={handleClose}
      open={open}
    >
      <DialogTitle>Edit Highlight</DialogTitle>
      <DialogContent>
        <Typography>
          {text}
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="highlight-category">Category</InputLabel>
          <Select
            labelId="highlight-category"
            value={category}
            label="Category"
            onChange={handleChangeCategory}
          >
            {categoryList.length > 0 && categoryList.map((item) => (
              <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="highlight-code">Code</InputLabel>
          <Select
            labelId="highlight-code"
            value={code}
            label="Code"
            onChange={handleChangeCode}
          >
            {categoryCodes.length > 0 && categoryCodes.map((item) => (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2">
          *Add and edit categories by clicking on
          floating buttons on bottom right corner
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
