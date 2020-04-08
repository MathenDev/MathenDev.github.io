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
    wakeClock: new Clock(6, 0),
    sleepDuration: new Duration(0, 0, 15, 7),
    previousDuration: new Duration()
};

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
    PROPERTIES.previousDuration = duration;
    window.requestAnimationFrame(update);
}

function updateClock(duration = new Duration()) {
    const previousDuration = PROPERTIES.previousDuration;
    if (previousDuration.negative !== duration.negative) {
        if (duration.negative) {
            document.body.classList.add("contrast");
            minusElem.hidden = false;
        } else {
            document.body.classList.remove("contrast");
            minusElem.hidden = true;
        }
    }
    if (previousDuration.hour != duration.hour)
        hourElem.textContent = String(duration.hour).padStart(2, '0');
    if (previousDuration.minute != duration.minute)
        minuteElem.textContent = String(duration.minute).padStart(2, '0');
    if (previousDuration.second != duration.second)
        secondElem.textContent = String(duration.second).padStart(2, '0');
    if (previousDuration.milisecond != duration.milisecond)
        milisecondElem.textContent = String(duration.milisecond).padStart(3, '0');
}

window.requestAnimationFrame(update);