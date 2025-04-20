import {
  Box,
  Divider,
  FormControlLabel,
  Grid2,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Cancel, Publish } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { fromMs, toMs } from "hh-mm-ss";
import { isEmpty, parseInt } from "lodash";

import { DuetPart } from "../interfaces/LrcFileParser";
import { SongOption } from "../SongOptions";
import deepcopy from "deepcopy";

interface InputStoryProps {
  storyTextInput: string[];
  setStoryTextInput: (storyText: string[]) => void;
  titleTextInput?: string;
  setTitleTextInput: (titleText?: string) => void;
  lineTimingInput: Array<number | undefined> | undefined;
  setLineTimingInput: (lineTiming?: Array<number | undefined>) => void;
  duetPartInput?: DuetPart[];
  setDuetPartInput: (duetPart?: DuetPart[]) => void;
  useUploadedSongs: boolean;
  setUseUploadedSongs: (yesPlease: boolean) => void;
  songOptions: SongOption[];
  selectedSong?: SongOption;
  setSelectedSong: (songOption?: SongOption) => void;
}
const InputStory = (props: InputStoryProps) => {
  let {
    storyTextInput,
    setStoryTextInput,
    titleTextInput,
    setTitleTextInput,
    lineTimingInput,
    setLineTimingInput,
    duetPartInput,
    setDuetPartInput,
    useUploadedSongs,
    setUseUploadedSongs,
    songOptions,
    selectedSong,
    setSelectedSong,
  } = props;

  const [textLineInput, setTextLineInput] = useState(storyTextInput);
  const [timingInput, setTimingInput] = useState<Array<string | undefined>>([]);
  const [titleInput, setTitleInput] = useState<string | undefined>(
    titleTextInput
  );
  // const [useLineTimings, setUseLineTimings] = useState<boolean>(false);

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
    }
  }, [lineTimingInput]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const idx: number = parseInt(name);
    if (name.includes("title")) {
      setTitleInput(value);
    } else if (name.includes("timing")) {
      console.log("idx:", idx);
      console.log("timingInput.length:", timingInput.length);
      if (timingInput && timingInput.length >= idx + 1) {
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
    setUseUploadedSongs(checked);
  };

  const renderSongSelection = () => {
    return (
      <Select
        id="song-select-input"
        value={selectedSong === undefined ? undefined : selectedSong.title}
        label="Select song"
        onChange={handleSongChange}
      >
        {songOptions.map((song) => (
          <MenuItem key={song.title} value={song.title}>
            {song.displayTitle}
          </MenuItem>
        ))}
      </Select>
    );
  };
  const handleSongChange = (event: SelectChangeEvent) => {
    const songPick = songOptions.find(
      (song) => song.title === event.target.value
    );
    setSelectedSong(songPick);
  };

  const handleAddLine = (idx: number | "last") => () => {
    const newTimingInput = deepcopy(timingInput);
    const newTextLineInput = deepcopy(textLineInput);
    const newDuetPart = deepcopy(duetPartInput) || [];
    let prevDuetPart = newDuetPart[newDuetPart.length - 1];
    if (idx === "last") {
      const minTime = newTimingInput[newTimingInput.length - 1];
      newTimingInput.push(minTime);
      newTextLineInput.push("");
      newDuetPart.push(prevDuetPart);
    } else {
      prevDuetPart = newDuetPart[idx - 1];
      newDuetPart.splice(idx, 0, prevDuetPart);
      const minTime = newTimingInput[idx - 1] || "00:00.000";
      newTimingInput.splice(idx, 0, minTime);
      newTextLineInput.splice(idx, 0, "");
    }
    setTimingInput(newTimingInput);
    setTextLineInput(newTextLineInput);
    setDuetPartInput(newDuetPart);
  };

  const handleRemoveLine = (idx: number) => () => {
    const newTimingInput = deepcopy(timingInput);
    newTimingInput.splice(idx, 1);
    setTimingInput(newTimingInput);

    const newDuetPartInput = deepcopy(duetPartInput) || [];
    newDuetPartInput.splice(idx, 1);
    setDuetPartInput(newDuetPartInput);

    const newTextLineInput = deepcopy(textLineInput);
    newTextLineInput.splice(idx, 1);
    setTextLineInput(newTextLineInput);
    setStoryTextInput(newTextLineInput);
  };

  return (
    <Paper elevation={2}>
      <Typography component="h6">
        To use, paste in whatever text you like, but replace whatever words you
        want to MadLib with the type of word, starting with an @. You can
        hyphenate or underscore multiple "@-words", but no spaces.
      </Typography>
      <Box sx={{ display: "flex", padding: "1em" }}>
        <FormControlLabel
          label="Use line-by-line fields?"
          control={
            <Switch checked={useUploadedSongs} onChange={handleSwitch} />
          }
          sx={{ marginLeft: "0.5em" }}
        />
        {useUploadedSongs && renderSongSelection()}
      </Box>
      {/* {useUploadedSongs && (
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
      )} */}
      <TextField
        id="title-input"
        name="title-input"
        placeholder="Input title"
        onChange={handleTextChange}
        onBlur={handleBlur}
        value={titleInput}
        fullWidth
      />

      {useUploadedSongs ? (
        <Grid2 container>
          <Grid2 container size={12} sx={{ backgroundColor: "#80808080" }}>
            <Grid2 sx={{ minWidth: "40px" }} />
            <Grid2 size={2}>
              <Typography>Start Time</Typography>
            </Grid2>
            <Grid2 size="grow">
              <Typography>Song lyric</Typography>
            </Grid2>
          </Grid2>
          {textLineInput.map((line, idx) => {
            const lineTimingKey = `${idx}-line-timing`;
            const storyLineKey = `${idx}-story-line`;
            return (
              <Grid2
                key={`${idx}-line`}
                container
                sx={{ justifyContent: "flex-start", alignItems: "center" }}
                size={12}
              >
                {addLine(idx)}
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
                {removeLine(idx)}
              </Grid2>
            );
          })}
          {addLine("last")}
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

  function addLine(idx: number | "last") {
    return (
      <Grid2 key={`${idx}-add-line`} size="auto">
        <Tooltip title="Add a line above this">
          <IconButton
            name={`${idx}-add-line`}
            sx={{ color: "gray" }}
            onClick={handleAddLine(idx)}
          >
            <Publish />
          </IconButton>
        </Tooltip>
      </Grid2>
    );
  }

  function removeLine(idx: number) {
    const isDisabled = !isEmpty(textLineInput[idx]);
    return (
      <Grid2 key={`${idx}-remove-line`} size={"auto"}>
        <Tooltip
          title={
            isDisabled
              ? "You must clear the text before removing the line"
              : "Remove this line"
          }
        >
          <span>
            <IconButton
              name={`${idx}-remove-line`}
              sx={{ color: "red" }}
              disabled={isDisabled}
              onClick={handleRemoveLine(idx)}
            >
              <Cancel />
            </IconButton>
          </span>
        </Tooltip>
      </Grid2>
    );
  }
};

export default InputStory;
