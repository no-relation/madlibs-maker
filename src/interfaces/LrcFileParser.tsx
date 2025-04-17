import { LineType, LyricLine, MetadataLine, parse as lyricParse } from "clrc";

import { fromMs } from "hh-mm-ss";

export interface ILrcDataBySong {
  songTitle: string;
  lrcFileString: string;
}

interface SongData {
  lineTiming?: number[];
  text: string[];
  title?: string;
  duetParts?: DuetPart[];
}

export const getAllSongData = (text?: string | null): SongData => {
  return {
    lineTiming: getLyricTimings(text),
    text: getParsedLyrics(text),
    title: getTitle(text),
    duetParts: getDuetParts(text),
  };
};

export const getTitle = (text?: string | null): string | undefined => {
  const metadata = getMetadata(text);
  if (metadata.length > 0) {
    const titleLine = metadata.find((line) => line.key === "ti");
    if (titleLine) {
      return titleLine.value;
    }
  }
};

export const getMetadata = (text?: string | null): MetadataLine<string>[] => {
  if (text) {
    const parsed = getParsedLyricData(text);
    if (parsed) {
      const metadata = parsed.filter((line) => isMetadataLine(line));
      return metadata as MetadataLine<string>[];
    }
  }

  return [];
};

const getLyricLines = (text?: string | null): LyricLine[] => {
  if (text) {
    const parsed = getParsedLyricData(text);
    if (parsed) {
      const lyricLines = parsed.filter((line) => isLyricLine(line));
      return lyricLines as LyricLine[];
    }
  }

  return [];
};

const duetIndicator = ["M:", "F:", "D:"];
export const getParsedLyrics = (text?: string | null): string[] => {
  if (text) {
    const lyricLines = getLyricLines(text);
    if (lyricLines) {
      const mapped = lyricLines.map((line) => {
        if (duetIndicator.includes(line.content.slice(0, 2))) {
          return line.content.slice(2).trim();
        } else {
          return line.content.trim();
        }
      });
      return mapped;
    }
    // const parsed = getParsedLyricData(text);
    // if (parsed) {
    //   const mapped = parsed.map((line) => {
    //     if (isLyricLine(line)) {
    //       if (duetIndicator.includes(line.content.slice(0, 2))) {
    //         return line.content.slice(2).trim();
    //       } else {
    //         return line.content.trim();
    //       }
    //     }
    //     return "no content";
    //   });
    //   const filtered = mapped.filter((line) => line !== "no content");
    //   return filtered;
    // }
    return text.split("\n");
  }
  return [];
};

export const getLyricTimings = (text?: string | null): number[] | undefined => {
  if (text) {
    const parsed = getParsedLyricData(text);
    if (parsed) {
      return parsed
        .map((line) => {
          if (line.type === LineType.LYRIC) {
            return line.startMillisecond;
          }
          return 0;
        })
        .filter((time) => time !== 0);
    }
  }
};

export type DuetPart = "1" | "2" | "both" | undefined;
export const getDuetParts = (text?: string | null): DuetPart[] | undefined => {
  if (text) {
    const lyricLines = getLyricLines(text);
    if (lyricLines) {
      return lyricLines.map((line) => {
        switch (line.content.slice(0, 2)) {
          case "M:":
            return "1";
          case "F:":
            return "2";
          case "D:":
            return "both";
          default:
            return undefined;
        }
      });
    }
    // const parsed = getParsedLyricData(text);
    // if (parsed) {
    //   return parsed.map((line) => {
    //     if (isLyricLine(line)) {
    //       switch (line.content.slice(0, 2)) {
    //         case "M:":
    //           return "1";
    //         case "F:":
    //           return "2";
    //         case "D:":
    //           return "both";
    //         default:
    //           return undefined;
    //       }
    //     }
    //   });
    // }
  }
};

const getParsedLyricData = (text: string) => {
  if (text.length > 0 && text.startsWith("[")) {
    const regEx = /(?:\r\n|\r)/g;
    const newText = text.replace(regEx, "\n");
    return lyricParse(newText);
  }
  return undefined;
};

export const buildLrcFile = (
  storyTextInput: string[],
  lineTimingInput?: Array<number | undefined>,
  duetPartsInput?: DuetPart[],
  songTitle?: string
): string => {
  if (lineTimingInput) {
    const lrcFileArray: string[] = storyTextInput.map((text, idx) => {
      const timingInput = lineTimingInput[idx];
      let timingString: string = "";
      if (timingInput) {
        timingString = fromMs(timingInput, "mm:ss.sss");
      }
      let duetPart: string = "";
      if (duetPartsInput) {
        const duetPartInput = duetPartsInput[idx];
        if (duetPartInput) {
          switch (duetPartInput) {
            case "1":
              duetPart = "M:";
              break;
            case "2":
              duetPart = "F:";
              break;
            case "both":
              duetPart = "D:";
              break;
          }
        }
      }
      return `[${timingString}]${duetPart} ${text}`;
    });
    if (songTitle) {
      lrcFileArray.unshift(`[ti:${songTitle}]`);
    }
    return lrcFileArray.join("\n");
  }

  return storyTextInput.join("\n");
};

const isMetadataLine = (line: any): line is MetadataLine<string> => {
  return line["type"] === LineType.METADATA;
};

const isLyricLine = (line: any): line is LyricLine => {
  return line["type"] === LineType.LYRIC;
};
