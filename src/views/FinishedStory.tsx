import { useEffect, useRef, useState } from "react";
import deepcopy from "deepcopy";
import ReactAudioPlayer from "react-audio-player";
import { FillInType, isAtWordRepeated, regexAtWords } from "../interfaces";
import { Box, Paper } from "@mui/material";
import { isEmpty, isNil } from "lodash";
import { finishedStoryStyles, titleTextStyle } from "./ShowStyles";

interface FinishedStoryProps {
  titleTextInput?: string;
  storyTextInput: string[];
  lineTimingInput?: Array<number | undefined>;
  fillIns?: FillInType;
  mp3Upload?: string;
}

const FinishedStory = (props: FinishedStoryProps) => {
  const {
    titleTextInput,
    storyTextInput,
    lineTimingInput,
    fillIns,
    mp3Upload,
  } = props;
  const [finishedTitleTextInput, setFinishedTitleTextInput] =
    useState(titleTextInput);
  const [finishedStoryText, setFinishedStoryText] = useState(storyTextInput);
  const [currentLineIndex, setCurrentLineIndex] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (fillIns) {
      let newText = deepcopy(storyTextInput);
      if (titleTextInput) {
        newText.unshift(titleTextInput);
      }

      const fillInsCopy = deepcopy(fillIns);
      const atWords = newText.flatMap((line) => line.match(regexAtWords) || []);
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
      if (titleTextInput) {
        const newTitle = newText.shift();
        setFinishedTitleTextInput(newTitle);
      }
      setFinishedStoryText(newText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyTextInput, fillIns]);

  const getCurrentLineIndex = (elapsedMs: number): number | undefined => {
    if (lineTimingInput) {
      const findIndexCallback = (
        line?: number,
        idx?: number,
        timingArray?: Array<number | undefined>
      ) => {
        if (line && idx !== undefined && timingArray && timingArray[idx + 1]) {
          return line < elapsedMs && timingArray[idx + 1]! >= elapsedMs;
        }
        return false;
      };
      const idx = lineTimingInput.findIndex(findIndexCallback);
      if (idx >= 0) {
        return idx;
      }
    }
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleListen = (timeInSeconds: number) => {
    const lineIdx = getCurrentLineIndex(timeInSeconds * 1000);
    if (lineIdx !== undefined) {
      setCurrentLineIndex(lineIdx);
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  const handleError = (e: Event) => {
    console.error(e);
  };

  return (
    <Paper elevation={2}>
      {mp3Upload && (
        <ReactAudioPlayer
          id="player"
          controls
          src={mp3Upload}
          preload="auto"
          listenInterval={50}
          onListen={handleListen}
          onError={handleError}
        />
      )}
      <div
        style={titleTextStyle}
        dangerouslySetInnerHTML={{ __html: finishedTitleTextInput || "" }}
      ></div>
      <div style={finishedStoryStyles}>
        {finishedStoryText.map((storyLine, idx) => (
          <Box
            key={idx}
            ref={currentLineIndex === idx ? scrollRef : null}
            sx={
              currentLineIndex === idx ? { color: "red" } : { color: "black" }
            }
            dangerouslySetInnerHTML={{ __html: storyLine }}
          ></Box>
        ))}
      </div>
    </Paper>
  );
};

export default FinishedStory;
