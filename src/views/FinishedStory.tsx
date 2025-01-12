import { useEffect, useState } from "react";
import deepcopy from "deepcopy";
import ReactAudioPlayer from "react-audio-player";
import { FillInType, isAtWordRepeated, regexAtWords } from "../interfaces";
import { Paper } from "@mui/material";
import { isEmpty, isNil } from "lodash";
import { finishedStoryStyles, titleTextStyle } from "./ShowStyles";

interface FinishedStoryProps {
  titleTextInput?: string;
  storyTextInput: string[];
  lineTimingInput?: number[];
  fillIns?: FillInType;
}

const FinishedStory = (props: FinishedStoryProps) => {
  const { titleTextInput, storyTextInput, lineTimingInput, fillIns } = props;
  const [finishedStoryText, setFinishedStoryText] = useState(storyTextInput);
  const [currentLineIndex, setCurrentLineIndex] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (fillIns) {
      let newText = deepcopy(storyTextInput);
      const fillInsCopy = deepcopy(fillIns);
      const atWords = storyTextInput.flatMap(
        (line) => line.match(regexAtWords) || []
      );
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

  // const handlePlay = (event: Event) => {
  //   console.log("event:", event);
  //   // get play time
  //   // if (playerRef !== null && playerRef.current !== null) {
  //   //   playerRef.current.onListen(event: any =>);
  //   // }

  //   // check line timing

  //   // if line timing inside play time, highlight row.
  // };

  const handleListen = (timeInSeconds: number) => {
    const lineIdx = getCurrentLineIndex(timeInSeconds * 1000);
    setCurrentLineIndex(lineIdx);
  };

  const getCurrentLineIndex = (elapsedMs: number): number | undefined => {
    if (lineTimingInput) {
      const idx = lineTimingInput.findIndex((line) => line > elapsedMs);
      if (idx >= 0) {
        return idx;
      }
    }
  };

  return (
    <Paper elevation={2}>
      <ReactAudioPlayer
        id="player"
        controls
        src={songSrc}
        // onPlay={handlePlay}
        listenInterval={50}
        onListen={handleListen}
      />
      <div style={titleTextStyle}>{titleTextInput}</div>
      <div style={finishedStoryStyles}>
        {finishedStoryText.map((storyLine, idx) => (
          <div
            key={idx}
            style={
              currentLineIndex === idx ? { color: "red" } : { color: "black" }
            }
            dangerouslySetInnerHTML={{ __html: storyLine }}
          ></div>
        ))}
      </div>
    </Paper>
  );
};

export default FinishedStory;
