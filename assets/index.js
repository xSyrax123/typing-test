const INPUT_ELEMENT = document.getElementById("input");
const RESET_BUTTON = document.getElementById("reset-button");
const QUOTE_ELEMENT = document.getElementById("quote");
const TIMER_ELEMENT = document.getElementById("timer");
const RESULT_ELEMENT = document.getElementById("result");
const WPM_ELEMENT = document.getElementById("wpm");
const KEYSTROKES_ELEMENT = document.getElementById("keystrokes");
const ACCURACY_ELEMENT = document.getElementById("accuracy");
const CORRECT_WORDS_ELEMENT = document.getElementById("correct-words");
const WRONG_WORDS_ELEMENT = document.getElementById("wrong-words");

const TOTAL_TIME_MINUTES = 1;
const WORDS_COUNT = 5;
const TIMER_INTERVAL = 1000;
const INITIAL_TIMER_VALUE = 60;
const EMPTY_VALUE = "";
const WHITE_SPACE = " ";

let words;
let words_array;
let timerValue = INITIAL_TIMER_VALUE;
let timerInterval;
let quote;
let wordIndex = 0;
let correctWords = 0;
let wrongWords = 0;
let accuracy = 0;
let characterTyped = 0;
let correctKeys = 0;
let wpm = 0;

RESET_BUTTON.addEventListener("click", startGame);
INPUT_ELEMENT.addEventListener("input", handleInput);

function updateTimer() {
  /**
   * Updates the timer display with the remaining time.
   * If the timer reaches 0, the game is finished.
   */
  const MINUTES = Math.floor(timerValue / 60);
  const SECONDS = timerValue % 60;
  const FORMATTED_TIME = `${MINUTES.toString().padStart(
    2,
    "0"
  )}:${SECONDS.toString().padStart(2, "0")}`;

  if (timerValue === 0) {
    finishGame();
  }

  TIMER_ELEMENT.textContent = FORMATTED_TIME;
  timerValue--;
}

function startTimer() {
  /**
   * Starts the timer with the initial value.
   * Calls updateTimer() every TIMER_INTERVAL milliseconds.
   */
  timerValue = INITIAL_TIMER_VALUE;
  updateTimer();
  timerInterval = setInterval(updateTimer, TIMER_INTERVAL);
}

function startGame() {
  /**
   * Starts the game by resetting values and updating the quote.
   */
  resetValues();
  updateQuote();
}

function finishGame() {
  /**
   * Finishes the game by calculating the WPM, accuracy, and displaying the results.
   * Disables the input element and shows the result element.
   */
  clearInterval(timerInterval);

  wpm = Math.round(characterTyped / WORDS_COUNT / TOTAL_TIME_MINUTES);
  accuracy = (correctKeys / characterTyped) * 100;

  INPUT_ELEMENT.disabled = true;
  INPUT_ELEMENT.textContent = EMPTY_VALUE;
  QUOTE_ELEMENT.textContent = EMPTY_VALUE;
  RESULT_ELEMENT.style.visibility = "visible";
  WPM_ELEMENT.textContent = `${wpm} WPM`;
  KEYSTROKES_ELEMENT.textContent = characterTyped;
  ACCURACY_ELEMENT.textContent = `${accuracy.toFixed(2)}%`;
  CORRECT_WORDS_ELEMENT.textContent = correctWords;
  WRONG_WORDS_ELEMENT.textContent = wrongWords;
  CORRECT_WORDS_ELEMENT.style.color = "green";
  WRONG_WORDS_ELEMENT.style.color = "red";
}

function resetValues() {
  /**
   * Resets the game values and clears the timer interval.
   */
  clearInterval(timerInterval);
  timerValue = INITIAL_TIMER_VALUE;
  correctWordsCounter = 0;
  correctKeysCounter = 0;
  wrongWordsCounter = 0;
  accuracy = 0;
  characterTyped = 0;
  timerInterval = null;

  TIMER_ELEMENT.textContent = "01:00";
  INPUT_ELEMENT.disabled = false;
  RESULT_ELEMENT.style.visibility = "hidden";
}

