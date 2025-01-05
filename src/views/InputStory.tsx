import React, { useState } from "react";
import {
  FormControlLabel,
  Grid2,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { fromMs } from "hh-mm-ss";

interface InputStoryProps {
  storyTextInput: string[];
  setStoryTextInput: (storyTest: string[]) => void;
  titleTextInput?: string;
  setTitleTextInput: (titleText?: string) => void;
  lineTimingInput: number[];
  setLineTimingInput: (lineTiming?: number[]) => void;
}
const InputStory = (props: InputStoryProps) => {
  let {
    storyTextInput,
    setStoryTextInput,
    titleTextInput,
    setTitleTextInput,
    lineTimingInput,
    setLineTimingInput,
  } = props;

  const [textInput, setTextInput] = useState(storyTextInput.join("\n"));
  const [textLineInput, setTextLineInput] = useState(storyTextInput);
  const [titleInput, setTitleInput] = useState<string | undefined>(
    titleTextInput
  );
  const [useLineTimings, setUseLineTimings] = useState(
    lineTimingInput.length > 0
  );

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name.includes("title")) {
      setTitleInput(value);
    } else if (name.includes("timing")) {
      // for dev
      console.log(name, value);
    } else if (name.includes("story-line")) {
      // for dev
      console.log(name, value);
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
  const handleSwitch = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setUseLineTimings(checked);
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
      <FormControlLabel
        label="Use line timing?"
        control={<Switch checked={useLineTimings} onChange={handleSwitch} />}
        sx={{ marginLeft: "0.5em" }}
      />
      {useLineTimings ? (
        <Grid2 container>
          <Grid2 container>
            <Grid2>
              <Typography>Start Time</Typography>
            </Grid2>
            <Grid2 />
          </Grid2>
          <Grid2 container>
            {lineTimingInput!.map((time, idx) => {
              const lineTimingKey = `line-timing-${idx}`;
              const storyLineKey = `story-line-${idx}`;
              return (
                <Grid2
                  container
                  key={`line-${idx}`}
                  sx={{ justifyContent: "flex-start" }}
                  size={12}
                >
                  <Grid2 size={2}>
                    <TextField
                      id={lineTimingKey}
                      name={lineTimingKey}
                      placeholder="01:02.345"
                      value={fromMs(time, "mm:ss.sss")}
                      onChange={handleTextChange}
                    />
                  </Grid2>
                  <Grid2 size="grow">
                    <TextField
                      id={storyLineKey}
                      name={storyLineKey}
                      onChange={handleTextChange}
                      onBlur={handleBlur}
                      multiline
                      value={textLineInput[idx]}
                      fullWidth
                    />
                  </Grid2>
                </Grid2>
              );
            })}
          </Grid2>
        </Grid2>
      ) : (
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
      )}
    </Paper>
  );
};

export default InputStory;
