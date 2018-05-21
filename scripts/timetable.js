function getMinutes(hours, minutes) {
    return hours * 60 + minutes;
}

function binarySearch(array, key) {
    var lo = 0,
        hi = array.length - 1,
        mid,
        element;
    while (lo !== hi) {
        mid = Math.floor((lo + hi) / 2); //, 10
        if (array[mid].minFromMidnight <= key) {
            lo = mid + 1;
        }
        else {
            hi = mid;
        }
    }
    return lo; //equal hi!
}

Date.daysBetween = function (date1, date2) {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.round(difference_ms / one_day);
}

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

function calcRemainigTime(remainingMiliseconds) {
    remainigSeconds = remainingMiliseconds / 1000;
    seconds = Math.floor(remainigSeconds % 60);
    remainigSeconds /= 60
    minutes = Math.floor(remainigSeconds % 60);
    remainigSeconds /= 60
    hours = Math.floor(remainigSeconds % 24);
    remainigSeconds /= 24
    days = Math.floor(remainigSeconds);

    var timeObject = { days: days, hours: hours, minutes: minutes, seconds: seconds };
    return timeObject;
}

function getNextTramDate(now, index) {
    //calc time diff to next event
    var nextTramHours = list[index].hours;
    var nextTramMinutes = list[index].minutes;

    var nextTramFullYear = now.getFullYear();
    var nextTramMonth = now.getMonth();
    var nextTramDay = now.getDate();

    var nextTramDate = new Date(nextTramFullYear, nextTramMonth, nextTramDay, nextTramHours, nextTramMinutes, 0, 0);
    return nextTramDate;
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}

function displayRow(row, now, remaining, index) {

    row += 1;

    //fahrplan info
    document.getElementById("fahrplan" + row).innerHTML = pad(list[index].hours, 2) + ":" + pad(list[index].minutes, 2) + " - " + list[index].type;

    if (list[index].type == '11') {
        document.getElementById("fahrplan" + row).className = "elfer";
        document.getElementById("nextType" + row).className = "elfer";
    }
    else if (list[index].type == 'FB') {
        document.getElementById("fahrplan" + row).className = "frida";
        document.getElementById("nextType" + row).className = "frida";
    }

    var ms = remaining - now; //ms
    remainingTimeNext = calcRemainigTime(ms);

    document.getElementById("nextDays" + row).innerHTML = pad(remainingTimeNext.days, 2);
    document.getElementById("nextHours" + row).innerHTML = pad(remainingTimeNext.hours, 2);
    document.getElementById("nextMinutes" + row).innerHTML = pad(remainingTimeNext.minutes, 2);
    document.getElementById("nextSeconds" + row).innerHTML = pad(remainingTimeNext.seconds, 2);

    document.getElementById("nextType" + row).innerHTML = list[index].type;

    //debug:
    //var dbg = "index: " + (index) + "; " + list[index].hours + ":" + list[index].minutes + "; type: " + list[index].type;
    //document.getElementById("debug" + row).innerHTML = dbg;

    var followingTramDate = getNextTramDate(now, index + 1);
    var diff = followingTramDate - remaining;
    var diffTime = calcRemainigTime(diff);

    document.getElementById("debug" + row).innerHTML = pad(diffTime.minutes, 2) + ":" + pad(diffTime.seconds, 2);
}


function myTimer() {
    //debug: correct firefox bug
    //remove !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //test with http://www.w3schools.com/jsref/jsref_gettimezoneoffset.asp
    //now.addHours(1);
    //remove !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //debug: correct firefox bug

    //get curret time
    var now = new Date();  //delete here, not used

    var currentDay = now.getDay();
    var currentHours = now.getHours();
    var currentMinutes = now.getMinutes();
    var currentSeconds = now.getSeconds();

    //find index to current time
    var currKey = getMinutes(currentHours, currentMinutes);
    var index = binarySearch(list, currKey);

    for (i = 0; i <= 2; i++) {
        var nextTramDate = getNextTramDate(now, index + i);
        displayRow(i, now, nextTramDate, index + i);
    }

    document.getElementById("additionalInfo").innerHTML = now;    
}

function doStuff() {
    //calculate minFromMidnight
    for (i = 0; i < list.length; i++) {
        list[i].minFromMidnight = getMinutes(list[i].hours, list[i].minutes);
    }

    list.sort(function (a, b) {
        return a.minFromMidnight - b.minFromMidnight;
    })

    //just debug log, remove
    //for (i = 0; i < list.length; i++) {
    //    document.getElementById("demo").innerHTML += list[i].hours;
    //    document.getElementById("demo").innerHTML += ':';
    //    document.getElementById("demo").innerHTML += list[i].minutes;
    //    document.getElementById("demo").innerHTML += ' minFromMidnight:';
    //    document.getElementById("demo").innerHTML += list[i].minFromMidnight;
    //    document.getElementById("demo").innerHTML += ' - type: ';
    //    document.getElementById("demo").innerHTML += list[i].type;

    //    document.getElementById("demo").innerHTML += "<br>";
    //}

    var myVar = setInterval(myTimer, 1000);   
    //debug myTimer();  
}
