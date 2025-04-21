import { DuetPart } from "../interfaces/LrcFileParser";
import { SxProps } from "@mui/material/styles";

export const duetColors = {
  1: "#d21919",
  2: "#673ab7",
  both: "#19d236",
};

export const findDuetPartColor = (
  duetPartInput?: DuetPart
): string | undefined => {
  if (duetPartInput === undefined) {
    return;
  }

  return duetColors[duetPartInput];
};

export const titleTextStyle: React.CSSProperties = {
  fontSize: "xxx-large",
  fontWeight: "bold",
  textShadow: "2px 2px 1px gray",
  textTransform: "capitalize",
  textAlign: "center",
};

export const finishedStoryStyles: React.CSSProperties = {
  fontSize: "xx-large",
  height: "50vh",
  margin: "1em 0",
  overflow: "auto",
  padding: "1em",
};

export const resetStyle: React.CSSProperties = {
  backgroundColor: "green",
  color: "white",
};

interface ShowStyle {
  header: {
    logo: SxProps;
    root: SxProps;
    presentsTitle: SxProps;
    mainTitle: SxProps;
  };
}

export const getShowStyle = (name: string): ShowStyle => {
  let showStyleValues = showStyles.find((ss) => ss.name === name);
  if (!showStyleValues) {
    showStyleValues = showStyles.find((ss) => ss.name === "base");
  }
  return {
    header: {
      logo: {
        height: 90,
        // rotate: "-20deg",
        padding: "0.75em 2em",
      },
      root: {
        backgroundImage: `url(${
          process.env.PUBLIC_URL + `/images/${showStyleValues?.backgroundImage}`
        })`,
        background: showStyleValues!.background,
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "space-between",
      },
      presentsTitle: {
        fontSize: "x-large",
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: showStyleValues!.presentsTitle.backgroundColor,
        borderRadius: "20px",
        textShadow: "5px 5px 7px black",
        color: showStyleValues!.presentsTitle.color,
        margin: "auto",
        padding: "0 0.5em",
        width: "fit-content",
      },
      mainTitle: {
        fontSize: "xxx-large",
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: showStyleValues!.mainTitle.backgroundColor,
        borderRadius: "20px",
        textShadow: "5px 5px 7px black",
        color: showStyleValues!.mainTitle.color,
        margin: "auto",
        padding: "0 0.5em",
        width: "fit-content",
      },
    },
  };
};

const showStyles = [
  {
    name: "base",
    backgroundImage: "eq_bkgnd.png",
    background: null,
    presentsTitle: {
      backgroundColor: "rgb(236 30 121)",
      color: "white",
    },
    mainTitle: {
      backgroundColor: "rgb(123 223 221)",
      color: "white",
    },
  },
  {
    name: "christmas",
    backgroundImage: "snowflakes-554635_1920.jpg",
    background: null,
    presentsTitle: {
      backgroundColor: "green",
      color: "white",
    },
    mainTitle: {
      backgroundColor: "red",
      color: "white",
    },
  },
  {
    name: "valentines",
    backgroundImage: "ValentinesDayBackgroundDesktopWallpaper.jpg",
    background: null,
    presentsTitle: {
      backgroundColor: "pink",
      color: "white",
    },
    mainTitle: {
      backgroundColor: "red",
      color: "white",
    },
  },
];
