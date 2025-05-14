let timers = [
  [0, 25, 0],
  [0, 5, 0],
];
let timersDiv = document.getElementById("timers");
timersDiv.children[0].value = "00:25:00";
timersDiv.children[1].value = "00:05:00";
let ord = 0;
let loopFlag = 0;
let loop = -1;
let countdown = 0;
let currTimer = document.getElementById("currTimer");
let interval = null;
timersDiv.addEventListener("change", function (e) {
  // console.dir(e);
  if (e.target.type === "time") {
    update(e.target);
  }
});

//buttons;
//addB
let addB = document.getElementById("addB");
addB.addEventListener("click", addTimer);

//removeB
let removeB = document.getElementById("removeB");
removeB.addEventListener("click", removeTimer);

//loopB
timersDiv.addEventListener("click", function (e) {
  if (loopFlag && e.target.type === "time") {
    loop = Number(e.target.name.replace("timer", ""));
    loopFlag = 0;
    document.getElementById("timer" + loop).classList.toggle("text-bg-info");
  }
});
let loopB = document.getElementById("loopB");
loopB.addEventListener("click", () => {
  if (countdown) return;
  if (loop === -1) {
    appendAlert("Loop set, select the timer to loop back for", "primary");
    loopFlag = 1;
  }
  else {
    appendAlert("Loop cleared", "primary");
    document.getElementById("timer" + loop).classList.toggle("text-bg-info");
    loop = -1;
  }
});

//startB
let startB = document.getElementById("startB");
startB.addEventListener("click", startTimers);

//stopB
let stopB = document.getElementById("stopB");
stopB.addEventListener("click", stopTimers);

//pauseB
let pauseB = document.getElementById("pauseB");
pauseB.addEventListener("click", pauseTimers);

//alerts;
const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
const appendAlert = (message, type) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");
  alertPlaceholder.append(wrapper);
  setTimeout(() => {
    if (alertPlaceholder.children.length) {
      if (alertPlaceholder.children[0].innerHTML === wrapper.innerHTML) alertPlaceholder.children[0].remove();
    }    
  },3000)
};
function update(elem) {
  let index = Number(elem.name.replace("timer", ""));
  let [h, m, s] = elem.value.split(':').map(Number);
  s = s ?? 0;
  timers[index] = [h, m, s];
  // console.log(timers[index]);
}

function addTimer() {
  if (!countdown) { 
    let timer = document.createElement("input");
    timer.classList = "form-control w-25 text-center";
    timer.type = "time";
    timer.name = "timer" + timers.length;
    timer.id = timer.name;
    timer.step = "1";
    timer.value = "00:00:00";
    timersDiv.appendChild(timer);
    timers.push([0, 0, 0]);
  }
}
function removeTimer() {
  if (!countdown) { 
    if (!timers.length) {
      appendAlert("No timer to remove!", "warning");
      return;
    }
    if (timers.length - 1 === loop) {
      appendAlert("loop cleared", "info");
      loop = -1;
    }
    let elem = timersDiv.children[timers.length - 1];
    elem.parentNode.removeChild(elem);
    timers.pop();
  }
}
function startTimers() {

  countdown = 1;
  for (let element of timersDiv.children) {
    element.disabled = true;
  }
  //check time 
  let consoleLoggerHelper = [...timers[ord]];
  let offsetSeconds = consoleLoggerHelper[0] * 3600 + consoleLoggerHelper[1] * 60 + consoleLoggerHelper[2];
  const now = new Date()
  console.log(now);
  console.log(new Date(now.getTime() + offsetSeconds * 1000));

  if (ord < timers.length && ord !== loop)
    document.getElementById("timer" + ord).classList.toggle("text-bg-success");
  if (ord < timers.length) {
    let x = [...timers[ord]];
    let s = arrToString(x);
    currTimer.value = s;
    interval = setInterval(() => {
      console.log(arrToString(x));
      console.log(new Date());
      if (x[2]) {
        --x[2];
        s = arrToString(x);
        currTimer.value = s;
      } else if (x[1]) {
        --x[1];
        x[2] = 59;
        s = arrToString(x);
        currTimer.value = s;
      } else if (x[0]) {
        --x[0];
        x[1] = 59;
        x[2] = 59;
        s = arrToString(x);
        currTimer.value = s;
      } else {
        beep(1000, 440, 4);
        document
          .getElementById("timer" + ord)
          .classList.toggle("text-bg-success");
        ++ord;
        if (ord === timers.length && loop !== -1) ord = loop;
        clearInterval(interval);
        startTimers();
      }
    }, 1000);
  }
}
function stopTimers() {
  if (ord !== loop) document.getElementById("timer" + ord).classList.toggle("text-bg-success");
  clearInterval(interval);
  interval = null;
  countdown = 0;
  for (let element of timersDiv.children) {
    element.disabled = false;
  }
  currTimer.value = "";
  ord = 0;
}

function pauseTimers() {
  if (interval) {
      clearInterval(interval);
      interval = null;
  } else {
    let [h, m, s] = currTimer.value.split(":").map(Number);
    s = s ?? 0;
    let x = [h, m, s];
    s = arrToString(x);
    currTimer.value = s;
    interval = setInterval(() => {
      if (x[2]) {
        --x[2];
        s = arrToString(x);
        currTimer.value = s;
      } else if (x[1]) {
        --x[1];
        x[2] = 59;
        s = arrToString(x);
        currTimer.value = s;
      } else if (x[0]) {
        --x[0];
        x[1] = 59;
        x[2] = 59;
        s = arrToString(x);
        currTimer.value = s;
      } else {
        beep(1000, 440, 4);
        ++ord;
        if (ord === timers.length && loop !== -1) ord = loop;
        clearInterval(interval);
        startTimers();
      }
    }, 1000);
  }
}

//utile
function arrToString(arr) {
  let s = "";
  if (arr[0] <= 9) s += "0" + arr[0] + ":";
  else s += arr[0] + ":";
  if (arr[1] <= 9) s += "0" + arr[1] + ":";
  else s += arr[1] + ":";
  if (arr[2] <= 9) s += "0" + arr[2];
  else s += arr[2];
  return s;
}
function beep(duration = 200, frequency = 440, volume = 1, type = "sine") {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.frequency.value = frequency; // Hz
  oscillator.type = type; // sine, square, triangle, sawtooth
  gain.gain.value = volume;

  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, duration);
}
