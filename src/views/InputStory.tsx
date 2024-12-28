import React, { useState } from "react";
import { Paper, TextField, Typography } from "@mui/material";

interface InputStoryProps {
  storyTextInput: string[];
  setStoryTextInput: (storyTest: string[]) => void;
  titleTextInput?: string;
  setTitleTextInput: (titleText?: string) => void;
}
const InputStory = (props: InputStoryProps) => {
  let { storyTextInput, setStoryTextInput, titleTextInput, setTitleTextInput } =
    props;

  const [textInput, setTextInput] = useState(storyTextInput.join("\n"));
  const [titleInput, setTitleInput] = useState<string | undefined>(
    titleTextInput
  );

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name.includes("title")) {
      setTitleInput(value);
    } else {
      setTextInput(value);
    }
  };
  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const { name } = event.target;
    if (name.includes("title")) {
      setTitleTextInput(titleInput);
    } else {
      setStoryTextInput(textInput.split("\n"));
    }
  };

  return (
    <Paper elevation={2}>
      <Typography component="h6">
        To use, paste in whatever text you like, but replace whatever words you
        want to MadLib with the type of word, starting with an @. You can
        hyphenate or underscore multiple "@-words", but no spaces.
      </Typography>
      <TextField
        id="title-input"
        name="title-input"
        placeholder="Input title"
        onChange={handleTextChange}
        onBlur={handleBlur}
        value={titleInput}
        fullWidth
      />
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
