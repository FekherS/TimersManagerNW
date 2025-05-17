export const uiElements = {
  timersDiv: document.getElementById("timers"),
  currTimer: document.getElementById("currTimer"),
  addB: document.getElementById("addB"),
  removeB: document.getElementById("removeB"),
  loopB: document.getElementById("loopB"),
  startB: document.getElementById("startB"),
  stopB: document.getElementById("stopB"),
  pauseB: document.getElementById("pauseB"),
  alertPlaceholder: document.getElementById("liveAlertPlaceholder"),
  saveB: document.getElementById("saveB"),
  loadB: document.getElementById("loadB")
};


export function addTimer(ord){
    let timer = document.createElement("input");
    timer.classList = "form-control w-25 text-center";
    timer.type = "time";
    timer.name = "timer" + ord;
    timer.id = timer.name;
    timer.step = "1";
    timer.value = "00:00:00";
    uiElements.timersDiv.appendChild(timer);
}
export function updateTimer(ord, val) {
  uiElements.timersDiv.children[ord].value = val; 
}


export function removeTimer() {
    uiElements.timersDiv.removeChild(uiElements.timersDiv.lastElementChild);
}

export function appendAlert(message, type, time){
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");
  uiElements.alertPlaceholder.append(wrapper);
  setTimeout(() => {
    if (wrapper.isConnected) {
      wrapper.remove();
    }
  }, time);
};

export function updateCurrTimer(s) {
    uiElements.currTimer.value = s;
}

export function setTimerIndicator(x) {
    document.getElementById("timer" + x).classList.add("text-bg-success");
}
export function unsetTimerIndicator(x) {
  document.getElementById("timer" + x).classList.remove("text-bg-success");
}

export function setLoopIndicator(x) {
  document.getElementById("timer" + x).classList.add("text-bg-info");
}
export function unsetLoopIndicator(x) {
  document.getElementById("timer" + x).classList.remove("text-bg-info");
}