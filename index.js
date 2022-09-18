const WORD_SIZE = 5;
const ROW_SIZE = 6;

const main = async () => {
  const letterBoxs = document.querySelectorAll(".letter");
  let currentWord = "";
  let currentIndex = 0;
  let currentRow = 0;

  document.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      console.log("Enter");
    } else if (e.key == "Backspace") {
      const currentBox = letterBoxs[currentRow * ROW_SIZE + currentIndex];
      currentBox.innerText = "";
      if (currentWord.length) {
        currentWord = currentWord.substring(0, currentIndex);
      }
      if (currentIndex > 0) {
        currentIndex--;
      }
    } else if (isLetter(e.key)) {
      const currentBox = letterBoxs[currentRow * ROW_SIZE + currentIndex];
      currentBox.innerText = e.key;
      if (currentWord.length != 5) {
        currentWord += e.key;
      }
      if (currentIndex < 4) {
        currentIndex++;
      }
    }
    console.log(currentWord);
  });
};

main();

const isLetter = (ch) => {
  return (
    typeof ch === "string" &&
    ch.length === 1 &&
    ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z"))
  );
};
