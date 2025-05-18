const form = document.getElementById("quizForm");
const quizContainer = document.getElementById("quiz-container");
const questionEl = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const nextBtn = document.getElementById("next");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

form.addEventListener("submit", e => {
  e.preventDefault();

  const amount = form.amount.value;
  const category = form.category.value;
  const difficulty = form.difficulty.value;

  let apiUrl = `https://opentdb.com/api.php?amount=${amount}`;

  if (category) apiUrl += `&category=${category}`;
  if (difficulty) apiUrl += `&difficulty=${difficulty}`;
  apiUrl += '&type=multiple';

  fetchQuiz(apiUrl);
});

async function fetchQuiz(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.response_code !== 0 || !data.results.length) {
      alert("No questions found for this selection. Try different options.");
      return;
    }

    questions = data.results;
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;

    form.style.display = "none";
    quizContainer.style.display = "block";

    showQuestion();
  } catch (error) {
    alert("Failed to load quiz. Please try again later.");
    console.error(error);
  }
}

function showQuestion() {
  selectedAnswer = null;
  nextBtn.disabled = true;

  const currentQ = questions[currentQuestionIndex];
  questionEl.innerHTML = decodeHTML(currentQ.question);

  let answers = [...currentQ.incorrect_answers];
  answers.push(currentQ.correct_answer);
  shuffleArray(answers);

  optionsContainer.innerHTML = "";

  answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.innerHTML = decodeHTML(answer);
    btn.classList.add("option-button");
    btn.addEventListener("click", () => selectAnswer(btn, answer, currentQ.correct_answer));
    optionsContainer.appendChild(btn);
  });

  if (currentQuestionIndex == questions.length - 1) {
    nextBtn.innerText = "Submit"
  }

}

function selectAnswer(button, answer, correctAnswer) {
  if (selectedAnswer) return;

  selectedAnswer = answer;
  nextBtn.disabled = false;

  button.classList.add("selected");

  Array.from(optionsContainer.children).forEach(btn => {
    btn.disabled = true;
    if (btn.innerHTML === decodeHTML(correctAnswer)) {
      btn.classList.add("correct");
    } else if (btn !== button) {
      btn.classList.add("incorrect");
    }

  });

  if (answer === correctAnswer) score++;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  document.querySelector('form').style.display = 'none';
  document.querySelector('h4').style.display = 'none';

  quizContainer.style.display = 'block';
});


nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
});

function showScore() {
  questionEl.textContent = `🎉 Quiz Completed! Your score: ${score} / ${questions.length}`;
  questionEl.style.textAlign = "center";
  questionEl.style.fontSize = "1.8rem";
  questionEl.style.color = "#00e6e6";
  optionsContainer.innerHTML = "";
  nextBtn.style.display = "none";

  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Restart Quiz";
  restartBtn.style.marginTop = "20px";
  restartBtn.style.padding = "12px 30px";
  restartBtn.style.fontSize = "18px";
  restartBtn.style.cursor = "pointer";
  restartBtn.style.background = "linear-gradient(135deg, #00e6e6, #007bff)";
  restartBtn.style.color = "#fff";
  restartBtn.style.border = "none";
  restartBtn.style.borderRadius = "30px";
  restartBtn.style.boxShadow = "0 6px 12px rgba(0, 230, 230, 0.3)";
  restartBtn.style.transition = "transform 0.2s, box-shadow 0.2s";
  restartBtn.onmouseover = () => {
    restartBtn.style.transform = "translateY(-2px)";
    restartBtn.style.boxShadow = "0 8px 16px rgba(0, 230, 230, 0.5)";
  };
  restartBtn.onmouseout = () => {
    restartBtn.style.transform = "translateY(0)";
    restartBtn.style.boxShadow = "0 6px 12px rgba(0, 230, 230, 0.3)";
  };
  restartBtn.addEventListener("click", () => {
    form.style.display = "block";
    quizContainer.style.display = "none";
    nextBtn.style.display = "inline-block";
    nextBtn.innerText = "Next"
    form.reset();
  });
  optionsContainer.appendChild(restartBtn);

  const leaveBtn = document.createElement("button");
  leaveBtn.textContent = "Leave Quiz";
  leaveBtn.style.marginTop = "15px";
  leaveBtn.style.padding = "12px 30px";
  leaveBtn.style.fontSize = "18px";
  leaveBtn.style.cursor = "pointer";
  leaveBtn.style.background = "linear-gradient(135deg, #dc3545, #a71d2a)";
  leaveBtn.style.color = "#fff";
  leaveBtn.style.border = "none";
  leaveBtn.style.borderRadius = "30px";
  leaveBtn.style.boxShadow = "0 6px 12px rgba(220, 53, 69, 0.4)";
  leaveBtn.style.transition = "transform 0.2s, box-shadow 0.2s";
  leaveBtn.onmouseover = () => {
    leaveBtn.style.transform = "translateY(-2px)";
    leaveBtn.style.boxShadow = "0 8px 16px rgba(220, 53, 69, 0.6)";
  };
  leaveBtn.onmouseout = () => {
    leaveBtn.style.transform = "translateY(0)";
    leaveBtn.style.boxShadow = "0 6px 12px rgba(220, 53, 69, 0.4)";
  };
  leaveBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
  optionsContainer.appendChild(leaveBtn);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
