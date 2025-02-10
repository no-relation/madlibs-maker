import { isEmpty, isEqual, isNil } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  DialogContent,
} from "@mui/material";
import {
  CustomTabPanel,
  FillInType,
  ResetDialogType,
  a11yProps,
  findResetDialogType,
  isAtWordRepeated,
  regexAtWords,
} from "../interfaces";
import InputStory from "./InputStory";
import WordList from "./WordList";
import { demoStoryText, demoStoryTitle, getUniqueRandomWord } from "./DemoText";
import FinishedStory from "./FinishedStory";
import { Dialog, DialogActions, styled } from "@material-ui/core";
import deepcopy from "deepcopy";
import { getShowStyle, resetStyle } from "./ShowStyles";
import {
  buildLrcFile,
  getAllSongData,
  getParsedLyrics,
  getTitle,
} from "../interfaces/LrcFileParser";
import {
  SongOption,
  getLrcFile,
  getSongOptions,
  saveSongData,
} from "../SongOptions";

const MainContainer = () => {
  const SONG_SELECTION_TITLE = "songSelectionTitle";
  const STORY_TEXT_KEY = "storyText";
  const TITLE_TEXT_KEY = "titleText";
  const FILLINS_KEY = "fillins";

  const getSongSelection = (): SongOption | undefined => {
    const storedSongSelectionTitle = localStorage.getItem(SONG_SELECTION_TITLE);
    if (storedSongSelectionTitle) {
      return songOptions.find((opt) => opt.title === storedSongSelectionTitle);
    }

    return songOptions[0];
  };

  const [useUploadedSongs, setUseUploadedSongs] = useState(true);
  const songOptions = getSongOptions();
  const [songSelection, setSongSelection] = useState<SongOption | undefined>(
    useUploadedSongs ? getSongSelection : undefined
  );

  const handleSetSelectedSong = (songOption?: SongOption) => {
    if (songOption) {
      localStorage.setItem(SONG_SELECTION_TITLE, songOption.title);
    }
    setSongSelection(songOption);
  };

  const [lrcFile, setLrcFile] = useState<string | null>(null);
  const [storyTextInput, setStoryTextInput] = useState<string[]>([]);

  useEffect(() => {
    if (useUploadedSongs && songSelection) {
      const getLrc = async () => {
        const lrcFile = await getLrcFile(songSelection);
        if (!isNil(lrcFile)) {
          setLrcFile(lrcFile);
        }
      };
      getLrc();
    } else {
      const storyTextFromStorage = localStorage.getItem(STORY_TEXT_KEY);
      if (storyTextFromStorage) {
        setStoryTextInput(storyTextFromStorage.split("\n"));
        const titleTextFromStorage = localStorage.getItem(TITLE_TEXT_KEY);
        if (titleTextFromStorage) {
          setTitleTextInput(titleTextFromStorage);
        }
      }
    }
  }, [useUploadedSongs, songSelection]);

  const [lineTimingInput, setLineTimingInput] = useState<
    Array<number | undefined> | undefined
  >(undefined);

  const [titleTextInput, setTitleTextInput] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const { lineTiming, title, text } = getAllSongData(lrcFile);
    setStoryTextInput(text);
    setLineTimingInput(lineTiming);
    setTitleTextInput(title);
  }, [lrcFile]);

  const [fillIns, setFillIns] = useState<FillInType | undefined>(undefined);

  const usePrevious = <T extends unknown>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const previousSongSelection = usePrevious(songSelection);
  useEffect(() => {
    const songDidChange: boolean = !isEqual(
      previousSongSelection,
      songSelection
    );
    const titleText = getTitleText(titleTextInput, songDidChange);
    // // for dev
    // console.log("songDidChange:", songDidChange);
    // console.log("titleText:", titleText);
    if (!isEmpty(storyTextInput)) {
      const lrcFileString = buildLrcFile(
        storyTextInput,
        lineTimingInput,
        titleText
      );
      if (songSelection) {
        saveSongData(songSelection.title, lrcFileString);
      }
      localStorage.setItem(STORY_TEXT_KEY, storyTextInput.join("\n"));
      localStorage.setItem(TITLE_TEXT_KEY, titleText || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyTextInput, lineTimingInput, titleTextInput, songSelection]);

  useEffect(() => {
    if (!isEmpty(titleTextInput))
      localStorage.setItem(TITLE_TEXT_KEY, titleTextInput!);
  }, [titleTextInput]);

  const getTitleText = (
    titleTextInput?: string,
    getOriginalTitle?: boolean
  ): string | undefined => {
    const titleFromLrc = getTitle(lrcFile);
    if (getOriginalTitle) {
      return titleFromLrc;
    }

    if (titleTextInput) {
      return titleTextInput;
    }
    let titleText: string | undefined =
      localStorage.getItem(TITLE_TEXT_KEY) || undefined;
    if (isNil(titleText)) {
      if (titleFromLrc) {
        titleText = titleFromLrc;
      } else if (songSelection) {
        titleText = songSelection.displayTitle;
      }
    }

    return titleText;
  };

  // why doesn't this work?
  useEffect(() => {
    const storedFillInString = localStorage.getItem(FILLINS_KEY);
    if (!isNil(storedFillInString)) {
      const fillIns: FillInType = JSON.parse(storedFillInString);
      setFillIns(fillIns);
    }
  }, []);

  useEffect(() => {
    if (fillIns) {
      localStorage.setItem(FILLINS_KEY, JSON.stringify(fillIns));
    }
  }, [fillIns]);

  useEffect(() => {
    const newFillIns: FillInType = {};
    const storyTextCopy = deepcopy(storyTextInput);
    if (titleTextInput) {
      storyTextCopy.unshift(titleTextInput);
    }
    storyTextCopy.forEach((inputLine) => {
      const atWords = inputLine.match(regexAtWords);
      if (!isNil(atWords)) {
        atWords.forEach((atWord) => {
          const existingKeys = Object.keys(newFillIns);
          const justWord = atWord.replace("@", "");
          if (!existingKeys.includes(justWord)) {
            newFillIns[justWord] = [];
          }
          if (isAtWordRepeated(justWord) && newFillIns[justWord].length === 1) {
            return;
          } else if (isEqual(storyTextInput, getParsedLyrics(demoStoryText))) {
            const randomWord = getUniqueRandomWord(justWord);
            newFillIns[justWord].push(randomWord);
          } else {
            if (fillIns && Object.keys(fillIns).includes(justWord)) {
              const oldIndex = newFillIns[justWord].length;
              newFillIns[justWord][oldIndex] = fillIns[justWord][oldIndex];
            } else {
              newFillIns[justWord].push("");
            }
          }
        });
      }
    });
    setFillIns(newFillIns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyTextInput, titleTextInput]);

  const resetFillIns = () => {
    if (fillIns) {
      const newFillIns = deepcopy(fillIns);
      Object.keys(newFillIns).forEach((key) => {
        newFillIns[key] = newFillIns[key].map((_) => "");
      });
      setFillIns(newFillIns);
    }
  };
  const [resetDialogType, setResetDialogType] = useState<
    ResetDialogType | undefined
  >(undefined);
  const [resetDialogText, setResetDialogText] = useState("");

  const handleResetTextClick = () => {
    setResetDialogType("storyText");
    setResetDialogText(
      "Are you sure you want to reset to the demo text? You will lose your story!"
    );
  };

  const handleResetFillIns = () => {
    setResetDialogType("fillIns");
    setResetDialogText("Are you certain you want to reset the fill-in words?");
  };

  type TabValueType = {
    label: string;
    component?: React.ReactNode;
    name?: string;
  };

  const tabValues: TabValueType[] = [
    {
      label: "Input Story",
      component: (
        <InputStory
          storyTextInput={storyTextInput}
          setStoryTextInput={setStoryTextInput}
          titleTextInput={titleTextInput}
          setTitleTextInput={setTitleTextInput}
          lineTimingInput={lineTimingInput || []}
          setLineTimingInput={setLineTimingInput}
          useUploadedSongs={useUploadedSongs}
          setUseUploadedSongs={setUseUploadedSongs}
          songOptions={songOptions}
          selectedSong={songSelection}
          setSelectedSong={handleSetSelectedSong}
        />
      ),
    },
    {
      label: "Word List",
      component: (
        <WordList
          fillIns={fillIns}
          setFillIns={setFillIns}
          resetFillIns={handleResetFillIns}
        />
      ),
    },
    {
      label: "Finished Story",
      component: (
        <FinishedStory
          titleTextInput={titleTextInput}
          storyTextInput={storyTextInput}
          lineTimingInput={lineTimingInput}
          fillIns={fillIns}
          mp3Upload={songSelection && songSelection.songFile}
        />
      ),
    },
    {
      label: "",
      name: "reset",
    },
  ];

  const ResetTab = styled(() => (
    <Tab
      key="reset"
      style={resetStyle}
      label="Reset to Demo"
      onClick={handleResetTextClick}
    />
  ))(() => ({
    backgroundColor: "green",
    color: "white",
  }));

  const handleResetDialogClose = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const { name } = event.currentTarget;
    const confirm = name.includes("yes");
    const dialogType: ResetDialogType | undefined = findResetDialogType(name);
    setResetDialogType(undefined);
    setResetDialogText("");
    if (confirm) {
      switch (dialogType) {
        case "storyText":
          resetStoryText();
          break;
        case "fillIns":
          resetFillIns();
          break;
      }
    }
  };

  const resetStoryText = () => {
    setTitleTextInput(demoStoryTitle);
    setStoryTextInput(demoStoryText.split("\n"));
    setUseUploadedSongs(false);
    setSongSelection(songOptions[0]);
    localStorage.clear();
    // setLineTimingInput([]);
    // setStoryTextInput(getParsedLyrics(lrcFile));
  };

  const [tabIndexValue, setTabIndexValue] = useState(0);

  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: number
  ) => {
    if ((event.target as any).name === "reset-tab") {
      return;
    } else {
      setTabIndexValue(newValue);
    }
  };

  const showStyle = getShowStyle("valentines");
  const { header } = showStyle;
  const { mainTitle, presentsTitle, root, logo } = header;

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box sx={root}>
        <Box sx={{ flex: 1 }}>
          <Box
            sx={logo}
            component="img"
            src={process.env.PUBLIC_URL + `/images/80sKidsLogo.png`}
          />
        </Box>
        <Box>
          <Typography component="h6" sx={presentsTitle}>
            '80s Kids Presents:
          </Typography>
          <Typography component="h1" sx={mainTitle}>
            MadLibs Karaoke
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabIndexValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabValues.map((tabValue, idx) => {
            if (tabValue.name === "reset") {
              return <ResetTab key="reset" />;
            } else {
              return (
                <Tab
                  key={`tab-${idx}`}
                  label={tabValue.label}
                  {...a11yProps(idx, tabValue.name)}
                />
              );
            }
          })}
        </Tabs>
      </Box>
      {tabValues.map((tabValue, idx) => (
        <CustomTabPanel key={tabValue.label} index={idx} value={tabIndexValue}>
          {tabValue.component}
        </CustomTabPanel>
      ))}
      <Dialog open={!isEmpty(resetDialogText)}>
        <DialogContent>{resetDialogText}</DialogContent>
        <DialogActions>
          <Button
            name={`${resetDialogType}-yes-button`}
            onClick={handleResetDialogClose}
          >
            Yes, please
          </Button>
          <Button
            name={`${resetDialogType}-no-button`}
            autoFocus
            onClick={handleResetDialogClose}
          >
            Wait, No!
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainContainer;
