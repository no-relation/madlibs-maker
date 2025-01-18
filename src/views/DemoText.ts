import { FillInType } from "../interfaces";
import { songOptions } from "../SongOptions";

const song = songOptions[0];

export const mp3Upload = song.songFile;
const lrcFileName = song.lrcFile;
console.log(lrcFileName);
export const lrcFileString = async () => {
  const fileString = await fetch(lrcFileName)
    .then((res) => res.text())
    .catch((err) => {
      console.error(err);
      return null;
    });
  return fileString;
};
export const demoStoryTitle = `${song.title} - ${song.artist}`;
export const demoStoryText =
  // "The @adjective brown @animal @imperative-verb the @adjective @animal. What a @derogatory-term.";
  // "It's close to @time-of-day\nAnd something evil's lurking in the @noun\nUnder the @noun\nYou see a sight that almost stops your @noun\nYou try to scream\nBut terror takes the sound before you make it\nYou start to freeze\nAs horror looks you right between the eyes\nYou're paralyzed\n\n[Chorus]\n'Cause this is @spooky-term-1, @spooky-term-1 night\nAnd no one's gonna save you\nFrom the @noun about to strike\nYou know it's @spooky-term-1, @spooky-term-1 night\nYou're fighting for your @noun inside a killer\n@spooky-term-1 tonight, yeah\nOoh";
  "[id: ojwraduo]\n[ar: Mariah Carey]\n[al: Christmas Xmas Various Artists Collection FLAC [Bubanee]]\n[ti: All I Want for Christmas]\n[length: 04:04]\n[00:00.1]***Intro***\n[00:06.49]I don't want a lot for @holiday-1\n[00:13.24]There is just one thing I need\n[00:17.09]I don't care about the @item-1 underneath the @item-2\n[00:24.34]I just want you for my own\n[00:28.55]More than you could ever know\n[00:32.99]Make my wish come true\n[00:38.99]All I want for @holiday-1 is you\n[00:52.44]\n[00:54.65]Yeah\n[00:57.14]I don't want a lot for @holiday-1\n[01:00.01]There is just one thing I need (and I)\n[01:03.84]Don't care about the @item-1 underneath the @item-2\n[01:09.66]I don't need to hang my stocking there upon the fireplace\n[01:16.56]Santa Claus won't make me happy with a toy on @holiday-1 Day\n[01:22.45]I just want you for my own\n[01:25.60]More than you could ever know\n[01:28.86]Make my wish come true\n[01:32.51]All I want for @holiday-1 is you\n[01:38.89]You, baby\n[01:41.76]Oh, I won't ask for much this @holiday-1\n[01:44.88]I won't even wish for snow (and I)\n[01:48.78]I'm just gonna keep on waiting underneath the mistletoe\n[01:54.52]I won't make a list and send it to the North Pole for Saint Nick\n[02:00.92]I won't even stay awake to hear those magic reindeer click\n[02:07.48]'Cause I just want you here tonight\n[02:10.56]Holding on to me so tight\n[02:13.75]What more can I do?\n[02:16.57]Oh, baby, all I want for @holiday-1 is you\n[02:23.42]You, baby\n[02:26.67]Oh-oh, all the lights are shining so brightly everywhere (so brightly, baby)\n[02:33.09]And the sound of children's laughter fills the air (oh, oh, yeah)\n[02:39.97]And everyone is singing (oh, yeah)\n[02:43.15]I hear those sleigh bells ringing\n[02:45.93]Santa, won't you bring me the one I really need? (Yeah, oh)\n[02:49.14]Won't you please bring my baby to me?\n[02:52.30]Oh, I don't want a lot for @holiday-1\n[02:55.28]This is all I'm asking for\n[02:59.55]I just wanna see my baby standing right outside my door\n[03:04.60]Oh, I just want you for my own\n[03:08.03]More than you could ever know\n[03:11.38]Make my wish come true\n[03:14.11]Oh, baby, all I want for @holiday-1 is you\n[03:20.46]You, baby\n[03:24.90]\n[03:28.36]All I want for @holiday-1 is you, baby\n[03:33.86]All I want for @holiday-1 is you, baby\n[03:39.52]All I want for @holiday-1 is you, baby\n[03:46.25]All I want for @holiday-1 (all I really want) is you, baby\n[03:52.83]All I want (I want) for @holiday-1 (all I really want) is you, baby\n[03:57.31]";
const wordLists: FillInType = {
  // "time-of-day": ["midnight", "noon", "breakfast", "three forty-five", "9ish"],
  // noun: ["dark", "moonlight", "socks", "nightmares", "children", "beast"],
  // "spooky-term-1": ["thriller", "creepy", "Republican", "spooky"],
  "holiday-1": ["Halloween", "Thanksgiving", "My birthday"],
  "item-1": ["cars", "flowers", "sins", "comics"],
  "item-2": ["table", "sun", "His Watchful Eye"],
};

export const getUniqueRandomWord = (
  fromList: string,
  compareList?: string[]
) => {
  const randomWordList = wordLists[fromList];
  if (randomWordList) {
    let randomWord =
      randomWordList[Math.floor(Math.random() * randomWordList.length)];
    if (compareList && compareList.includes(randomWord)) {
      randomWord = getUniqueRandomWord(
        fromList,
        compareList.filter((word) => word !== randomWord)
      );
    }
    return randomWord;
  }

  return "";
};
