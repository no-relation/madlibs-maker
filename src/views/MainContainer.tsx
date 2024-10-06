import { isNil } from "lodash";
import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  DialogContent,
} from "@mui/material";
import { FillInType, TabPanelProps, regexAtWords } from "../interfaces";
import InputStory from "./InputStory";
import WordList from "./WordList";
import { demoStoryText, getUniqueRandomWord } from "./DemoText";
import FinishedStory from "./FinishedStory";
import { Dialog, DialogActions, styled } from "@material-ui/core";

const MainContainer = () => {
  const LOCAL_STORAGE_KEY = "storyText";
  const [storyTextInput, setStoryTextInput] = useState(
    () => localStorage.getItem(LOCAL_STORAGE_KEY) || demoStoryText
  );

  const [fillIns, setFillIns] = useState<FillInType | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, storyTextInput);
  }, [storyTextInput]);

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
          newFillIns[justWord].push("");
        }
      });
    }
    setFillIns(newFillIns);
  }, [storyTextInput]);

  function a11yProps(index: number, name?: string) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
      name: `${name || index}-tab`,
    };
  }

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  const [openResetConfirm, setOpenResetConfirm] = useState(false);
  const handleResetClick = () => {
    setOpenResetConfirm(true);
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
      component: <WordList fillIns={fillIns} setFillIns={setFillIns} />,
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
      style={{ backgroundColor: "green", color: "white" }}
      label="Reset to Demo"
      onClick={handleResetClick}
    />
  ))(() => ({
    backgroundColor: "green",
    color: "white",
  }));

  const handleResetDialogClose = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const { name } = event.currentTarget;
    const confirm = name === "yes-button";
    setOpenResetConfirm(false);
    if (confirm) {
      reset();
    }
  };

  const reset = () => {
    setStoryTextInput(demoStoryText);
  };

  const [tabIndexValue, setTabIndexValue] = useState(0);

  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: number
  ) => {
    if ((event.target as any).name === "reset-tab") {
      handleResetClick();
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
      <Dialog open={openResetConfirm}>
        <DialogContent>
          Are you sure you want to reset to the demo text? You will lose your
          story!
        </DialogContent>
        <DialogActions>
          <Button name="yes-button" onClick={handleResetDialogClose}>
            Yes, please
          </Button>
          <Button name="no-button" autoFocus onClick={handleResetDialogClose}>
            Wait, No!
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainContainer;
