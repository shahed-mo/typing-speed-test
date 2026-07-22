//===== Start Page =====//

const shadow = document.querySelector(".shadow");
const startBtn = document.querySelector(".shadow button");

const input = document.getElementById("typingInput");
const textContainer = document.getElementById("text");
const restartBtn = document.querySelector('.restart button');
const timeElement = document.querySelector('.time span');
const accuracyElement = document.querySelector(".accueracy span");
const wpmElement = document.querySelector(".WPM span");
const resultWpm = document.querySelector(".result .WPM span");
const resultAccuracy = document.querySelector(".result .accueracy span");
const resultCorrectChars = document.querySelector(".correct-char");
const resultWrongChars = document.querySelector(".wrong-char");
const header = document.querySelector("header nav");
const typingArea = document.querySelector(".typing-area");
const testComplete = document.querySelector(".testComplete");
const highscore = document.querySelector(".highScore");
const baseline = document.querySelector(".baseline");
const GoAgainBtns = document.querySelectorAll(".testComplete button");

let currentWpm = 0;
let time=60;
let timer=null;
let started=false;

function startTimer(){
    timer= setInterval(()=>{
        time--;
        timeElement.textContent = `0:${String(time).padStart(2,"0")}`;

        if(time<=0){
           finishTest();
        }

    },1000)
}


startBtn.addEventListener("click", () => {
    shadow.style.display = "none";
    input.focus();
});
//===== Show Text =====//

let text;

async function LoadText() {
    const res = await fetch("./data.json");
    text = await res.json();

    ShowText("easy");
}

LoadText();

function ShowText(level) {

    const list = text[level];
    const random = list[Math.floor(Math.random() * list.length)];

    textContainer.innerHTML = "";

    random.text.split("").forEach((letter) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.classList.add("pending");
        textContainer.appendChild(span);
    });

    const letters = textContainer.querySelectorAll("span");

    if (letters.length > 0) {
        letters[0].classList.remove("pending");
        letters[0].classList.add("current");
    }

    input.value = "";
    input.focus();
}

//===== Difficulty =====//

//===== Difficulty =====//

// Desktop buttons
const levelsBtns = document.querySelectorAll(".levels li");

// Mobile select
const difficultySelect = document.querySelector(".difficulty-select");


// Function to change difficulty
function changeDifficulty(level) {

    // Show new text
    ShowText(level);

    // Hide start shadow
    shadow.style.display = "none";

    // Focus input
    input.focus();

    // Desktop active button
    levelsBtns.forEach((btn) => {
        btn.classList.remove("active");

        if (btn.dataset.level === level) {
            btn.classList.add("active");
        }
    });

    // Mobile select
    if (difficultySelect) {
        difficultySelect.value = level;
    }
}


// Desktop difficulty buttons
levelsBtns.forEach((btn) => {

    btn.addEventListener("click", () => {

        const level = btn.dataset.level;

        changeDifficulty(level);

    });

});


// Mobile difficulty select
if (difficultySelect) {

    difficultySelect.addEventListener("change", (e) => {

        const level = e.target.value;

        changeDifficulty(level);

    });

}

//===== Typing =====//

input.addEventListener("input", () => {

    if(!started){
        started=true;
        startTimer();
    }

    const letters = textContainer.querySelectorAll("span");
    const value = input.value;
    let correct = 0;
    let mistakes = 0;

    letters.forEach((span, index) => {

        span.classList.remove(
            "correct",
            "wrong",
            "current",
            "pending"
        );

        if (index < value.length) {

            if (value[index] === span.textContent) {
                span.classList.add("correct");
                correct++;
            } else {
                span.classList.add("wrong");
                mistakes++;
            }

        } else {
            span.classList.add("pending");
        }

        if (index === value.length) {
            span.classList.remove("pending");
            span.classList.add("current");
        }

    });

   const total = correct + mistakes;
   const accuracy = total === 0? 100: Math.round((correct / total) * 100);
    accuracyElement.textContent = accuracy + "%";
    resultAccuracy.textContent= accuracy + "%";

    const minutesPassed = (60 - time) / 60;
   currentWpm = minutesPassed > 0
    ? Math.round((correct / 5) / minutesPassed)
    : 0;

wpmElement.textContent = currentWpm;
resultWpm.textContent = currentWpm;

    resultCorrectChars.textContent = correct;
    resultWrongChars.textContent = mistakes;
});

restartBtn.addEventListener('click',()=>{
    input.value="";
    const letters = textContainer.querySelectorAll('span')

    letters.forEach((span,index)=>{
        span.classList.remove("current","wrong","correct");
        span.classList.add("pending");

        if(index===0){
            span.classList.remove("pending");
            span.classList.add("current");

        }

    })
        input.focus();
        clearInterval(timer);
        started=false;
        time=60;
        timeElement.textContent = "1:00";
        input.disabled = false;

})

function finishTest() {

    clearInterval(timer);

    input.disabled = true;

    header.style.display = "none";
    typingArea.style.display = "none";

    let personalBest = localStorage.getItem("personalBest");

    // أول مرة
    if (personalBest === null) {

        localStorage.setItem("personalBest", currentWpm);

        baseline.style.display = "flex";
        return;
    }

    personalBest = Number(personalBest);

    // حقق رقم جديد
    if (currentWpm > personalBest) {

        localStorage.setItem("personalBest", currentWpm);

        highscore.style.display = "flex";
    }

    // نتيجة عادية
    else {

        testComplete.style.display = "flex";
    }

}


GoAgainBtns.forEach((btn) => {
    btn.addEventListener("click", () => {

        baseline.style.display = "none";
        highscore.style.display = "none";
        testComplete.style.display = "none";

        header.style.display = "block";
        typingArea.style.display = "block";

        shadow.style.display = "flex";

        clearInterval(timer);

        started = false;
        time = 60;

        timeElement.textContent = "1:00";

        input.disabled = false;

        ShowText("easy");
    });
});

