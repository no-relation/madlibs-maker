import { Box } from "@material-ui/core";

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export type FillInType = {
  [x: string]: string[];
};

export const regexAtWords: RegExp = /@([A-Za-z0-9-_]+)/g;

export const isAtWordRepeated = (atWord: string): boolean => {
  const atWordArray = atWord.split(/[-_]/g);
  const lastElement = atWordArray[atWordArray.length - 1];
  const numberElement = parseInt(lastElement);
  return !isNaN(numberElement);
};

export function a11yProps(index: number, name?: string) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
    name: `${name || index}-tab`,
  };
}

export function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box sx={{ p: 3 }}>{children}</Box>
    </div>
  );
}

export const resetDialogTypeList = ["storyText", "fillIns"];
export type ResetDialogType = (typeof resetDialogTypeList)[number];
export const isResetDialogType = (str: string): str is ResetDialogType => {
  return resetDialogTypeList.some((t) => str === t);
};
export const findResetDialogType = (
  str: string
): ResetDialogType | undefined => {
  const strArray = str.split("-");
  return strArray.find((s) => isResetDialogType(s));
};

export const resetStyle: React.CSSProperties = {
  backgroundColor: "green",
  color: "white",
};
