import React, { useEffect, useState } from "react";
import {
  FormControlLabel,
  Grid2,
  Link,
  List,
  ListItem,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { fromMs, toMs } from "hh-mm-ss";
import { isEmpty, parseInt } from "lodash";
import deepcopy from "deepcopy";

interface InputStoryProps {
  storyTextInput: string[];
  setStoryTextInput: (storyText: string[]) => void;
  titleTextInput?: string;
  setTitleTextInput: (titleText?: string) => void;
  lineTimingInput: Array<number | undefined> | undefined;
  setLineTimingInput: (lineTiming?: Array<number | undefined>) => void;
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

  const [textLineInput, setTextLineInput] = useState(storyTextInput);
  const [timingInput, setTimingInput] = useState<Array<string | undefined>>([]);
  const [titleInput, setTitleInput] = useState<string | undefined>(
    titleTextInput
  );
  const [useLineTimings, setUseLineTimings] = useState<boolean>(false);

  useEffect(() => {
    setTextLineInput(storyTextInput);
  }, [storyTextInput]);

  useEffect(() => {
    setTitleInput(titleTextInput);
  }, [titleTextInput]);

  useEffect(() => {
    if (lineTimingInput) {
      const stateTimingArray = lineTimingInput.map((inpt) =>
        inpt === undefined ? undefined : fromMs(inpt).toString()
      );
      setTimingInput(stateTimingArray);
      setUseLineTimings(lineTimingInput.length > 0);
    }
  }, [lineTimingInput]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const idx: number = parseInt(name);
    if (name.includes("title")) {
      setTitleInput(value);
    } else if (name.includes("timing")) {
      if (timingInput && timingInput.length > idx + 1) {
        const newInput = deepcopy(timingInput);
        newInput[idx] = value;
        setTimingInput(newInput);
      }
    } else if (name.includes("story-line")) {
      const newInput = deepcopy(textLineInput);
      newInput[idx] = value;
      setTextLineInput(newInput);
    } else {
      setTextLineInput(value.split("\n"));
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const { name } = event.target;
    if (name.includes("title")) {
      setTitleTextInput(titleInput);
    } else {
      setStoryTextInput(textLineInput);
      const timingInputParsed = timingInput.map((ti) =>
        isEmpty(ti) ? undefined : toMs(ti!)
      );
      setLineTimingInput(timingInputParsed);
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
      <FormControlLabel
        label="Use line timing?"
        control={<Switch checked={useLineTimings} onChange={handleSwitch} />}
        sx={{ marginLeft: "0.5em" }}
      />
      {useLineTimings && (
        <Typography component="h6">
          Two sources I like for .lrc files are:
          <List>
            <ListItem>
              <Link href="https://www.lyricsify.com/" target="blank">
                https://www.lyricsify.com/
              </Link>
            </ListItem>
            <ListItem>
              <Link href="https://lrclib.net/" target="blank">
                https://lrclib.net/
              </Link>
            </ListItem>
          </List>
        </Typography>
      )}
      <TextField
        id="title-input"
        name="title-input"
        placeholder="Input title"
        onChange={handleTextChange}
        onBlur={handleBlur}
        value={titleInput}
        fullWidth
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
            {textLineInput.map((line, idx) => {
              const lineTimingKey = `${idx}-line-timing`;
              const storyLineKey = `${idx}-story-line`;
              return (
                <Grid2
                  container
                  key={`${idx}-line`}
                  sx={{ justifyContent: "flex-start" }}
                  size={12}
                >
                  <Grid2 size={2}>
                    <TextField
                      id={lineTimingKey}
                      name={lineTimingKey}
                      placeholder="01:02.345"
                      value={timingInput[idx]}
                      onChange={handleTextChange}
                      onBlur={handleBlur}
                    />
                  </Grid2>
                  <Grid2 size="grow">
                    <TextField
                      id={storyLineKey}
                      name={storyLineKey}
                      onChange={handleTextChange}
                      onBlur={handleBlur}
                      multiline
                      value={line}
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
          value={textLineInput.join("\n")}
          fullWidth
        />
      )}
    </Paper>
  );
};

export default InputStory;
