import {
  Box,
  Checkbox,
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
import {
  Cancel,
  LooksOne,
  LooksOneOutlined,
  LooksTwo,
  LooksTwoOutlined,
  Publish,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { fromMs, toMs } from "hh-mm-ss";
import { isEmpty, isEqual, parseInt, toNumber } from "lodash";

import { DuetPart } from "../interfaces/LrcFileParser";
import { SongOption } from "../SongOptions";
import deepcopy from "deepcopy";
import { duetColors } from "./ShowStyles";

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
  const [duetParts, setDuetParts] = useState<[boolean, boolean][]>([]);

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

  const getDuetCheckboxValue = (idx: number): [boolean, boolean] => {
    if (idx >= 0 && duetPartInput) {
      const duetPart = duetPartInput[idx];
      switch (duetPart) {
        case "1":
          return [true, false];
        case "2":
          return [false, true];
        case "both":
          return [true, true];
        default:
          return getDuetCheckboxValue(idx - 1);
      }
    }

    return [false, false];
  };

  const getDuetPartColor = (idx: number): string | undefined => {
    const duetPartInput = getDuetPartInput(duetParts[idx]);
    if (duetPartInput === undefined) {
      return;
    }

    return duetColors[duetPartInput];
  };

  useEffect(() => {
    if (duetPartInput) {
      const duetParts: [boolean, boolean][] = duetPartInput.map((_, idx) => {
        return getDuetCheckboxValue(idx);
      });
      setDuetParts(duetParts);
    }
  }, [duetPartInput]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const idx: number = parseInt(name);
    if (name.includes("title")) {
      setTitleInput(value);
    } else if (name.includes("timing")) {
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

  const handleDuetCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const { name } = event.target;
    // `${idx}-duet-singer-0`
    const nameArray = name.split("-");
    const idxName = nameArray[0];
    const idx = toNumber(idxName);
    const singerNumberString = nameArray[3];
    const singerNumber = toNumber(singerNumberString);
    if (!isNaN(idx) && !isNaN(singerNumber)) {
      const newDuetParts = deepcopy(duetParts);
      newDuetParts[idx][singerNumber] = checked;
      const newDuetPartInput = newDuetParts.map((checkboxValues) =>
        getDuetPartInput(checkboxValues)
      );
      setDuetParts(newDuetParts);
      setDuetPartInput(newDuetPartInput);
    }
  };

  const getDuetPartInput = (
    checkboxes: [boolean, boolean]
  ): DuetPart | undefined => {
    if (isEqual(checkboxes, [true, false])) {
      return "1";
    } else if (isEqual(checkboxes, [false, true])) {
      return "2";
    } else if (isEqual(checkboxes, [true, true])) {
      return "both";
    }
    return undefined;
  };

  const getDuetPartTooltip = (checkboxes: [boolean, boolean]): string => {
    const duetPartInput = getDuetPartInput(checkboxes);
    switch (duetPartInput) {
      case "1":
        return "Singer 1 sings";
      case "2":
        return "Singer 2 sings";
      case "both":
        return "Both singers sing";
      default:
        return "";
    }
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
            <Grid2 size={1}>
              <Typography>Duet parts</Typography>
            </Grid2>
            <Grid2 sx={{ minWidth: "40px" }} />
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
                <Grid2 key={`${idx}-add-line`} size="auto">
                  {addLine(idx)}
                </Grid2>
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
                {duetCheckboxInput(idx)}
                <Grid2 key={`${idx}-remove-line`} size={"auto"}>
                  {removeLine(idx)}
                </Grid2>
              </Grid2>
            );
          })}
          <Grid2 key="last-add-line" size="auto">
            {addLine("last")}
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

  function addLine(idx: number | "last") {
    return (
      <Tooltip title="Add a line above this">
        <IconButton
          name={`${idx}-add-line`}
          sx={{ color: "gray" }}
          onClick={handleAddLine(idx)}
        >
          <Publish />
        </IconButton>
      </Tooltip>
    );
  }

  function removeLine(idx: number) {
    const isDisabled = !isEmpty(textLineInput[idx]);
    return (
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
    );
  }

  function duetCheckboxInput(idx: number) {
    return (
      <Tooltip title={getDuetPartTooltip(duetParts[idx])}>
        <Grid2 size={1}>
          <Checkbox
            sx={{
              "&.Mui-checked": { color: getDuetPartColor(idx) },
            }}
            checked={duetParts[idx][0]}
            id={`${idx}-duet-singer-0`}
            name={`${idx}-duet-singer-0`}
            icon={<LooksOneOutlined />}
            checkedIcon={<LooksOne />}
            onChange={handleDuetCheckboxChange}
          />
          <Checkbox
            sx={{
              "&.Mui-checked": { color: getDuetPartColor(idx) },
            }}
            checked={duetParts[idx][1]}
            id={`${idx}-duet-singer-1`}
            name={`${idx}-duet-singer-1`}
            icon={<LooksTwoOutlined />}
            checkedIcon={<LooksTwo />}
            onChange={handleDuetCheckboxChange}
          />
        </Grid2>
      </Tooltip>
    );
  }
};

export default InputStory;
