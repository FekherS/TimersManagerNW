export class Timer {
    constructor(h = 0, m = 0, s = 0) {
        this.hours = h;
        this.minutes = m;
        this.seconds = s;
        this.fireAt = null;
        this.timeLeft = null;
        this.callback = null;
        this.started = false;
        this.onTimerEnd = null;
    }
    get timeInSeconds() {
        return this.hours * 3600 + this.minutes * 60 + this.seconds;
    }
    get timeInMilliSeconds() {
        return this.timeInSeconds * 1000;
    }
    setOnTimerEnd(callback) {
        this.onTimerEnd = callback;
    }

    //"hh:mm:ss";
    static timerFromString(s) {
        let args = s.split(":").map((x) => Number(x));
        while (args.length < 3) args.unshift(0);
        return new Timer(...args);
    }

    updateTimer(h, m, s) {
        this.hours = h;
        this.minutes = m;
        this.seconds = s;
    }

    updateTimerFromString(s) {
        let args = s.split(":").map((x) => Number(x));

        if (args.length < 3) args=[0,0,0];
        this.updateTimer(...args);
    }

    startTimer() {
        if (this.fireAt) {
        console.error("Error: a timer is started again before ending. \n");
        return this.fireAt;
        }
        this.started = true;
        this.fireAt = new Date(Date.now() + this.timeInMilliSeconds);
        this.callback = setTimeout(() => {
            // beep(1000, 440, 4);
            this.fireAt = null;
            if (this.onTimerEnd) this.onTimerEnd();
            this.stopTimer();
            }, this.timeInMilliSeconds);
        return this.fireAt;
    }

    pauseTimer() {
        if (this.started) {
            if (this.fireAt) {
                this.timeLeft = this.fireAt.getTime() - Date.now();
                clearTimeout(this.callback);
                this.fireAt = null;
                this.callback = null;
            } else {
                this.fireAt = new Date(Date.now() + this.timeLeft);
                this.callback = setTimeout(() => {
                    if (this.onTimerEnd) this.onTimerEnd();
                    this.stopTimer();
                    this.fireAt = null;
                    }, this.timeLeft);
            }
            }
        return this.fireAt;
    }
    stopTimer() {
        if (this.started) {
        this.started = false;
        this.fireAt = null;
        this.timeLeft = null;
        clearTimeout(this.callback);
        this.callback = null;
        }
    }
}