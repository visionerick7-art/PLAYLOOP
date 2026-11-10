
/* =========================================
   PLAYLOOP GAMING ENGINE
   Version 1.0
========================================= */

"use strict";

// APPLICATION STATE
const PLAYLOOP = {
  player: "Guest Player",
  score: 0,
  gamesPlayed: 0,
  currentGame: null
};

// TRIVIA QUESTIONS
const questions = [
  {
    question: "Which planet is known as the Red Planet?",
    answers: ["Earth", "Mars", "Venus", "Jupiter"],
    correct: 1
  },
  {
    question: "How many days are in a leap year?",
    answers: ["364", "365", "366", "367"],
    correct: 2
  },
  {
    question: "Which animal is the largest land mammal?",
    answers: ["Elephant", "Lion", "Giraffe", "Rhino"],
    correct: 0
  },
  {
    question: "What is the capital city of Kenya?",
    answers: ["Embu", "Mombasa", "Nairobi", "Kisumu"],
    correct: 2
  },
  {
    question: "Which gas do plants absorb?",
    answers: ["Oxygen", "Carbon dioxide", "Hydrogen", "Nitrogen"],
    correct: 1
  }
];

// ELEMENT REFERENCES
const profileButton = document.getElementById("profileButton");
const gameButtons = document.querySelectorAll("[data-game]");

// UPDATE PLAYER PROFILE
function updateProfile() {
  profileButton.textContent =
    `${PLAYLOOP.player} | ${PLAYLOOP.score} pts`;
}

