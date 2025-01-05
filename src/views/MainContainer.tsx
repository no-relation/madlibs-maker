import { fromMs, toMs } from "hh-mm-ss";
import { isEmpty, isEqual, isNil } from "lodash";
import React, { useEffect, useState } from "react";
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
import { baseStyle, resetStyle } from "./ShowStyles";
import {
  getLyricTimings,
  getMetadata,
  getParsedLyrics,
} from "../interfaces/LrcFileParser";

const MainContainer = () => {
  const STORY_TEXT_KEY = "storyText";
  const TITLE_TEXT_KEY = "titleText";
  const LRC_DATA = "lrcData";
  const FILLINS_KEY = "fillins";

  const [lrcFile, setLrcFile] = useState<string | undefined>(
    () => localStorage.getItem(LRC_DATA) || demoStoryText
  );

  const lrcMetadata = getMetadata(lrcFile || "");

  const [storyTextInput, setStoryTextInput] = useState<string[]>(
    getParsedLyrics(lrcFile || demoStoryText)
  );

  const [lineTimingInput, setLineTimingInput] = useState(
    getLyricTimings(lrcFile || "")
  );

  const [titleTextInput, setTitleTextInput] = useState<string | undefined>(
    () => localStorage.getItem(TITLE_TEXT_KEY) || demoStoryTitle
  );

  const [fillIns, setFillIns] = useState<FillInType | undefined>(undefined);

  useEffect(() => {
    const stringified = JSON.stringify(storyTextInput);
    localStorage.setItem(STORY_TEXT_KEY, stringified);
  }, [storyTextInput]);

  useEffect(() => {
    if (titleTextInput === undefined) {
      localStorage.removeItem(TITLE_TEXT_KEY);
    } else {
      localStorage.setItem(TITLE_TEXT_KEY, titleTextInput);
    }
  }, [titleTextInput]);

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
    storyTextInput.forEach((inputLine) => {
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
  }, [storyTextInput]);

  const saveLrcFile = () => {
    const metadataStringArray = lrcMetadata.map((line) => line.raw);
    let timesAndLyrics: string[];
    if (lineTimingInput) {
      timesAndLyrics = lineTimingInput.map(
        (timingLine, i) => `[${fromMs(timingLine)}]${storyTextInput[i]}`
      );
    } else {
      timesAndLyrics = storyTextInput;
    }
    const lrcString = metadataStringArray.concat(timesAndLyrics).join("\n");
    localStorage.setItem(LRC_DATA, lrcString);
  };

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
          fillIns={fillIns}
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
    setStoryTextInput(getParsedLyrics(demoStoryText));
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

  const { header } = baseStyle;
  const { mainTitle, presentsTitle, root } = header;

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box sx={root}>
        <Typography component="h6" sx={presentsTitle}>
          '80s Kids Presents:
        </Typography>
        <Typography component="h1" sx={mainTitle}>
          MadLibs Karaoke
        </Typography>
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
