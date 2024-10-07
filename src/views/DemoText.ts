import { FillInType } from "../interfaces";

export const demoStoryText =
  // "The @adjective brown @animal @imperative-verb the @adjective @animal. What a @derogatory-term.";
  "It's close to @time-of-day\nAnd something evil's lurking in the @noun\nUnder the @noun\nYou see a sight that almost stops your @noun\nYou try to scream\nBut terror takes the sound before you make it\nYou start to freeze\nAs horror looks you right between the eyes\nYou're paralyzed\n\n[Chorus]\n'Cause this is @spooky-term-1, @spooky-term-1 night\nAnd no one's gonna save you\nFrom the @noun about to strike\nYou know it's @spooky-term-1, @spooky-term-1 night\nYou're fighting for your @noun inside a killer\n@spooky-term-1 tonight, yeah\nOoh";

const wordLists: FillInType = {
  "time-of-day": ["midnight", "noon", "breakfast", "three forty-five", "9ish"],
  noun: ["dark", "moonlight", "socks", "nightmares", "children", "beast"],
  "spooky-term-1": ["thriller", "creepy", "Republican", "spooky"],
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
