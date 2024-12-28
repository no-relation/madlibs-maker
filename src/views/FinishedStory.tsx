import { useEffect, useState } from "react";
import deepcopy from "deepcopy";
import ReactAudioPlayer from "react-audio-player";
import { FillInType, isAtWordRepeated, regexAtWords } from "../interfaces";
import { Paper } from "@mui/material";
import { isEmpty, isNil } from "lodash";
import { finishedStoryStyles, titleTextStyle } from "./ShowStyles";

interface FinishedStoryProps {
  titleTextInput?: string;
  storyTextInput: string;
  fillIns?: FillInType;
}

const FinishedStory = (props: FinishedStoryProps) => {
  const { titleTextInput, storyTextInput, fillIns } = props;
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

  const songSrc =
    process.env.PUBLIC_URL +
    "/musicSrc/All_I_Want_For_Xmas_Mariah_Carey/All_I_Want_For_Xmas_Mariah_Carey.mp3";

  const handlePlay = (event: Event) => {
    console.log("event:", event);
  };
  return (
    <Paper elevation={2}>
      <ReactAudioPlayer
        id="player"
        controls
        src={songSrc}
        onPlay={handlePlay}
      />
      <div style={titleTextStyle}>{titleTextInput}</div>
      <div
        style={finishedStoryStyles}
        dangerouslySetInnerHTML={{ __html: finishedStoryText.join("<br/>") }}
      ></div>
    </Paper>
  );
};

export default FinishedStory;
