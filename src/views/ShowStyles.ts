import { SxProps } from "@mui/material/styles";
// import headerBkgd from "/images/eq_bkgnd.png";

export const titleTextStyle: React.CSSProperties = {
  fontSize: "xxx-large",
  fontWeight: "bold",
  textShadow: "2px 2px 1px gray",
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
    root: SxProps;
    presentsTitle: SxProps;
    mainTitle: SxProps;
  };
}
export const christmasShow: ShowStyle = {
  header: {
    root: {
      backgroundImage: `url(${
        process.env.PUBLIC_URL + "/images/snowflakes-554635_1920.jpg"
      })`,
      //   background:
      //     "repeating-linear-gradient(45deg, #ffffff, #ffffff 20px, #fa3030 10px, #fa3030 50px )",
    },
    presentsTitle: {
      fontSize: "x-large",
      fontWeight: "bold",
      textAlign: "center",
      backgroundColor: "green",
      borderRadius: "20px",
      textShadow: "5px 5px 7px black",
      color: "white",
      margin: "auto",
      padding: "0 0.5em",
      width: "fit-content",
    },
    mainTitle: {
      fontSize: "xxx-large",
      fontWeight: "bold",
      textAlign: "center",
      backgroundColor: "red",
      borderRadius: "20px",
      textShadow: "5px 5px 7px black",
      color: "white",
      margin: "auto",
      padding: "0 0.5em",
      width: "fit-content",
    },
  },
};

export const baseStyle: ShowStyle = {
  header: {
    root: {
      backgroundImage: `url(${
        process.env.PUBLIC_URL + "/images/eq_bkgnd.png"
      })`,
    },
    presentsTitle: {
      fontSize: "x-large",
      fontWeight: "bold",
      textAlign: "center",
      backgroundColor: "rgb(236 30 121)",
      borderRadius: "20px",
      textShadow: "5px 5px 7px black",
      color: "white",
      margin: "auto",
      padding: "0 0.5em",
      width: "fit-content",
    },
    mainTitle: {
      fontSize: "xxx-large",
      fontWeight: "bold",
      textAlign: "center",
      backgroundColor: "rgb(123 223 221)",
      borderRadius: "20px",
      textShadow: "5px 5px 7px black",
      color: "white",
      margin: "auto",
      padding: "0 0.5em",
      width: "fit-content",
    },
  },
};
