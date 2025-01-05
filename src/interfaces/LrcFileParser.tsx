import { Line, LineType, parse as lyricParse } from "clrc";

export const getMetadata = (text: string): Line[] => {
  if (text.length > 0 && text.startsWith("[")) {
    const parsed = getParsedLyricData(text);
    if (parsed) {
      const metadata = parsed.filter((line) => line.type === LineType.METADATA);
      return metadata;
    }
  }

  return [];
};

export const getParsedLyrics = (text: string): string[] => {
  if (text.length > 0 && text.startsWith("[")) {
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

export const getLyricTimings = (text: string): number[] | undefined => {
  if (text.length > 0 && text.startsWith("[")) {
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

const getParsedLyricData = (text: string) => {
  if (text.length > 0 && text.startsWith("[")) {
    if (text.startsWith("[")) {
      return lyricParse(text);
    }
  }
  return undefined;
};

export const stringify = (lines: Line[]): string => {
  return lines.map((line) => line.raw).join("\n");
};
