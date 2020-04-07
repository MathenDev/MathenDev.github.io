const hourElem = document.getElementById("hour");
const minuteElem = document.getElementById("minute");
const secondElem = document.getElementById("second");
const minusElem = document.getElementById("minus");
const STATE = {
    wakingTime: {
        hour: 5,
        minute: 30
    },
    sleepTime: {
        hours: 7,
        minutes: 15
    },
    remainingTime: {
        hours: 0,
        minutes: 0,
        seconds: 0
    },

    isRemainingTimeDifferent: function (thatR) {
        var thisR = this.remainingTime;
        return thisR.overnight != thatR.overnight || thisR.hours != thatR.hours || thisR.minutes != thatR.minutes || thisR.seconds != thatR.seconds;
    },
    getWakingTimeInMilis: function () {
        return toMilis(this.wakingTime.hour, this.wakingTime.minute);
    },
    getSleepTimeInMilis: function () {
        return toMilis(this.sleepTime.hours, this.sleepTime.minutes);
    }
};

function toMilis(hours = 0, minutes = 0, seconds = 0) {
    return ((hours * 60 + minutes) * 60 + seconds) * 1000;
}

function toHMS(milis = 0) {
    var s = Math.round(milis / 1000);
    var m = Math.floor(s / 60);
    s %= 60;
    var h = Math.floor(m / 60);
    m %= 60;
    return {
        hours: h,
        minutes: m,
        seconds: s
    }
}

function getRemainingHMS() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const currentMilis = toMilis(hours, minutes, seconds);
    const wakingTimeMilis = STATE.getWakingTimeInMilis();
    const sleepTimeMilis = STATE.getSleepTimeInMilis();
    var gapMilis = Math.abs(currentMilis - wakingTimeMilis);
    if (currentMilis > wakingTimeMilis) {
        gapMilis = toMilis(24) - gapMilis;
    }
    if (gapMilis < sleepTimeMilis) {
        const hms = toHMS(sleepTimeMilis - gapMilis);
        hms.overnight = true;
        return hms;
    }
    return toHMS(gapMilis - sleepTimeMilis);
}

function update() {
    const hms = getRemainingHMS();
    if (STATE.isRemainingTimeDifferent(hms)) {
        if (hms.overnight) {
            document.body.classList.add("contrast");
            minusElem.hidden = false;
        } else {
            minusElem.hidden = true;
        }
        hourElem.innerText = String(hms.hours).padStart(2, '0');
        minuteElem.innerText = String(hms.minutes).padStart(2, '0');
        secondElem.innerText = String(hms.seconds).padStart(2, '0');
    }
    window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);