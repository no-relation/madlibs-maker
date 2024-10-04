import { FillInType } from "../interfaces";

export const demoStoryText =
  "The @adjective brown @animal @imperative-verb the @adjective @animal. What a @derogatory-term.";

const wordLists: FillInType = {
  adjective: ["quick", "lazy", "cute", "tired", "furry", "annoying"],
  color: ["brown", "black", "blue", "green"],
  animal: ["fox", "dog", "elephant", "lion", "unicorn", "narwhal", "capybara"],
  "imperative-verb": ["jumped over", "left", "exorcised", "ate"],
  "derogatory-term": ["butt", "knob", "twit", "jerk"],
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
