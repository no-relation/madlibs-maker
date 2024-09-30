import React from "react";
import { Paper, TextField, Typography } from "@mui/material";

interface InputStoryProps {
  label?: string;
  storyTextInput: string;
  setStoryTextInput: (storyTest: string) => void;
}
const InputStory = (props: InputStoryProps) => {
  let { storyTextInput } = props;
  const label = "Input Story";

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    props.setStoryTextInput(value);
  };
  return (
    <TextField
      id="story-input"
      name="story-input"
      placeholder="Input story with placeholders"
      onChange={handleTextChange}
      multiline
      minRows={4}
      value={storyTextInput}
      fullWidth
      autoFocus
    />

    // <Paper elevation={2}>
    //   <Typography>Instructions for use</Typography>
    // </Paper>
  );
};

export default InputStory;
