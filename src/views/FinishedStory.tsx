import { Box, Grid2, Paper, SxProps, Theme } from "@mui/material";
import { FillInType, isAtWordRepeated, regexAtWords } from "../interfaces";
import { MouseEvent, useEffect, useRef, useState } from "react";
import {
  duetColors,
  findDuetPartColor,
  finishedStoryStyles,
  titleTextStyle,
} from "./ShowStyles";
import { isEmpty, isNil } from "lodash";

import { DuetPart } from "../interfaces/LrcFileParser";
import ReactAudioPlayer from "react-audio-player";
import deepcopy from "deepcopy";

interface FinishedStoryProps {
  titleTextInput?: string;
  storyTextInput: string[];
  lineTimingInput?: Array<number | undefined>;
  duetPartInput?: DuetPart[];
  fillIns?: FillInType;
  mp3Upload?: string;
}

const FinishedStory = (props: FinishedStoryProps) => {
  const {
    titleTextInput,
    storyTextInput,
    lineTimingInput,
    duetPartInput,
    fillIns,
    mp3Upload,
  } = props;
  const [finishedTitleTextInput, setFinishedTitleTextInput] =
    useState(titleTextInput);
  const [finishedStoryText, setFinishedStoryText] = useState(storyTextInput);
  const [currentLineIndex, setCurrentLineIndex] = useState<number | undefined>(
    undefined
  );

  const playerRef = useRef<ReactAudioPlayer | null>(null);

  const handleMainMouseClick = (_: MouseEvent<HTMLDivElement>) => {
    const audioPlayer = playerRef.current;
    if (audioPlayer !== null) {
      const audioElement = audioPlayer.audioEl.current;
      if (audioElement !== null) {
        if (audioElement.paused) {
          audioElement.play();
        } else {
          audioElement.pause();
        }
      }
    }
  };

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

  const getLineColor = (idx: number): string => {
    if (currentLineIndex === idx) {
      if (duetPartInput) {
        const foundColor = findDuetPartColor(duetPartInput[idx]);
        return foundColor || "red";
      }
      return "red";
    }

    return "black";
  };

  const getLegendStyle = (duetColor: string): SxProps<Theme> => {
    const fontWeight =
      getLineColor(currentLineIndex || 0) === duetColor ? "bold" : "inherit";

    return { fontWeight, color: duetColor };
  };

  const getLineStyle = (idx: number): SxProps<Theme> => {
    const fontWeight = currentLineIndex === idx ? "bold" : "inherit";
    const color = getLineColor(idx);
    return { fontWeight, color };
  };

  return (
    <Paper elevation={2} id="storyTab">
      {mp3Upload && (
        <Grid2 container size={12} spacing={6} alignItems="center">
          <Grid2 size={4}>
            <ReactAudioPlayer
              id="player"
              ref={playerRef}
              controls
              src={mp3Upload}
              preload="auto"
              listenInterval={50}
              onListen={handleListen}
              onError={handleError}
            />
          </Grid2>
          {duetPartInput && (
            <Grid2 container>
              <Grid2 sx={getLegendStyle(duetColors["1"])}>Singer 1</Grid2>
              <Grid2 sx={getLegendStyle(duetColors["2"])}>Singer 2</Grid2>
              <Grid2 sx={getLegendStyle(duetColors.both)}>Both Singers</Grid2>
            </Grid2>
          )}
        </Grid2>
      )}
      <div
        style={titleTextStyle}
        dangerouslySetInnerHTML={{ __html: finishedTitleTextInput || "" }}
      ></div>
      <div style={finishedStoryStyles} onClick={handleMainMouseClick}>
        {finishedStoryText.map((storyLine, idx) => (
          <Box
            key={idx}
            ref={currentLineIndex === idx ? scrollRef : null}
            sx={getLineStyle(idx)}
            dangerouslySetInnerHTML={{ __html: storyLine }}
          ></Box>
        ))}
      </div>
    </Paper>
  );
};

export default FinishedStory;
