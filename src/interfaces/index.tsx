export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export type FillInType = {
  [x: string]: string[];
};

export const regexAtWords: RegExp = /@([A-Za-z0-9-_]+)/g;
