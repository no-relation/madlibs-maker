import { useEffect, useState } from "react";
import deepcopy from "deepcopy";
import { FillInType, regexAtWords } from "../interfaces";
import { Paper } from "@mui/material";
import { isEmpty, isNil } from "lodash";

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
            let fillInWord = fillInList.shift();
            if (isEmpty(fillInWord)) {
              fillInWord = atWord;
            }
            newText = newText.replace(
              atWord,
              `<strong>${fillInWord!}</strong>`
            );
          }
        });
        setFinishedStoryText(newText);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyTextInput, fillIns]);

  const finishedStoryStyles: React.CSSProperties = {
    fontSize: "xx-large",
    padding: "1em",
  };

  return (
    <Paper elevation={2}>
      <div
        style={finishedStoryStyles}
        dangerouslySetInnerHTML={{ __html: finishedStoryText }}
      ></div>
    </Paper>
  );
};

export default FinishedStory;
