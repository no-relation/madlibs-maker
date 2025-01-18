const dataFolders = process.env.PUBLIC_URL + "/musicSrc/";

export const songOptions = [
  {
    artist: "They Might Be Giants",
    title: "Birdhouse In Your Soul",
    lrcFile:
      dataFolders +
      "Birdhouse_In_Your_Soul/They Might Be Giants - Birdhouse In Your Soul.lrc",
    songFile: dataFolders + "Birdhouse_In_Your_Soul/Birdhouse In Your Soul.mp3",
  },
  {
    artist: "Lionel Richie",
    title: "Endless Love",
    lrcFile: dataFolders + "Endless_Love/Endless_Love.lrc",
    songFile: dataFolders + "Endless_Love/Endless Love.mp3",
  },
  {
    artist: "Bill Medley & Jennifer Warnes",
    title: "(I've Had) The Time Of My Life",
    lrcFile: dataFolders + "The_Time_Of_My_Life/The_Time_Of_My_Life.lrc",
    songFile:
      dataFolders +
      "The_Time_Of_My_Life/The Time Of My Life (From Dirty Dancing Soundtrack).mp3",
  },
  {
    artist: "Barenaked Ladies",
    title: "Be My Yoko Ono",
    lrcFile: dataFolders + "Be_My_Yoko_Ono/Be_My_Yoko_Ono.lrc",
    songFile: dataFolders + "Be_My_Yoko_Ono/Be My Yoko Ono.mp3",
  },
];
