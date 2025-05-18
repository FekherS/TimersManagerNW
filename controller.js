import { Timer } from "./timer.js";
import * as ui from "./ui.js";


const magicValues = {
    loopSettingFlagSet: true,
    loopSettingFlagUnset: false,
    loopFlagSet: true,
    loopFlagUnset: false,
    countdownSet: true,
    countdownUnset: false,
    alertTimeout: 3000,
    updateDisplayTimeout: 1000,
    pauseUnset: false,
    pauseSet: true
};
const appState = {
    timersList: [],
    ord: -1,
    loopSettingFlag: magicValues.loopSettingFlagUnset,
    loopFlag: magicValues.loopFlagUnset,
    loop: 0,
    countdown: magicValues.countdownUnset,
    nextFireAt: null,
    intervalDisplay: null,
    pause: magicValues.pauseUnset
};

ui.uiElements.addB.addEventListener("click", () => {
    if (appState.countdown === magicValues.countdownUnset) {
        ui.addTimer(appState.timersList.length);
        appState.timersList.push(new Timer());
        appState.timersList[appState.timersList.length - 1].setOnTimerEnd(() => {
            beep(1000, 440, 4);
            countdownBegin();
        })
    }
});

function removeTimer() {
    if (appState.countdown === magicValues.countdownUnset && appState.timersList.length) {
        if (appState.loopFlag === magicValues.loopFlagSet && appState.timersList.length - 1 === appState.loop) {
            appState.loopFlag = magicValues.loopFlagUnset;
            ui.appendAlert("Loop Cleared", "warning", magicValues.alertTimeout);
            ui.unsetLoopIndicator(appState.loop);
        }
        ui.removeTimer();
        appState.timersList[appState.timersList.length - 1] = null;
        appState.timersList.pop();
    }
}
ui.uiElements.removeB.addEventListener("click", removeTimer);

ui.uiElements.timersDiv.addEventListener("change", (e) => {
    if (e.target.type === "time") {
        let index = Number(e.target.name.replace("timer", ""));
        appState.timersList[index].updateTimerFromString(e.target.value);
    }
})

//function to set the loop value, needed in the event listener just below
function setLoopValue(e) {
    if (e.target.type === "time") {
        let index = Number(e.target.name.replace("timer", ""));
        appState.loop = index;
        ui.appendAlert("Loop set", "primary", magicValues.alertTimeout);
        ui.uiElements.timersDiv.removeEventListener("click", setLoopValue);
        appState.loopSettingFlag = magicValues.loopSettingFlagUnset;
        appState.loopFlag = magicValues.loopFlagSet;
        ui.setLoopIndicator(appState.loop);
    }
}
ui.uiElements.loopB.addEventListener("click", () => {
    //if there are timers and the countdown is off
    if (appState.countdown === magicValues.countdownUnset && appState.timersList.length) {
        //if loop is set, clear it;
        if (appState.loopFlag === magicValues.loopFlagSet) {
            appState.loopFlag = magicValues.loopFlagUnset;
            ui.appendAlert("Loop Cleared", "primary", magicValues.alertTimeout);
            ui.unsetLoopIndicator(appState.loop);
        }
        // if loop is unset and loop setting flag is unset (first time clicking the loopB) raise the setting flag and add event listener
        else if (appState.loopSettingFlag === magicValues.loopSettingFlagUnset) {
            appState.loopSettingFlag = magicValues.loopSettingFlagSet;
            ui.appendAlert("Loop selection on, choose timer", "primary", magicValues.alertTimeout);
            ui.uiElements.timersDiv.addEventListener("click", setLoopValue);
        }
        // if loop is unset and loop setting flag is set (second time clicking the loopB) lower the setting flag and remove event listener
        else {
            appState.loopSettingFlag = magicValues.loopSettingFlagUnset;
            ui.appendAlert("Loop selection canceled", "secondary", magicValues.alertTimeout);
            ui.uiElements.timersDiv.removeEventListener("click", setLoopValue);
        }
    }
})

