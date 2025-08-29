import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

import { Close } from "@material-ui/icons";
import React from "react";

interface AddSongDialogProps {
  addSongDialogOpen: boolean;
  setAddSongDialogOpen: (open: boolean) => void;
}

const AddSongDialog = (props: AddSongDialogProps) => {
  const { addSongDialogOpen, setAddSongDialogOpen } = props;
  const handleClose = () => {
    setAddSongDialogOpen(false);
  };
  return (
    <Dialog open={addSongDialogOpen}>
      <DialogTitle>Add A Song from Spotify</DialogTitle>
      <IconButton
        onClick={handleClose}
        aria-label="close"
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <Close />
      </IconButton>
      <DialogContent>
        This is the interface for adding a song from Spotify
      </DialogContent>
    </Dialog>
  );
};

export default AddSongDialog;
