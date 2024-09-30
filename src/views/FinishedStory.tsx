import React, { useEffect, useState } from "react";
import deepcopy from "deepcopy";
import { FillInType, regexAtWords } from "../interfaces";
import { Paper, TextField } from "@mui/material";
import { isNil } from "lodash";

interface FinishedStoryProps {
  storyTextInput: string;
  fillIns?: FillInType;
}

const FinishedStory = (props: FinishedStoryProps) => {
  const { storyTextInput, fillIns } = props;
  const [finishedStoryText, setFinishedStoryText] = useState(storyTextInput);
  useEffect(() => {
    if (fillIns) {
      const fillInsCopy = deepcopy(fillIns);
      const atWords = storyTextInput.match(regexAtWords);
      if (!isNil(atWords)) {
        let newText = finishedStoryText;
        atWords.forEach((atWord) => {
          const fillInKey = atWord.replace("@", "");
          const fillInList = fillInsCopy[fillInKey];
          if (fillInList && fillInList.length > 0) {
            const fillInWord = fillInList.shift();
            newText = newText.replace(atWord, fillInWord!);
          }
        });
        setFinishedStoryText(newText);
      }
    }
  }, [storyTextInput, fillIns]);
  return (
    <Paper elevation={2}>
      <TextField multiline fullWidth value={finishedStoryText} />
    </Paper>
  );
};

export default FinishedStory;
