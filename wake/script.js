class Duration {
    constructor(miliseconds = 0, seconds = 0, minutes = 0, hours = 0) {
        this.totalMiliseconds = miliseconds + 1000 * (seconds + 60 * (minutes + 60 * hours));
    }
    get totalSeconds() {
        return this.totalMiliseconds / 1000;
    }

    get totalMinutes() {
        return this.totalSeconds / 60;
    }

    get totalHours() {
        return this.totalMinutes / 60;
    }

    get milisecond() {
        return Math.abs(this.totalMiliseconds % 1000);
    }

    get second() {
        return Math.floor(Math.abs(this.totalSeconds) % 60);
    }

    get minute() {
        return Math.floor(Math.abs(this.totalMinutes) % 60);
    }

    get hour() {
        return Math.floor(Math.abs(this.totalHours));
    }

    get negative() {
        return this.totalMiliseconds < 0;
    }

    get contrast() {
        return new Duration(-this.totalMiliseconds);
    }

    add(that = new Duration()) {
        return new Duration(this.totalMiliseconds + that.totalMiliseconds);
    }

    minus(that = new Duration()) {
        return new Duration(this.totalMiliseconds - that.totalMiliseconds);
    }

    getRatio(that = new Duration()) {
        return this.totalMiliseconds / that.totalMiliseconds;
    }

}


const DAY_DURATION = new Duration(0, 0, 0, 24);

class Clock {
    constructor(hour = 0, minute = 0, second = 0, milisecond = 0) {
        var totalMiliseconds = milisecond + 1000 * (second + 60 * (minute + 60 * hour));
        const moment = totalMiliseconds % DAY_DURATION.totalMiliseconds;
        this.moment = moment > 0 ? moment : DAY_DURATION.totalMiliseconds + moment;
    }

    differentFrom(that = new Clock()) {
        return new Duration(this.moment - that.moment);
    }

    static extractCurrentClock(date = new Date()) {
        return new Clock(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    }

}

const hourElem = document.getElementById("hour");
const minuteElem = document.getElementById("minute");
const secondElem = document.getElementById("second");
const milisecondElem = document.getElementById("milisecond");
const minusElem = document.getElementById("minus");


const PROPERTIES = {
    wakeClock: new Clock(6, 0, 0),
    sleepDuration: new Duration(0, 0, 30, 7),
    getWakeDuration: function () {
        return DAY_DURATION.minus(this.sleepDuration);
    },
    getWakenRatio: function (duration = new Duration()) {
        return 1 - duration.getRatio(this.getWakeDuration());
    }
};

function getBackgroundBrightnessRatio(remainingDuration = new Duration(), wakeRatio = 0) {
    return -4 * Math.pow(wakeRatio, 2) + 4 * wakeRatio;
}

function getTextColorBrightnessRatio(backgroundRatio = 0, wakeRatio = 0) {
    if (backgroundRatio < 0.5) {
        return backgroundRatio + 0.25;
    }
    return 4 * Math.pow(wakeRatio, 2) - 4 * wakeRatio + 1;
}

function getRemainingDuration(date = new Date()) {
    const currentClock = Clock.extractCurrentClock(date);
    const wakeClock = PROPERTIES.wakeClock;
    const gap = currentClock.differentFrom(wakeClock);
    if (gap.negative) {
        return PROPERTIES.sleepDuration.add(gap).contrast;
    }
    return DAY_DURATION.minus(gap).minus(PROPERTIES.sleepDuration);
}



function update() {
    const duration = getRemainingDuration(new Date());
    updateClock(duration);
    window.requestAnimationFrame(update);
}

function updateClock(duration = new Duration()) {
    var bgColor = 0;
    var textColor = 32;
    if (!duration.negative) {
        const wakenRatio = PROPERTIES.getWakenRatio(duration);
        const bgRatio = getBackgroundBrightnessRatio(duration, wakenRatio);
        bgColor = Math.round(255 * bgRatio);
        textColor = Math.round(255 * getTextColorBrightnessRatio(bgRatio, wakenRatio));
    }
    document.body.style.backgroundColor = `rgb(${bgColor},${bgColor},${bgColor})`;
    document.body.style.color = `rgb(${textColor},${textColor},${textColor})`;
    hourElem.textContent = String(duration.hour).padStart(2, '0');
    minuteElem.textContent = String(duration.minute).padStart(2, '0');
    secondElem.textContent = String(duration.second).padStart(2, '0');
    milisecondElem.textContent = String(duration.milisecond).padStart(3, '0');
    minusElem.hidden = !duration.negative;
}

window.requestAnimationFrame(update);