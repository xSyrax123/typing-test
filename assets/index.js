const timerElement = document.querySelector(".timer");
const inputElement = document.querySelector("input");
const resetButton = document.querySelector(".btn");
const wordsContainer = document.querySelector(".words-container");
const paragraph = wordsContainer.querySelector("p");
const result = document.querySelector(".result");
const wpm_element = document.querySelector("#wpm");
const keystrokes = document.querySelector("#keystrokes");
const accuracy = document.querySelector("#accuracy");
const correct_words = document.querySelector("#correct-words");
const wrong_words = document.querySelector("#wrong-words");
const TOTAL_TIME_MINUTES = 1;

let words_txt;
let timerValue = 60;
let timerInterval;
let handleInputEvent;
let wordIndex = 0;
let correct_words_counter = 0;
let wrong_words_counter = 0;
let accuracy_counter = 0;
let character_counter = 0;
let correct_keys_counter = 0;
let wpm = 0;
let randomWords = [];

resetButton.addEventListener("click", resetTimer);
inputElement.addEventListener("input", handleInput);

function updateTimer() {
  timerValue--;
  const minutes = Math.floor(timerValue / 60);
  const seconds = timerValue % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  if (timerValue === 0) {
    clearInterval(timerInterval);
    wpm = Math.round((character_counter / 5) / TOTAL_TIME_MINUTES);
    accuracy_counter = (correct_keys_counter / character_counter) * 100; 
    inputElement.disabled = true;
    inputElement.textContent = "";
    wpm_element.textContent = `${wpm} WPM`;
    keystrokes.textContent = character_counter;
    accuracy.textContent = `${accuracy_counter.toFixed(2)}%`;
    wrong_words.textContent = wrong_words_counter;
    correct_words.textContent = correct_words_counter;
    paragraph.innerHTML = "";
    result.style.visibility = "visible";
    correct_words.style.color = "green";
    wrong_words.style.color = "red";
  }
  timerElement.textContent = formattedTime;
}

function startTimerOnKeyPress() {
  if (!timerInterval) {
    timerInterval = setInterval(updateTimer, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerValue = 60;
  timerInterval = null;
  timerElement.textContent = "01:00";
  inputElement.disabled = false;
  gameOver = false;
  correct_words_counter = 0;
  correct_keys_counter = 0;
  wrong_words_counter = 0;
  accuracy_counter = 0;
  keystrokes_counter = 0;
  character_counter = 0;
  result.style.visibility = "hidden";
  resetWords();
}

// Algoritmo de Fisher-Yates
function shuffleArray(array) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function getRandomWords(words, count) {
  const shuffledWords = shuffleArray(words);
  return shuffledWords.slice(0, count);
}

function resetWords() {
  inputElement.value = "";
  startGame();
}

function handleInput(event) {
  const inputValue = event.target.value;
  const currentWord = randomWords[wordIndex];
  const spans = paragraph.querySelectorAll("span");

  character_counter++;

  if (currentWord && currentWord.startsWith(inputValue)) {
    spans[wordIndex].style.backgroundColor = "lightgray";
    correct_keys_counter++;
  } else {
    spans[wordIndex].style.backgroundColor = "red";
  }

  if (inputValue.endsWith(" ")) {
    const typedWord = inputValue.trim();

    if (typedWord === currentWord) {
      clearInput();
      markCorrectWord();
      wordIndex++;
      correct_words_counter++;

      if (wordIndex === randomWords.length) {
        resetWords();
      } else {
        highlightNextWord();
      }
    } else {
      markIncorrectWord();
      wordIndex++;
      wrong_words_counter++;

      if (wordIndex === randomWords.length) {
        resetWords();
      } else {
        highlightNextWord();
      }
    }
  }

  startTimerOnKeyPress();
}

function clearInput() {
  inputElement.value = "";
}

function markCorrectWord() {
  const span = paragraph.querySelectorAll("span")[wordIndex];
  span.classList.add("correct");
  span.style.color = "green";
  span.style.backgroundColor = "transparent";
}

function markIncorrectWord() {
  const span = paragraph.querySelectorAll("span")[wordIndex];
  span.style.color = "red";
  span.style.backgroundColor = "transparent";
}

function highlightNextWord() {
  const nextWord = paragraph.querySelectorAll("span")[wordIndex];
  nextWord.style.backgroundColor = "lightgray";
  clearInput();
}

function startGame() {
  const words = words_txt.split(" ");
  randomWords = getRandomWords(words, 5);
  wordIndex = 0;
  paragraph.innerHTML = "";

  randomWords.forEach((word, index) => {
    const span = document.createElement("span");
    span.textContent = word;
    paragraph.appendChild(span);
    paragraph.appendChild(document.createTextNode(" "));

    if (index === 0) {
      span.style.backgroundColor = "lightgray";
    }
  });
}

fetch("./words.txt")
  .then((response) => response.text())
  .then((data) => {
    words_txt = data;
    startGame();
  })
  .catch((error) => {
    console.error(`Error reading word file: ${error}`);
  });