function shuffleArray(array) {
  /**
   * Shuffles the elements of the given array and returns the shuffled array.
   * @param {Array} array - The array to shuffle.
   * @returns {Array} - The shuffled array.
   */
  const SHUFFLED_ARRAY = array.slice();

  for (let i = SHUFFLED_ARRAY.length - 1; i > 0; i--) {
    const J = Math.floor(Math.random() * (i + 1));
    [SHUFFLED_ARRAY[i], SHUFFLED_ARRAY[J]] = [
      SHUFFLED_ARRAY[J],
      SHUFFLED_ARRAY[i],
    ];
  }

  return SHUFFLED_ARRAY;
}

function getRandomWords(words, count) {
  /**
   * Retrieves a random selection of words from the given array.
   * @param {Array} words - The array of words.
   * @param {number} count - The number of words to select.
   * @returns {Array} - The randomly selected words.
   */
  const SHUFFLED_WORDS = shuffleArray(words);
  return SHUFFLED_WORDS.slice(0, count);
}

function markWord(index, isCorrectWord) {
  /**
   * Marks the word at the given index as correct or incorrect by modifying its styling.
   * @param {number} index - The index of the word to mark.
   * @param {boolean} isCorrectWord - Whether the word is correct or not.
   */
  const SPAN = QUOTE_ELEMENT.querySelectorAll("span")[index];
  SPAN.style.color = isCorrectWord ? "green" : "red";
  SPAN.style.backgroundColor = "transparent";
  SPAN.classList.toggle("correct", isCorrectWord);
}

function handleInput(event) {
  /**
   * Handles the input event when the user types in the input element.
   * Checks for correctness, updates counters, and progresses to the next word if needed.
   * Starts the timer if it hasn't been started yet.
   * @param {Event} event - The input event object.
   */
  const INPUT_VALUE = event.target.value;
  const CURRENT_WORD = quote[wordIndex];
  const SPANS = QUOTE_ELEMENT.querySelectorAll("span");
  const IS_CORRECT_CHAR = CURRENT_WORD.startsWith(INPUT_VALUE);

  if (IS_CORRECT_CHAR) {
    SPANS[wordIndex].style.backgroundColor = "lightgray";
    correctKeys++;
  } else {
    SPANS[wordIndex].style.backgroundColor = "red";
  }

  characterTyped++;

  if (INPUT_VALUE.endsWith(" ")) {
    const TYPED_WORD = INPUT_VALUE.trim();

    if (TYPED_WORD === CURRENT_WORD) {
      markWord(wordIndex, true);
      correctWords++;
    } else {
      markWord(wordIndex, false);
      wrongWordsCounter++;
    }

    wordIndex++;

    if (wordIndex === quote.length) {
      updateQuote();
      INPUT_ELEMENT.value = EMPTY_VALUE;
    } else {
      SPANS[wordIndex].style.backgroundColor = "lightgray";
      INPUT_ELEMENT.value = EMPTY_VALUE;
    }
  }

  if (!timerInterval) {
    startTimer();
  }
}

function updateQuote() {
  /**
   * Updates the quote element with a new random quote.
   * Clears the current quote and word index, and generates a new quote.
   */
  const FRAGMENT = document.createDocumentFragment();
  quote = getRandomWords(words_array, WORDS_COUNT);
  QUOTE_ELEMENT.textContent = EMPTY_VALUE;
  wordIndex = 0;

  for (const [INDEX, WORD] of quote.entries()) {
    const SPAN = document.createElement("span");
    SPAN.textContent = WORD;
    FRAGMENT.appendChild(SPAN);

    if (INDEX !== quote.length - 1) {
      FRAGMENT.appendChild(document.createTextNode(WHITE_SPACE));
    }
  }

  QUOTE_ELEMENT.appendChild(FRAGMENT);
}

fetch("./words.txt")
  .then((response) => response.text())
  .then((data) => {
    words = data;
    words_array = words.split(WHITE_SPACE);
    startGame();
  })
  .catch((error) => {
    console.error(`Error reading word file: ${error}`);
  });
