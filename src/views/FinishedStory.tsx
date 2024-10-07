import { useEffect, useState } from "react";
import deepcopy from "deepcopy";
import { FillInType, isAtWordRepeated, regexAtWords } from "../interfaces";
import { Paper } from "@mui/material";
import { isEmpty, isNil } from "lodash";

interface FinishedStoryProps {
  storyTextInput: string;
  fillIns?: FillInType;
}

const FinishedStory = (props: FinishedStoryProps) => {
  const { storyTextInput, fillIns } = props;
  const [finishedStoryText, setFinishedStoryText] = useState(
    storyTextInput.split("\n")
  );

  useEffect(() => {
    if (fillIns) {
      let newText = storyTextInput.split("\n");
      const fillInsCopy = deepcopy(fillIns);
      const atWords = storyTextInput.match(regexAtWords);
      if (!isNil(atWords)) {
        atWords.forEach((atWord) => {
          const fillInKey = atWord.replace("@", "");
          const fillInList = fillInsCopy[fillInKey];
          if (fillInList && fillInList.length > 0) {
            let fillInWord = fillInList[0];
            if (!isAtWordRepeated(fillInKey)) {
              fillInList.shift();
            }
            if (isEmpty(fillInWord)) {
              fillInWord = atWord;
            }
            let newTextLineIdx = newText.findIndex((t) => t.includes(atWord));
            if (newTextLineIdx !== -1) {
              const newTextLine = newText[newTextLineIdx].replace(
                atWord,
                `<strong>${fillInWord!}</strong>`
              );
              newText.splice(newTextLineIdx, 1, newTextLine);
            }
          }
        });
      }
      setFinishedStoryText(newText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyTextInput, fillIns]);

  const fillInTheWord = (fillInWord: string, newText: string[]): string[] => {
    const atWord = `@${fillInWord}`;
    if (isEmpty(fillInWord)) {
      fillInWord = atWord;
    }
    let newTextLineIdx = newText.findIndex((t) => t.includes(atWord));
    if (newTextLineIdx === -1) {
      return newText;
    } else {
      const newTextLine = newText[newTextLineIdx].replaceAll(
        atWord,
        `<strong>${fillInWord!}</strong>`
      );
      newText.splice(newTextLineIdx, 1, newTextLine);
      return fillInTheWord(fillInWord, newText);
    }
  };

  const finishedStoryStyles: React.CSSProperties = {
    fontSize: "xx-large",
    padding: "1em",
  };

  return (
    <Paper elevation={2}>
      <div
        style={finishedStoryStyles}
        dangerouslySetInnerHTML={{ __html: finishedStoryText.join("<br/>") }}
      ></div>
    </Paper>
  );
};

export default FinishedStory;
