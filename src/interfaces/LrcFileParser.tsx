import { LineType, LyricLine, parse as lyricParse } from "clrc";
import { isArray, isEmpty, isNil, isNumber } from "lodash";

export const getParsedLyrics = (text: string): string[] => {
  if (text.startsWith("[")) {
    const parsed = getParsedLyricData(text);
    if (parsed) {
      const mapped = parsed.map((line) => {
        if (line.type === LineType.LYRIC) {
          return line.content;
        }
        return "no content";
      });
      const filtered = mapped.filter((line) => line !== "no content");
      return filtered;
    }
  }

  return text.split("\n");
};

export const getLyricTimings = (text: string): number[] => {
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
  return [];
};

const getParsedLyricData = (text: string) => {
  if (text.length > 0) {
    if (text.startsWith("[")) {
      return lyricParse(text);
    }
  }
  return undefined;
};
