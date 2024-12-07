import { FillInType } from "../interfaces";

export const demoStoryText =
  // "The @adjective brown @animal @imperative-verb the @adjective @animal. What a @derogatory-term.";
  // "It's close to @time-of-day\nAnd something evil's lurking in the @noun\nUnder the @noun\nYou see a sight that almost stops your @noun\nYou try to scream\nBut terror takes the sound before you make it\nYou start to freeze\nAs horror looks you right between the eyes\nYou're paralyzed\n\n[Chorus]\n'Cause this is @spooky-term-1, @spooky-term-1 night\nAnd no one's gonna save you\nFrom the @noun about to strike\nYou know it's @spooky-term-1, @spooky-term-1 night\nYou're fighting for your @noun inside a killer\n@spooky-term-1 tonight, yeah\nOoh";
  "Sleigh @noisemaker-plural ring, are you listening?\nIn the lane, snow is @adjective-1\nA beautiful sight, we're happy tonight\nWalking in a @happy-place-with-5-syllables\nGone away is the blue@animal-1\nHere to stay is a new @animal-1 \nHe sings a @emotion song as we go along\nWalking in a @happy-place-with-5-syllables\n\nIn the meadow, we can build a @noun\nAnd pretend that he is @famous-person\nHe'll say, \"Are you married?\" We'll say, \"@expletive No man\"\nBut you can do the job when you're in town\n\nLater on, we'll @verb\nAs we dream by the @noun\nTo face unafraid, the plans that we've made\nWalking in a @happy-place-with-5-syllables";
const wordLists: FillInType = {
  // "time-of-day": ["midnight", "noon", "breakfast", "three forty-five", "9ish"],
  // noun: ["dark", "moonlight", "socks", "nightmares", "children", "beast"],
  // "spooky-term-1": ["thriller", "creepy", "Republican", "spooky"],
  "noisemaker-plural": ["horns", "kazoos", "cannons"],
  "adjective-1": ["shiny", "sleepy", "horny"],
  "happy-place-with-5-syllables": [
    "Wonka Candyland",
    "Sexy Fantasy",
    "Gay Lib Paradise",
  ],
  "animal-1": ["cow", "dog", "llama"],
  emotion: ["hate", "sad", "thirsty", "wicked"],
  noun: ["airplane", "minefield", "table", "TV", "couch", "Taco Bell"],
  "famous-person": ["Michael Jordan", "Galileo", "Carrie Fisher"],
  expletive: ["Fuck", "Hell", "Damn", "Taxes"],
  verb: ["sleep", "eat", "murder", "game"],
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