// OPEN GAME WINDOW
function openGame(title, content) {
  closeGame();

  const modal = document.createElement("div");
  modal.id = "gameModal";
  modal.className = "game-modal";

  modal.innerHTML = `
    <div class="game-window">
      <button class="close-game" id="closeGame">✕</button>
      <p class="eyebrow">PLAYLOOP GAME ARENA</p>
      <h2>${title}</h2>
      <div id="gameContent">${content}</div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("closeGame")
    .addEventListener("click", closeGame);
}

// CLOSE GAME WINDOW
function closeGame() {
  const modal = document.getElementById("gameModal");

  if (modal) {
    modal.remove();
  }

  PLAYLOOP.currentGame = null;
}

// TRIVIA GAME
function startTrivia() {
  PLAYLOOP.currentGame = "trivia";

  let questionIndex = 0;
  let correctAnswers = 0;

  showQuestion();

  function showQuestion() {
    if (questionIndex >= questions.length) {
      finishTrivia();
      return;
    }

    const question = questions[questionIndex];

    const answersHTML = question.answers.map((answer, index) => `
      <button class="answer-option" data-answer="${index}">
        ${answer}
      </button>
    `).join("");

    const content = document.getElementById("gameContent");

    content.innerHTML = `
      <p class="game-progress">
        QUESTION ${questionIndex + 1} OF ${questions.length}
      </p>

      <h3>${question.question}</h3>

      <div class="answer-list">
        ${answersHTML}
      </div>

      <p id="answerFeedback" aria-live="polite"></p>
    `;

    content.querySelectorAll("[data-answer]")
      .forEach(button => {
        button.addEventListener("click", () => {
          const selected = Number(button.dataset.answer);
          const feedback = document.getElementById("answerFeedback");

          content.querySelectorAll("[data-answer]")
            .forEach(item => item.disabled = true);

          if (selected === question.correct) {
            correctAnswers++;
            feedback.textContent = "Correct! +10 points 🎉";
            feedback.className = "correct-feedback";
          } else {
            feedback.textContent =
              "Not quite! The correct answer is " +
              question.answers[question.correct];
            feedback.className = "wrong-feedback";
          }

          const nextButton = document.createElement("button");
          nextButton.className = "primary-button next-question";
          nextButton.textContent =
            questionIndex === questions.length - 1
              ? "See Results"
              : "Next Question →";

          content.appendChild(nextButton);

          nextButton.addEventListener("click", () => {
            questionIndex++;
            showQuestion();
          });
        });
      });
  }

  function finishTrivia() {
    const earned = correctAnswers * 10;

    PLAYLOOP.score += earned;
    PLAYLOOP.gamesPlayed++;
    updateProfile();

    document.getElementById("gameContent").innerHTML = `
      <div class="game-results">
        <div class="result-icon">🏆</div>
        <h3>Challenge Completed!</h3>
        <p>You answered ${correctAnswers} out of ${questions.length} correctly.</p>
        <h2>+${earned} POINTS</h2>
        <p>Total player score: ${PLAYLOOP.score}</p>
        <button class="primary-button" id="playAgain">
          Play Again
        </button>
      </div>
    `;

    document.getElementById("playAgain")
      .addEventListener("click", startTrivia);
  }
}

// PUZZLE GAME
function startPuzzle() {
  PLAYLOOP.currentGame = "puzzle";

  const puzzleAnswer = "ECOLOGY";

  openGame("Word Puzzle", `
    <p class="game-progress">BRAIN POWER CHALLENGE</p>
    <h3>Unscramble this word:</h3>
    <div class="puzzle-word">G O L E C O Y</div>
    <input id="puzzleInput" type="text"
      placeholder="Enter your answer"
      autocomplete="off">
    <button class="primary-button" id="checkPuzzle">
      Submit Answer
    </button>
    <p id="puzzleFeedback" aria-live="polite"></p>
  `);

  document.getElementById("checkPuzzle")
    .addEventListener("click", () => {
      const input = document.getElementById("puzzleInput");
      const feedback = document.getElementById("puzzleFeedback");

      if (input.value.trim().toUpperCase() === puzzleAnswer) {
        feedback.textContent = "Correct! +20 points 🎉";

        PLAYLOOP.score += 20;
        PLAYLOOP.gamesPlayed++;
        updateProfile();

        document.getElementById("checkPuzzle").disabled = true;
      } else {
        feedback.textContent = "Try again! Think carefully.";
      }
    });
}

// SPEED CHALLENGE
function startSpeed() {
  openGame("Speed Challenge", `
    <p>Click the button as many times as possible in 5 seconds!</p>
    <h2 id="speedCount">0</h2>
    <button class="primary-button" id="speedStart">
      START CHALLENGE
    </button>
    <p id="speedTimer"></p>
    <p id="speedFeedback" aria-live="polite"></p>
  `);

  let clicks = 0;
  let active = false;

  const startButton = document.getElementById("speedStart");
  const counter = document.getElementById("speedCount");
  const timerDisplay = document.getElementById("speedTimer");
  const feedback = document.getElementById("speedFeedback");

  startButton.addEventListener("click", () => {
    if (active) {
      clicks++;
      counter.textContent = clicks;
      return;
    }

    active = true;
    startButton.textContent = "CLICK FAST!";
    clicks = 1;
    counter.textContent = clicks;

    let remaining = 5;
    timerDisplay.textContent = remaining + " seconds remaining";

    const interval = setInterval(() => {
      remaining--;
      timerDisplay.textContent =
        remaining + " seconds remaining";

      if (remaining <= 0) {
        clearInterval(interval);
        active = false;
        startButton.disabled = true;

        const earned = clicks * 2;

        PLAYLOOP.score += earned;
        PLAYLOOP.gamesPlayed++;
        updateProfile();

        feedback.textContent =
          `Time's up! You scored ${clicks} clicks and earned ${earned} points!`;
      }
    }, 1000);
  });
}

// GAME NAVIGATION
gameButtons.forEach(button => {
  button.addEventListener("click", () => {
    const game = button.dataset.game;

    if (game === "trivia") {
      openGame("Trivia Challenge", "");
      startTrivia();
    }

    if (game === "puzzle") {
      startPuzzle();
    }

    if (game === "speed") {
      startSpeed();
    }
  });
});

// PROFILE INTERACTION
profileButton.addEventListener("click", () => {
  const name = prompt("Enter your player name:");

  if (name && name.trim()) {
    PLAYLOOP.player = name.trim().slice(0, 24);
    updateProfile();
  }
});

// INITIALIZE APPLICATION
updateProfile();

console.log("PLAYLOOP Gaming Engine initialized successfully!");
