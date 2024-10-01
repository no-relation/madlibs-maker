import React, { useRef, useState } from "react";
import { Paper, TextField, Typography } from "@mui/material";

interface InputStoryProps {
  label?: string;
  storyTextInput: string;
  setStoryTextInput: (storyTest: string) => void;
}
const InputStory = (props: InputStoryProps) => {
  let { storyTextInput, setStoryTextInput } = props;
  const label = "Input Story";

  const [textInput, setTextInput] = useState(storyTextInput);
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTextInput(value);
  };
  const handleBlur = (_: React.FocusEvent<HTMLTextAreaElement>) => {
    setStoryTextInput(textInput);
  };

  return (
    <Paper elevation={2}>
      <Typography>Instructions for use</Typography>
      <TextField
        id="story-input"
        name="story-input"
        placeholder="Input story with placeholders"
        onChange={handleTextChange}
        onBlur={handleBlur}
        multiline
        minRows={4}
        value={textInput}
        fullWidth
      />
    </Paper>
  );
};

export default InputStory;
