import { FillInType } from "../interfaces";

export const demoStoryText =
  "The @adjective @color @animal @imperative-verb over the @adjective @animal. What a @derogatory-term.";

const wordLists: FillInType = {
  adjective: ["quick", "lazy", "cute", "tired", "furry", "annoying"],
  color: ["brown", "black", "blue", "green"],
  animal: ["fox", "dog", "elephant", "lion", "unicorn", "narwhal", "capybara"],
  "imperative-verb": ["jumped", "left", "exorcised", "ate"],
  "derogatory-term": ["asshole", "butt", "knob", "twit", "jerk", "fuckwad"],
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
