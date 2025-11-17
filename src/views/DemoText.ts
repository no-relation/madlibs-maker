import { FillInType } from "../interfaces";

export const demoStoryTitle = "Demo Text";
export const demoStoryText =
  "The @adjective brown @animal @imperative-verb the @adjective @animal. What a @derogatory-term.";

const wordLists: FillInType = {
  adjective: ["quick", "sleepy", "tired", "intelligent"],
  animal: ["fox", "sloth", "elephant", "seal", "penguin"],
  "imperative-verb": ["jumped", "sidled", "flirted with", "fought"],
  "derogatory-term": ["asshole", "choad", "tit", "knob", "fuckwit"],
  "body-part": ["mind", "genitals", "finger", "nose"],
  noun: ["house", "wok", "shoe", "phone", "Stanley cup", "dog"],
  "synonym-for-sad": ["down", "blue", "bummed", "tired"],
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

  return fromList;
};
