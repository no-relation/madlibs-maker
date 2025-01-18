import {
  Line,
  LineType,
  LyricLine,
  MetadataLine,
  parse as lyricParse,
} from "clrc";

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

export const getParsedLyrics = (text?: string | null): string[] => {
  if (text) {
    const parsed = getParsedLyricData(text);
    if (parsed) {
      const mapped = parsed.map((line) => {
        if (isLyricLine(line)) {
          return line.content;
        }
        return "no content";
      });
      const filtered = mapped.filter((line) => line !== "no content");
      return filtered;
    }
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

const getParsedLyricData = (text: string) => {
  if (text.length > 0 && text.startsWith("[")) {
    const regEx = /(?:\r\n|\r)/g;
    const newText = text.replace(regEx, "\n");
    return lyricParse(newText);
  }
  return undefined;
};

export const stringify = (lines: Line[]): string => {
  return lines.map((line) => line.raw).join("\n");
};

const isMetadataLine = (line: any): line is MetadataLine<string> => {
  return line["type"] === LineType.METADATA;
};

const isLyricLine = (line: any): line is LyricLine => {
  return line["type"] === LineType.LYRIC;
};
