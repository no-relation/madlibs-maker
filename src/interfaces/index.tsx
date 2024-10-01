export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export type FillInType = {
  [x: string]: string[];
};

export const regexAtWords: RegExp =
  /(?<=^|(?<=[^a-zA-Z0-9-_.]))@([A-Za-z]+[A-Za-z0-9-_]+)/g;
