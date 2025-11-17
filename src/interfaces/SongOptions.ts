import { isEmpty, isNil } from "lodash";

const dataFolders = process.env.PUBLIC_URL + "/musicSrc/";

const rawSongOptions: SongOption[] = [
  {
    artist: "They Might Be Giants",
    title: "Birdhouse In Your Soul",
    lrcFile:
      dataFolders +
      "Birdhouse_In_Your_Soul/They Might Be Giants - Birdhouse In Your Soul.lrc",
    songFile:
      dataFolders + "Birdhouse_In_Your_Soul/02 Birdhouse In Your Soul.mp3",
  },
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
    artist: "Elton John and Kiki Dee",
    title: "Don't Go Breaking My Heart (Demo)",
    lrcFile:
      dataFolders +
      "Dont_go_breaking_my_heart/Dont_go_breaking_my_heart_demo.lrc",
    songFile:
      dataFolders + "Dont_go_breaking_my_heart/Dont_go_breaking_my_heart.mp3",
    demo: true,
    order: 1,
  },
];

export const getSongOptions = (demo?: boolean): SongOption[] => {
  const songOptions = rawSongOptions.filter((opt) => !opt.hide); // && opt.demo === demo)
  songOptions.sort((a, b) => songOptionSort(a, b));
  return songOptions.map(
    (opt) =>
      new SongOption(opt.artist, opt.title, opt.lrcFile, opt.songFile, opt.demo)
  );
};

const songOptionSort = (a: SongOption, b: SongOption): number => {
  const aOrder = a.order || 1000;
  const bOrder = b.order || 1000;

  return aOrder - bOrder;
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
  demo?: boolean;
  hide?: boolean;
  order?: number;

  constructor(
    artist: string,
    title: string,
    lrcFile: string,
    songFile: string,
    demo?: boolean
  ) {
    this.artist = artist;
    this.title = title;
    this.lrcFile = lrcFile;
    this.songFile = songFile;
    this.displayTitle = `${this.title} - ${this.artist}`;
    this.demo = demo;
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
  let songData: SongDataLocalStorage[] = [];
  let songDatum: SongDataLocalStorage | undefined;

  if (!isNil(fileString) && !isEmpty(fileString)) {
    songData = JSON.parse(fileString);
  }
  if (songSelection) {
    songDatum = songData.find((d) => d.songTitle === songSelection.title);
    if (songDatum === undefined) {
      const lrcFileString = await getLrcFileString(songSelection.lrcFile);
      if (lrcFileString) {
        saveSongData(songSelection.title, lrcFileString);
        return lrcFileString;
      }
    } else {
      return songDatum.lrcFileString;
    }
  }
};
