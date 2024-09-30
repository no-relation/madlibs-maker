import React, { useEffect, useState } from "react";
import { FillInType } from "../interfaces";
import { Paper, TextField } from "@mui/material";

interface FinishedStoryProps {
  storyTextInput: string;
  fillIns?: FillInType;
}

const FinishedStory = (props: FinishedStoryProps) => {
  const { storyTextInput, fillIns } = props;
  const [finishedStoryText, setFinishedStoryText] = useState(storyTextInput);
  useEffect(() => {
    if (fillIns) {
      const storyTextArray = storyTextInput.split(" ");
      Object.keys(fillIns).forEach((key) => {
        const variableName = `@${key}`;
        const newWordArray = fillIns[key];
        console.log(newWordArray);
        newWordArray.forEach((word) => {
          const idxToReplace = storyTextArray.findIndex(
            // this part breaks when text has punctuation after it, e.g. "@animal."
            (text) => text === variableName
          );
          storyTextArray.splice(idxToReplace, 1, word);
        });
      });
      setFinishedStoryText(storyTextArray.join(" "));
    }
  }, [storyTextInput, fillIns]);
  return (
    <Paper elevation={2}>
      <TextField multiline fullWidth value={finishedStoryText} />
    </Paper>
  );
};

export default FinishedStory;
