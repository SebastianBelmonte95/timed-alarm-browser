// Credit: Mateusz Rybczonec

const FULL_DASH_ARRAY = 283;
let timeLimit = 0;
const set_button = document.getElementById("set");
const start_button = document.getElementById("start");
const play_button = document.getElementById("play");
const pause_button = document.getElementById("pause");
const reset_button = document.getElementById("reset");
const hourInput = document.getElementById("hour-input");
const minuteInput = document.getElementById("minutes-input");
const SecondInput = document.getElementById("seconds-input");
const audio = new Audio("res/alarm.wav");
let timePassed = 0;
let timeLeft = timeLimit;
let timerInterval = null;
let isPaused = true;
let warningThreshold = timeLimit * 0.2;
let alertThreshold = timeLimit * 0.1;
let colorCodes = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: warningThreshold
    },
    alert: {
        color: "red",
        threshold: alertThreshold
    }
};
let remainingPathColor = colorCodes.info.color;

document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

start_button.addEventListener("click", () => {
    timeLimit = 3600 * parseInt(document.getElementById("hour-input").value) + 60 * parseInt(document.getElementById("minutes-input").value) + parseInt(document.getElementById("seconds-input").value);
    console.log(timeLimit)
    isPaused = false;
    timeLeft = timeLimit;
    timePassed = 0;
    console.log(timeLimit)
    clearInterval(timerInterval);
    startTimer();
})
set_button.addEventListener("click", () => {
    timeLimit = 3600 * parseInt(document.getElementById("hour-input").value) + 60 * parseInt(document.getElementById("minutes-input").value) + parseInt(document.getElementById("seconds-input").value);
    warningThreshold = timeLimit * 0.2;
    alertThreshold = timeLimit * 0.1;
    colorCodes = {
        info: {
            color: "green"
        },
        warning: {
            color: "orange",
            threshold: warningThreshold
        },
        alert: {
            color: "red",
            threshold: alertThreshold
        }
    };
    isPaused = true;
    timeLeft = timeLimit;
    timePassed = 0;
    console.log(timeLimit)
    clearInterval(timerInterval);
    startTimer();
})
play_button.addEventListener("click", () => {
    isPaused = false;
});
pause_button.addEventListener("click", () => {
    isPaused = true;
});
reset_button.addEventListener("click", () => {
    isPaused = true;
    timeLeft = timeLimit;
    timePassed = 0;
    clearInterval(timerInterval)
    startTimer();

});


function onTimesUp() {
    clearInterval(timerInterval);
}

function runTimer() {
    if (!isPaused) {
        timePassed = timePassed += 1;
        timeLeft = timeLimit - timePassed;
        setCircleDasharray();
        setRemainingPathColor(timeLeft);
        if (timeLeft % 3600 == 0) {
            playAlarm()
        }
        if (timeLeft === 0) {
            onTimesUp();
        }
    }
    document.getElementById("base-timer-label").innerHTML = formatTime(
        timeLeft
    );
}

function startTimer() {
    timerInterval = window.setInterval(runTimer, 1000);
}

function formatTime(time) {
    let hours = Math.floor(time / 3600)
    let minutes = Math.floor((time - (hours * 3600)) / 60);
    let seconds = time - (hours * 3600) - (minutes * 60);

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    if (hours < 10) {
        hours = `0${hours}`;
    }

    return `${hours}:${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = colorCodes;
    if (timeLeft <= alert.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(warning.color);
    }
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / timeLimit;
    return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}

function playAlarm() {
    audio.play();
}