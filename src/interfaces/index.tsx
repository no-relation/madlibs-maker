export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export type FillInType = {
  [x: string]: string[];
};
