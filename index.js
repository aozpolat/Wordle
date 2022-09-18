const WORD_SIZE = 5;
const ROW_SIZE = 6;
const letterBoxs = document.querySelectorAll(".letter");
let currentWord = "";
let currentIndex = 0;
let currentRow = 0;
let endGame = false;
let wordMap = {};

const getTodaysWord = async () => {
  let res = await fetch("https://words.dev-apis.com/word-of-the-day");
  res = await res.json();
  return res.word.toUpperCase();
};

const youWin = () => {
  endGame = true;
  for (let i = 0; i < 30; i++) {
    if (i < currentRow * WORD_SIZE || i > currentRow * WORD_SIZE + 4) {
      letterBoxs[i].classList.add("background");
    }
  }
  for (let i = 0; i < currentWord.length; i++) {
    letterBoxs[currentRow * WORD_SIZE + i].classList.remove("invalid");
    setTimeout(() => {
      letterBoxs[currentRow * WORD_SIZE + i].classList.add("win");
    }, i * 200);
  }
};

const validButNotTrue = (wordOfDay) => {
  wordMap = createMap(currentWord);
  for (let i = 0; i < currentWord.length; i++) {
    if (currentWord[i] == wordOfDay[i]) {
      wordMap[currentWord[i]]--;
      letterBoxs[currentRow * WORD_SIZE + i].classList.add("correct");
    }
  }

  for (let i = 0; i < currentWord.length; i++) {
    if (wordMap[currentWord[i]] > 0 && wordOfDay.includes(currentWord[i])) {
      wordMap[currentWord[i]]--;
      letterBoxs[currentRow * WORD_SIZE + i].classList.add("not-in-order");
    }
  }
  currentRow++;
  currentIndex = 0;
  currentWord = "";
};

const validateWord = async () => {
  res = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({ word: currentWord }),
  });
  res = await res.json();
  return res.validWord;
};

const main = () => {
  document.addEventListener("keydown", async (e) => {
    if (!endGame) {
      if (e.key == "Enter" && currentWord.length == 5) {
        const wordOfDay = await getTodaysWord();
        if (currentWord == wordOfDay) {
          youWin();
          return;
        }
        let isValid = await validateWord();
        if (!isValid) {
          for (let i = 0; i < currentWord.length; i++) {
            letterBoxs[currentRow * WORD_SIZE + i].classList.remove("invalid");

            setTimeout(() => {
              letterBoxs[currentRow * WORD_SIZE + i].classList.add("invalid");
            }, 10);
          }
        } else {
          //valid
          validButNotTrue(wordOfDay);
        }
      } else if (e.key == "Backspace") {
        handleBackspace();
      } else if (isLetter(e.key)) {
        handleLetter(e.key.toUpperCase());
      }
      console.log(currentWord, currentIndex);
    }

    // console.log(currentWord);
  });
};

main();

const handleBackspace = () => {
  if (currentIndex == 0) return;
  const currentBox = letterBoxs[currentRow * WORD_SIZE + currentIndex - 1];
  currentBox.innerText = "";
  if (currentWord.length) {
    currentWord = currentWord.substring(0, currentIndex - 1);
  }
  if (currentIndex > 0) {
    currentIndex--;
  }
};

const handleLetter = (letter) => {
  if (currentIndex < 5) {
    const currentBox = letterBoxs[currentRow * WORD_SIZE + currentIndex];
    currentBox.innerText = letter;
  }
  if (currentWord.length <= 5) {
    if (currentWord.length == 5) {
      currentWord = currentWord.substring(0, 4) + letter;
    } else {
      currentWord += letter;
    }
  }
  if (currentIndex <= 4) {
    currentIndex++;
  }
};

const isLetter = (ch) => {
  return (
    typeof ch === "string" &&
    ch.length === 1 &&
    ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z"))
  );
};

const createMap = (word) => {
  let obj = {};
  for (let i = 0; i < word.length; i++) {
    if (obj[word[i]]) {
      obj[word[i]] = obj[word[i]] + 1;
    } else {
      obj[word[i]] = 1;
    }
  }
  return obj;
};
