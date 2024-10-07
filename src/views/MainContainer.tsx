import { isEmpty, isNil } from "lodash";
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
  TabPanelProps,
  a11yProps,
  findResetDialogType,
  isAtWordRepeated,
  regexAtWords,
  resetStyle,
} from "../interfaces";
import InputStory from "./InputStory";
import WordList from "./WordList";
import { demoStoryText, getUniqueRandomWord } from "./DemoText";
import FinishedStory from "./FinishedStory";
import { Dialog, DialogActions, styled } from "@material-ui/core";
import deepcopy from "deepcopy";

const MainContainer = () => {
  const STORY_TEXT_KEY = "storyText";
  const FILLINS_KEY = "fillins";

  const [storyTextInput, setStoryTextInput] = useState(
    () => localStorage.getItem(STORY_TEXT_KEY) || demoStoryText
  );

  const [fillIns, setFillIns] = useState<FillInType | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem(STORY_TEXT_KEY, storyTextInput);
  }, [storyTextInput]);

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
    const atWords = storyTextInput.match(regexAtWords);
    if (!isNil(atWords)) {
      atWords.forEach((atWord) => {
        const existingKeys = Object.keys(newFillIns);
        const justWord = atWord.replace("@", "");
        if (!existingKeys.includes(justWord)) {
          newFillIns[justWord] = [];
        }
        if (storyTextInput === demoStoryText) {
          const randomWord = getUniqueRandomWord(justWord);
          newFillIns[justWord].push(randomWord);
        } else {
          if (isAtWordRepeated(justWord) && newFillIns[justWord].length === 1) {
            return;
          } else if (fillIns && Object.keys(fillIns).includes(justWord)) {
            const oldIndex = newFillIns[justWord].length;
            newFillIns[justWord][oldIndex] = fillIns[justWord][oldIndex];
          } else {
            newFillIns[justWord].push("");
          }
        }
      });
    }
    setFillIns(newFillIns);
  }, [storyTextInput]);

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
        <FinishedStory storyTextInput={storyTextInput} fillIns={fillIns} />
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
    setStoryTextInput(demoStoryText);
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

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        component="h1"
        style={{
          fontSize: "xxx-large",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        MadLibs Maker
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabIndexValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabValues.map((tabValue, idx) => {
            if (tabValue.name === "reset") {
              return <ResetTab />;
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
