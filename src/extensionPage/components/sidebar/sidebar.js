import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import EditModal from '../modal/modal';
import AddCategoryModal from '../addCatModel/addCatModal';
import EditCategoryModal from '../editCatModal/editCatModal';
import { repositionTextLayer } from '../../../utils/helper';
import Fab from '../fab/fab';
import './sidebar.scss';

const listStyle = {
  width: '100%',
  maxWidth: 360,
  // bgcolor: 'background.paper',
  // height: 'calc(100vh - 40px)',
};

const editFabStyle = {
  position: 'absolute',
  bottom: 50,
  right: 30,
  // marginRight: 2,
};

const fabStyle = {
  position: 'absolute',
  bottom: 50,
  right: 90,
  // marginRight: 2,
};

const Sidebar = ({ highlights, filename, refreshPage }) => {
  const [open, setOpen] = useState(false);
  const [openAddCat, setOpenAddCat] = useState(false);
  const [openEditCat, setOpenEditCat] = useState(false);
  const [editId, setEditId] = useState('');
  const [listItems, setListItems] = useState(highlights);

  useEffect(() => {
    repositionTextLayer();
  });

  useEffect(() => {
    // get saved highlights
    let savedHighlights = window.localStorage.getItem(`${filename}_array`);
    savedHighlights = JSON.parse(savedHighlights);
    if (savedHighlights === null) savedHighlights = [];
    setListItems(savedHighlights);

    // TODO?: update scrolling for each highlight
    // let allHL = document.getElementsByClassName('fyp-highlight');
    // const curScrollOffset = window.scrollY ||
    //   window.scrollTop || document.getElementsByTagName('html')[0].scrollTop;

    // if (allHL.length > 0) {
    //   allHL = Array.from(allHL);
    //   console.log('all hl', allHL);
    //   for (let i = 0; i < allHL.length; i += 1) {
    //     const rect = allHL[i].getBoundingClientRect();
    //     // savedHighlights[i].absScroll = rect.y - 40 + curScrollOffset;
    //   }
    // }

    // save absolute scroll values
    window.localStorage.setItem(
      `${filename}_array`,
      JSON.stringify(savedHighlights),
    );
  }, [highlights, open, openAddCat, openEditCat]);

  const handleDelete = (e, id) => {
    // swap item with last
    // remove item
    e.stopPropagation();
    const newList = listItems.filter((item) => item.id !== id);
    window.localStorage.setItem(`${filename}_array`, JSON.stringify(newList));
    setListItems(newList);
    refreshPage();
  };

  const handleScroll = (scrollValue) => {
    if (scrollValue) {
      window.scroll(0, scrollValue);
    }
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    setEditId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseAdd = () => {
    setOpenAddCat(false);
  };

  const handleCloseEdit = () => {
    setOpenEditCat(false);
  };

  return (
    <div className="relative-sidebar">
      <EditCategoryModal
        open={openEditCat}
        handleClose={handleCloseEdit}
      />

      <AddCategoryModal
        open={openAddCat}
        handleClose={handleCloseAdd}
      />
      <EditModal
        open={open}
        handleClose={handleClose}
        id={editId}
        filename={filename}
      />
      <Typography variant="h6" m={2}>
        Highlights
      </Typography>
      <Divider />
      <List sx={listStyle} component="nav" aria-label="mailbox folders">
        {listItems.map((item) => (
          <div key={item.id}>
            <ListItem button onClick={() => handleScroll(item.absScroll)}>
              <ListItemText
                primary={item.text}
                secondary={(
                  <div>
                    <div>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Category -
                        {' '}
                      </Typography>
                      {item.category || 'null'}
                    </div>

                    <div>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Code -
                        {' '}
                      </Typography>
                      {item.code || 'null'}
                    </div>
                  </div>
                )}
              />
              <IconButton
                color="primary"
                component="span"
                onClick={(e) => handleEdit(e, item.id)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="primary"
                component="span"
                onClick={(e) => handleDelete(e, item.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
            <Divider />
          </div>
        ))}

        {listItems.length === 0 && (
          <div>
            <ListItem button>
              <ListItemText primary="No highlights yet" />
            </ListItem>
          </div>
        )}
        <Divider />
      </List>

      <div className="main-page__instructions">
        <Typography variant="body2" sx={{ m: 2 }}>
          Instructions and caveats
          <ul>
            <li>
              Select text and click &quot;Create highlight&quot;
              button to create highlight
            </li>
            <li>
              Export your highlights for current pdf using
              &quot;Export&quot; button
            </li>
            <li>
              Use &quot;Load missing highlights&quot; button if
              existing highlights disappear
            </li>
            <li>
              Delete all highlights for current pdf with
              &quot;Clear all highlights&quot; button
            </li>
            <li>
              Add and edit categories using floating buttons
              on bottom right corner
            </li>
            <li>Refresh page if highlights are incorrect</li>
            <li>Overlapping highlights is not supported</li>
          </ul>
        </Typography>
      </div>

      <Fab
        onClick={() => setOpenEditCat(true)}
        handleClose={handleCloseEdit}
        fabStyle={editFabStyle}
        edit
      />
      <Fab
        onClick={() => setOpenAddCat(true)}
        handleClose={handleCloseAdd}
        fabStyle={fabStyle}
      />
    </div>
  );
};

export default Sidebar;