ui.uiElements.startB.addEventListener("click", () => {
    //disable inputs, set countdown to true and call countdownBegin();
    if (appState.countdown === magicValues.countdownSet) {
        ui.appendAlert("Timers already started", "warning", magicValues.alertTimeout);
        return;
    }
    if (appState.timersList.length ) {   
        if (appState.timersList.reduce((acc, val) => acc && val.timeInSeconds, true)) {
            appState.countdown = magicValues.countdownSet;
            for (const child of ui.uiElements.timersDiv.children) {
                child.disabled = true;
            }
            countdownBegin();
        }
        else ui.appendAlert("a zero timer or an unset timer exist", "warning", magicValues.alertTimeout);
    } else ui.appendAlert("Add timers", "warning", magicValues.alertTimeout);
})

function countdownBegin() {
    if (appState.intervalDisplay) {
        clearInterval(appState.intervalDisplay);
        appState.intervalDisplay = null;
    }
    if (appState.ord >= 0) {
        ui.unsetTimerIndicator(appState.ord)
    }
    ++appState.ord;
    if (appState.ord === appState.timersList.length && appState.loopFlag === magicValues.loopFlagSet) {
        appState.ord = appState.loop;
    }
    if (appState.ord < appState.timersList.length) {
        ui.setTimerIndicator(appState.ord);
        appState.nextFireAt = appState.timersList[appState.ord].startTimer();
        let time = appState.nextFireAt - Date.now();
        time = time - (time % 1000);
        time = time / 1000;
        ui.updateCurrTimer(secondsToString(time));
        appState.intervalDisplay = setInterval(() => {
            let time = appState.nextFireAt - Date.now();
            if (time > 0) {
                time = time - (time % 1000);
                time = time / 1000;
                ui.updateCurrTimer(secondsToString(time));
            }
        },magicValues.updateDisplayTimeout)
    } else {
        countdownStop();
    }
}

function countdownStop(){
    appState.timersList[appState.ord].stopTimer();
    ui.unsetTimerIndicator(appState.ord);
    if (appState.intervalDisplay) {
      clearInterval(appState.intervalDisplay);
      appState.intervalDisplay = null;
    }
    appState.ord = -1;
    appState.countdown = magicValues.countdownUnset;
    for (const child of ui.uiElements.timersDiv.children) {
      child.disabled = false;
    }
    ui.updateCurrTimer("");
}
ui.uiElements.stopB.addEventListener("click", countdownStop);

ui.uiElements.pauseB.addEventListener("click", () => {
    if (appState.countdown === magicValues.countdownUnset) return;
    appState.nextFireAt = appState.timersList[appState.ord].pauseTimer();
})

ui.uiElements.saveB.addEventListener("click", () => {
    localStorage.setItem(
      "timersList",
      JSON.stringify(appState.timersList.map((timer) => timer.timeInSeconds))
    );
    ui.appendAlert("Config saved", "success", magicValues.alertTimeout);
    localStorage.setItem("loopFlag", appState.loopFlag);
    localStorage.setItem("loop", appState.loop);
})
ui.uiElements.loadB.addEventListener("click", () => {
    if (appState.countdown === magicValues.countdownSet) {
        ui.appendAlert("Stop countdown before loading", "warning", magicValues.alertTimeout);
        return;
    }
    const savedTimers = JSON.parse(localStorage.getItem("timersList") || "[]");
    appState.loopFlag = magicValues.loopFlagUnset;
    while (appState.timersList.length) {
        removeTimer();        
    }
    savedTimers.forEach((time, index) => {
        ui.addTimer(index);
        ui.updateTimer(index, secondsToString(time));
        const timer = Timer.timerFromString(secondsToString(time));
        appState.timersList.push(timer);
        appState.timersList[appState.timersList.length - 1].setOnTimerEnd(
          () => {
            beep(1000, 440, 4);
            countdownBegin();
          }
        );
    });
    const localLoopFlag = localStorage.getItem("loopFlag");
    const localLoop = localStorage.getItem("loop");
    if (localLoopFlag && localLoopFlag.trim() !== "") {
        if (localLoopFlag === "true") {
            appState.loopFlag = magicValues.loopFlagSet;
            appState.loop = Number(localLoop);
            ui.setLoopIndicator(appState.loop);
        }
    }
})

//util
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

function secondsToString(x) {
    let s = x % 60;
    x = (x - s) / 60;
    let m = x % 60;
    x = (x - m) / 60;
    let out = "";
    if (x <= 9) out = out + '0' + x + ':';
    else out = out + x + ':';
    if (m <= 9) out = out + "0" + m + ":";
    else out = out + m + ":";
    if (s <= 9) out = out + "0" + s;
    else out = out + s;
    return out;
}