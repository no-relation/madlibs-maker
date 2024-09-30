import { isNil } from "lodash";
import React, { useEffect, useState } from "react";
import { Typography, Box, Tabs, Tab, TextField } from "@mui/material";
import { FillInType, TabPanelProps, regexAtWords } from "../interfaces";
import InputStory from "./InputStory";
import WordList from "./WordList";
import { demoStoryText, getUniqueRandomWord } from "./DemoText";
import FinishedStory from "./FinishedStory";

const MainContainer = () => {
  const [storyTextInput, setStoryTextInput] = useState(demoStoryText);

  const [fillIns, setFillIns] = useState<FillInType | undefined>(undefined);

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
        const randomWord = getUniqueRandomWord(justWord);
        newFillIns[justWord].push(randomWord);
      });
      setFillIns(newFillIns);
    }
  }, [storyTextInput]);

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
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

  type TabValueType = {
    label: string;
    component?: React.ReactNode;
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
  ];

  const [tabIndexValue, setTabIndexValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndexValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography>MadLibs Maker</Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabIndexValue} onChange={handleTabChange}>
          {tabValues.map((tabValue, idx) => (
            <Tab
              key={`tab-${idx}`}
              label={tabValue.label}
              {...a11yProps(idx)}
            />
          ))}
        </Tabs>
      </Box>
      {tabValues.map((tabValue, idx) => (
        <CustomTabPanel key={tabValue.label} index={idx} value={tabIndexValue}>
          {tabValue.component}
        </CustomTabPanel>
      ))}
    </Box>
  );
};

export default MainContainer;
