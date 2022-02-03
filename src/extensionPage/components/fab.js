import * as React from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

export default function FloatingActionButtonSize({
  onClick,
  fabStyle,
  edit=false
}) {
  return (
    <Fab
      sx={fabStyle}
      size="medium"
      color="secondary"
      onClick={onClick}
    >
      {(edit) ? (
        <EditIcon />
      ) : (
        <AddIcon />
      )}
    </Fab>
  );
};
