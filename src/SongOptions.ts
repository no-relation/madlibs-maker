import { isEmpty, isNil } from "lodash";

const dataFolders = process.env.PUBLIC_URL + "/musicSrc/";

const rawSongOptions: SongOption[] = [
  // {
  //   artist: "They Might Be Giants",
  //   title: "Birdhouse In Your Soul",
  //   lrcFile:
  //     dataFolders +
  //     "Birdhouse_In_Your_Soul/They Might Be Giants - Birdhouse In Your Soul.lrc",
  //   songFile: dataFolders + "Birdhouse_In_Your_Soul/Birdhouse In Your Soul.mp3",
  // },
  {
    artist: "Bill Medley & Jennifer Warnes",
    title: "(I've Had) The Time Of My Life",
    lrcFile: dataFolders + "The_Time_Of_My_Life/The_Time_Of_My_Life.lrc",
    songFile: dataFolders + "The_Time_Of_My_Life/The_Time_Of_My_Life.mp3",
  },
  {
    artist: "Elton John and Kiki Dee",
    title: "Don't Go Breaking My Heart",
    lrcFile:
      dataFolders + "Dont_go_breaking_my_heart/Dont_go_breaking_my_heart.lrc",
    songFile:
      dataFolders + "Dont_go_breaking_my_heart/Dont_go_breaking_my_heart.mp3",
  },
  {
    artist: "Lionel Richie",
    title: "Endless Love",
    lrcFile: dataFolders + "Endless_Love/Endless_Love.lrc",
    songFile: dataFolders + "Endless_Love/Endless_Love.mp3",
  },
  // {
  //   artist: "Barenaked Ladies",
  //   title: "Be My Yoko Ono",
  //   lrcFile: dataFolders + "Be_My_Yoko_Ono/Be_My_Yoko_Ono.lrc",
  //   songFile: dataFolders + "Be_My_Yoko_Ono/Be My Yoko Ono.mp3",
  // },
];

export const getSongOptions = (): SongOption[] => {
  return rawSongOptions.map(
    (opt) => new SongOption(opt.artist, opt.title, opt.lrcFile, opt.songFile)
  );
};

export const getLrcFileString = async (lrcFileName: string) => {
  const fileString = await fetch(lrcFileName)
    .then((res) => res.text())
    .catch((err) => {
      console.error(err);
      return null;
    });
  return fileString;
};

export class SongOption {
  artist: string;
  title: string;
  lrcFile: string;
  lrcText?: string;
  songFile: string;
  displayTitle?: string;

  constructor(
    artist: string,
    title: string,
    lrcFile: string,
    songFile: string
  ) {
    this.artist = artist;
    this.title = title;
    this.lrcFile = lrcFile;
    this.songFile = songFile;
    this.displayTitle = `${this.title} - ${this.artist}`;
  }
}

export interface SongDataLocalStorage {
  songTitle: string;
  lrcFileString: string;
}

export const LRC_DATA_BY_SONG = "lrcDataBySong";

export const saveSongData = (songTitle: string, lrcFileString: string) => {
  const songData: SongDataLocalStorage = {
    songTitle,
    lrcFileString,
  };
  let localStored = localStorage.getItem(LRC_DATA_BY_SONG);
  let songDatas: SongDataLocalStorage[] = [];
  if (localStored) {
    songDatas = JSON.parse(localStored);
    const foundDataIdx = songDatas.findIndex(
      (d) => d.songTitle === songData.songTitle
    );
    if (foundDataIdx === -1) {
      songDatas.push(songData);
    } else {
      songDatas[foundDataIdx] = songData;
    }
  } else {
    songDatas.push(songData);
  }
  localStorage.setItem(LRC_DATA_BY_SONG, JSON.stringify(songDatas));
};

export const getLrcFile = async (
  songSelection: SongOption
): Promise<string | null | undefined> => {
  let fileString = localStorage.getItem(LRC_DATA_BY_SONG);
  let songDatas: SongDataLocalStorage[] = [];
  let songData: SongDataLocalStorage | undefined;

  if (!isNil(fileString) && !isEmpty(fileString)) {
    songDatas = JSON.parse(fileString);
  }
  if (songSelection) {
    songData = songDatas.find((d) => d.songTitle === songSelection.title);
    if (songData === undefined) {
      const lrcFileString = await getLrcFileString(songSelection.lrcFile);
      if (lrcFileString) {
        saveSongData(songSelection.title, lrcFileString);
        return lrcFileString;
      }
    } else {
      return songData.lrcFileString;
    }
  }
};
