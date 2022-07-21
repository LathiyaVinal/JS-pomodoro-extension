let section_timer = document.querySelector('.timer_num');
// let section_header = document.querySelector('.section_header').children;
let section_header = document.querySelector('.section_header');
let main_container = document.querySelector('.main_container');
let modal_setting = document.querySelector('#modal_setting');
let full_body = document.querySelector('.full_body');
let label_current_state = document.querySelector('#label_current_state');
let setting_save_changes = document.querySelector('#setting_save_changes');
let btn_reset = document.querySelector('#btn_reset');
let btn_start = document.querySelector('#btn_start');
let btn_add_task = document.querySelector("#addtask");
let task_list = document.querySelector("#tasklist");
let btn_todo = document.querySelector('.bi-list-task');
var locationUpdateLog = document.getElementById("locationUpdateLog");
let tick_sound = document.getElementById("tick_sound");
let btn_clear_logs = document.getElementById("btn_clear_logs");
let btn_clear_task = document.getElementById("btn_clear_task");
var notificationTextInput = document.getElementById("input_notification_time");
let NoDataTaskText = document.getElementById("NoDataTaskText");
let autoStartRoundsInput = document.getElementById("autoStartRoundsInput");
let longBreakIntervalInput = document.getElementById("longBreakIntervalInput");
let txt_sliderValue = document.getElementById("txt_sliderValue");
let backgroundMusicOptions = document.getElementById("backgroundMusicOptions");

let focus_btn = document.getElementById("focus_id");
let short_break_btn = document.getElementById("short_break_id");
let long_break_btn = document.getElementById("long_break_id");

var timeleft;
var notificationTime;
var currentTab, updateSeconds;
var timerIsRunning = false;
var currentStartTime, currentEndTime;
var currentDate;

let currentIntervalCount = 0;

var tick = new Audio("assets/sounds/tick.mp3");

var notification = new Audio("assets/sounds/notification-bell.mp3");

var allPossibleModes = {
    "focus": {
        default_time: 20,
        borderColor: "blue",
        localStorage: localStorage.getItem("focus_time"),
        sound: new Audio("assets/sounds/alert-short-break.mp3"),
        lable: "Time to focus!"
    },
    "long_break": {
        default_time: 30,
        borderColor: "yellow",
        localStorage: localStorage.getItem("long_break_time"),
        sound: new Audio("assets/sounds/alert-short-break.mp3"),
        lable: "Time for a break!"
    },
    "short_break": {
        default_time: 5,
        borderColor: "red",
        localStorage: localStorage.getItem("short_break_time"),
        sound: new Audio("assets/sounds/alert-short-break.mp3"),
        lable: "Time for a break!"
    }
}

var allBackgroundMusic = {
    Campfire: new Audio("assets/sounds/background_music/Campfire.mp3"),
    Forest: new Audio("assets/sounds/background_music/Forest.mp3"),
    Ocean: new Audio("assets/sounds/background_music/Ocean.mp3"),
    Rain: new Audio("assets/sounds/background_music/Rain.mp3"),
    "Windy Desert": new Audio("assets/sounds/background_music/Windy_Desert.mp3"),
};

init();

function init() {
    currentTab = "focus";
    contentDisplay();
    setDataInSettingModal();
    getToDoList();
    displayLog();
    displayNoTask();
    displayAutoStartValue();
    displayNotificationValue();
    displayLongIntervalValue();
    displayBackGroundMusic();
    changeButtonColor();
}

function displayLongIntervalValue() {
    console.log("Long interval : " + localStorage.longIntervalTime);
    if (localStorage.longIntervalTime) {
        txt_sliderValue.innerHTML = localStorage.longIntervalTime;
        longBreakIntervalInput.value = localStorage.longIntervalTime;
    } else {
        txt_sliderValue.innerHTML = 1;
        longBreakIntervalInput.value = 1;
        localStorage.longIntervalTime = 1;
    }
}

function setDataInSettingModal() {
    if (allPossibleModes["focus"].localStorage) {
        document.getElementById("input_focus").value = allPossibleModes["focus"].localStorage;
    } else {
        document.getElementById("input_focus").value = allPossibleModes["focus"].default_time;
    }

    if (allPossibleModes["long_break"].localStorage) {
        document.getElementById("long_break_focus").value = allPossibleModes["long_break"].localStorage;
    } else {
        document.getElementById("long_break_focus").value = allPossibleModes["long_break"].default_time;
    }

    if (allPossibleModes["short_break"].localStorage) {
        document.getElementById("short_break_focus").value = allPossibleModes["short_break"].localStorage;
    } else {
        document.getElementById("short_break_focus").value = allPossibleModes["short_break"].default_time;
    }

    if (localStorage.playTickSound === "true") {
        tick_sound.checked = true;
    } else {
        tick_sound.checked = false;
    }
}

function displayNotificationValue() {
    if (localStorage.notificationTextInputValue) {
        notificationTextInput.value = localStorage.notificationTextInputValue;
    } else {
        notificationTextInput.value = 1;
        localStorage.notificationTextInputValue = 1;
    }
}

function displayAutoStartValue() {

    if (localStorage.autoStartRoundsValue === "true") {
        autoStartRoundsInput.checked = true;
    } else {
        autoStartRoundsInput.checked = false;
    }
}

function contentDisplay() {

    if (allPossibleModes[currentTab].localStorage) {
        timeleft = minutesToSeconds(allPossibleModes[currentTab].localStorage);
        label_current_state.innerHTML = allPossibleModes[currentTab].lable;
    } else {
        timeleft = minutesToSeconds(allPossibleModes[currentTab].default_time);
        label_current_state.innerHTML = allPossibleModes[currentTab].lable;
    }
    section_timer.style.borderColor = allPossibleModes[currentTab].borderColor;
    section_timer.innerHTML = secondsToMinutes(timeleft);
}


function changeButtonColor() {

    if (currentTab == "focus") {
        focus_btn.style.backgroundColor = '#005fbe'
        focus_btn.style.color = 'white';
        focus_btn.style.borderWidth = "2px"
        focus_btn.style.boxShadow = "2px 2px #ccc"

        short_break_btn.style.backgroundColor = 'transparent'
        short_break_btn.style.color = 'white';
        short_break_btn.style.borderWidth = "2px"
        short_break_btn.style.boxShadow = "2px 2px #00000000"

        long_break_btn.style.backgroundColor = 'transparent'
        long_break_btn.style.color = 'white';
        long_break_btn.style.borderWidth = "2px"
        long_break_btn.style.boxShadow = "2px 2px #00000000"

    } else if (currentTab == "short_break") {

        focus_btn.style.backgroundColor = 'transparent'
        focus_btn.style.color = 'white';
        focus_btn.style.borderWidth = "2px"
        focus_btn.style.boxShadow = "2px 2px #00000000"

        short_break_btn.style.backgroundColor = '#005fbe'
        short_break_btn.style.color = 'white';
        short_break_btn.style.borderWidth = "2px"
        short_break_btn.style.boxShadow = "2px 2px #ccc"

        long_break_btn.style.backgroundColor = 'transparent'
        long_break_btn.style.color = 'white';
        long_break_btn.style.borderWidth = "2px"
        long_break_btn.style.boxShadow = "2px 2px #00000000"

    } else if (currentTab == "long_break") {

        focus_btn.style.backgroundColor = 'transparent'
        focus_btn.style.color = 'white';
        focus_btn.style.borderWidth = "2px"
        focus_btn.style.boxShadow = "2px 2px #00000000"

        short_break_btn.style.backgroundColor = 'transparent'
        short_break_btn.style.color = 'white';
        short_break_btn.style.borderWidth = "2px"
        short_break_btn.style.boxShadow = "2px 2px #00000000"

        long_break_btn.style.backgroundColor = '#005fbe'
        long_break_btn.style.color = 'white';
        long_break_btn.style.borderWidth = "2px"
        long_break_btn.style.boxShadow = "2px 2px #ccc"

    }
}

focus_btn.addEventListener('click', function () {
    currentTab = "focus";
    currentIntervalCount = 0;
    stopTimer();
    contentDisplay();
    changeButtonColor();
});
short_break_btn.addEventListener('click', function () {
    currentTab = "short_break";
    currentIntervalCount = 0;
    stopTimer();
    contentDisplay();
    changeButtonColor();
});

long_break_btn.addEventListener('click', function () {
    currentTab = "long_break";
    currentIntervalCount = 0;
    stopTimer();
    contentDisplay();
    changeButtonColor();
});

longBreakIntervalInput.addEventListener("input", function () {
    console.log(longBreakIntervalInput.value);
    txt_sliderValue.innerHTML = longBreakIntervalInput.value;
    localStorage.longIntervalTime = longBreakIntervalInput.value;
});

autoStartRoundsInput.addEventListener("change", function () {
    localStorage.autoStartRoundsValue = autoStartRoundsInput.checked;
})

tick_sound.addEventListener("change", function () {
    localStorage.playTickSound = tick_sound.checked;
});

btn_clear_task.addEventListener('click', function () {
    task_list.innerHTML = "";
    localStorage.myitems = task_list.innerHTML;
    displayNoTask();
})

backgroundMusicOptions.addEventListener("change", function () {
    localStorage.backgroundMusicOptionsValue = backgroundMusicOptions.value;
    stopBackGroundMusic();
    playBackGroundMusic();
});

function stopBackGroundMusic() {
    for (var allSounds in allBackgroundMusic) {
        allBackgroundMusic[allSounds].pause();
        allBackgroundMusic[allSounds].currentEndTime = 0;
    }
}


function playBackGroundMusic() {

    if (localStorage.backgroundMusicOptionsValue) {
        if (localStorage.backgroundMusicOptionsValue !== "None") {
            if (timerIsRunning) {
                console.log("music option : " + localStorage.backgroundMusicOptionsValue)
                console.log("play music : " + allBackgroundMusic[localStorage.backgroundMusicOptionsValue])
                allBackgroundMusic[localStorage.backgroundMusicOptionsValue].play();
            }
        }
    }
}

function displayBackGroundMusic() {
    if (localStorage.backgroundMusicOptionsValue) {
        backgroundMusicOptions.value = localStorage.backgroundMusicOptionsValue;
    } else {
        backgroundMusicOptions.value = "None";
    }
}


function displayNoTask() {
    if (localStorage.myitems !== undefined) {
        if (localStorage.myitems.indexOf("li") == -1) {
            NoDataTaskText.style.display = "block";
        } else {
            NoDataTaskText.style.display = "none";
        }
    }
}

notificationTextInput.addEventListener('change', function () {
    localStorage.notificationTextInputValue = notificationTextInput.value;
})

setting_save_changes.addEventListener('click', function () {
    localStorage.setItem("focus_time", document.getElementById("input_focus").value);
    localStorage.setItem("long_break_time", document.getElementById("long_break_focus").value);
    localStorage.setItem("short_break_time", document.getElementById("short_break_focus").value);

    allPossibleModes["focus"].localStorage = document.getElementById("input_focus").value;
    allPossibleModes["long_break"].localStorage = document.getElementById("long_break_focus").value;
    allPossibleModes["short_break"].localStorage = document.getElementById("short_break_focus").value;

    contentDisplay();
});

// btn_stop.addEventListener('click', function () {
//     stopTimer();
// })

btn_reset.addEventListener('click', function () {
    stopTimer();
    contentDisplay();

})

function stopTimer() {
    clearInterval(updateSeconds);
    timerIsRunning = false;
    stopBackGroundMusic();
    resetBodyColor();
    btn_start.innerHTML = "START";
}


function notifyTimerEnds() {
    console.log("Timer End");
}

btn_clear_logs.addEventListener('click', function () {
    locationUpdateLog.innerHTML = "";
    localStorage.logContents = locationUpdateLog.innerHTML;
    displayNoLogs();
})

function resetBodyColor() {
    full_body.style.backgroundColor = "white"
    main_container.style.backgroundColor = "dodgerblue"

    section_header.style.visibility = "visible"
}


function changeBodyColor() {
    main_container.style.backgroundColor = "black"
    full_body.style.backgroundColor = "black"

    section_header.style.visibility = "hidden"
}

function startCountDown() {

    timerIsRunning = true;
    playBackGroundMusic();
    changeBodyColor();
    changeButtonColor();
    currentStartTime = getTime();
    currentDate = getDate();
    btn_start.innerHTML = "STOP";

    console.log("current tab auto start : " + currentTab)
    updateSeconds = setInterval(function () {
        if (timeleft <= 0) {

            stopTimer();
            notifyTimerEnds();
            currentEndTime = getTime();
            allPossibleModes[currentTab].sound.play();
            appendDataToLogModal();
            displayLog();
            autoStartRound();
            contentDisplay();
            sendNotificationToBrowser(currentTab);
        }

        playTickSound();
        playEndingNotification();
        section_timer.innerHTML = secondsToMinutes(timeleft);
        timeleft -= 1;

    }, 1000);
}

function sendNotificationToBrowser(data) {
    console.log("Notification: " + chrome.notifications);
    // chrome.alarms.create("startRequest", { periodInMinutes: 1 });

    if (chrome.notifications !== undefined) {
        var options = {
            title: "Vinal Pomodoro",
            message: data,
            iconUrl: "/images/favicon-16x16.png",
            type: "basic",
            requireInteraction: true
        };
        chrome.notifications.create("", options);
    }
}

btn_start.addEventListener('click', function () {
    console.log("timerIsRunning : " + timerIsRunning);

    if (!timerIsRunning) {
        startCountDown();
    } else {
        stopTimer();
    }
})


function autoStartRound() {

    console.log("autoStartRound_1 : " + currentIntervalCount);
    console.log("autoStartRound_2 : " + ((localStorage.longIntervalTime) - 1))

    if (localStorage.autoStartRoundsValue === "true") {
        if (currentTab === "focus" && currentIntervalCount == ((localStorage.longIntervalTime) - 1)) {
            currentIntervalCount = 0;
            currentTab = "long_break"
            contentDisplay();

            // changeBodyColor();
            changeButtonColor();


            setTimeout(() => {
                startCountDown();
            }, 1000);


        } else if (currentTab === "focus") {
            currentIntervalCount++;
            currentTab = "short_break"
            contentDisplay();
            // changeBodyColor();
            changeButtonColor();
            setTimeout(() => {
                startCountDown();
            }, 1000);
        } else if (currentTab === "long_break" || currentTab === "short_break") {
            currentTab = "focus"
            contentDisplay();
            //   changeBodyColor();
            changeButtonColor();
            setTimeout(() => {
                startCountDown();
            }, 1000);
        }
    }
}

function playEndingNotification() {
    notificationTime = input_notification_time.value;
    if (timeleft === Number(minutesToSeconds(notificationTime))) {
        notification.play();
    }
}

function playTickSound() {
    if (tick_sound.checked) {
        tick.play();
    }
}

function appendDataToLogModal() {
    var sessionsCol = document.createElement("th");

    sessionsCol.setAttribute("scope", "row");
    if (currentTab === "focus") {
        var sessionData = document.createTextNode("Focus");
    } else if (currentTab === "short_break") {
        var sessionData = document.createTextNode("Short Break");
    } else if (currentTab === "long_break") {
        var sessionData = document.createTextNode("Long Break");
    }
    sessionsCol.appendChild(sessionData);

    var dateCol = document.createElement("td");
    dateData = document.createTextNode(currentDate);
    dateCol.appendChild(dateData);

    var startTimeCol = document.createElement("td");
    data = document.createTextNode(currentStartTime);
    startTimeCol.appendChild(data);

    var endTimeCol = document.createElement("td");
    data = document.createTextNode(currentEndTime);
    endTimeCol.appendChild(data);

    var timeCol = document.createElement("td");
    if (allPossibleModes[currentTab].localStorage) {
        data = document.createTextNode(allPossibleModes[currentTab].localStorage + " min");
        timeCol.appendChild(data);

    } else {
        data = document.createTextNode(allPossibleModes[currentTab].defaultTime + " min");
        timeCol.appendChild(data);
    }

    var row = document.createElement("tr");
    row.setAttribute("scope", "row");
    row.appendChild(sessionsCol);
    row.appendChild(dateCol);
    row.appendChild(startTimeCol);
    row.appendChild(endTimeCol);
    row.appendChild(timeCol);

    row.innerHTML += '<td><input class="form-control" type="text" placeholder="" onchange="storeLogDescription(this)"></td>';
    row.innerHTML +=
        `<td><button type="button" class="close" onclick = "deleteLog(this)" aria-label="Close"><img src='images/bin-with-lid.png'></img></button></td>`;
    locationUpdateLog.appendChild(row);
    localStorage.logContents = locationUpdateLog.innerHTML;
}

function storeLogDescription(item) {
    item.outerHTML = '<td><input class="form-control" type="text" value="' + item.value + '" onchange="storeLogDescription(this)"></td>';
    localStorage.logContents = locationUpdateLog.innerHTML;
}

function deleteLog(item) {
    item.parentNode.parentNode.remove();
    localStorage.logContents = locationUpdateLog.innerHTML;
}

btn_add_task.addEventListener('click', function () {
    if (document.querySelector("#textvalue").value !== "") {

        var listItem = document.createElement("li");
        var todo = document.createTextNode(document.querySelector("#textvalue").value);
        listItem.appendChild(todo);
        listItem.setAttribute("id", "list_item");
        listItem.setAttribute("class", "list-group-item");
        listItem.setAttribute("onclick", "checkedWhenclicked(this)");
        listItem.setAttribute("onmouseover", "taskMouseOver(this)");
        listItem.setAttribute("onmouseout", "taskMouseOut(this)");
        listItem.setAttribute("style", "cursor:pointer; overflow-wrap: break-word;");
        var completedButton = document.createElement("img");
        completedButton.setAttribute("id", "delete");
        completedButton.innerHTML = '<i class="fas fa-trash-alt fa-sm"></i>';
        completedButton.classList.add("close");
        completedButton.setAttribute("onclick", "deleteTasks(this)");
        listItem.appendChild(completedButton);
        completedButton.src = 'images/bin-with-lid.png';

        task_list.appendChild(listItem);

        document.querySelector("#textvalue").value = "";
        storeTask();
        displayNoTask();
    }
})

function taskMouseOut(item) {
    item.style.fontSize = "1rem";
    item.style.transition = "100ms";
}

function taskMouseOver(item) {
    item.style.fontSize = "1.2rem";
    item.style.transition = "100ms";
}


function checkedWhenclicked(item) {
    console.log("checkedWhenclicked")
    item.style.transition = "all 0.2s ease-in";
    item.classList.toggle("done");
}

function storeTask() {
    window.localStorage.myitems = task_list.innerHTML;
}

function deleteTasks(item) {
    item.parentElement.style.transition = "all 0.2s ease-in";
    item.parentElement.classList.add("slide-away");
    item.parentElement.addEventListener("transitionend", function () {
        item.parentElement.remove();
        storeTask();
        displayNoTask();
    });
}

function getToDoList() {
    var storedValues = window.localStorage.myitems;
    if (storedValues !== undefined) {
        document.querySelector("#tasklist").innerHTML = storedValues;
    }
}

function displayLog() {

    if (localStorage.logContents !== undefined) {
        if (localStorage.logContents.indexOf("tr") == -1) {
            displayNoLogs();
        } else {
            if (localStorage.logContents) {
                locationUpdateLog.innerHTML = localStorage.logContents;
                hideNoLogs();
            }
        }
    }
}

function hideNoLogs() {
    document.getElementById("NoDataLoggedText").style.display = "none";
}
function displayNoLogs() {
    document.getElementById("NoDataLoggedText").style.display = "block";
}

let conversionMiToTimeOp = function conversionMiToTime(totalMinutes) {
    var minutes = totalMinutes % 60;
    var hours = (totalMinutes - minutes) / 60;
    var output =
        minutes + ': 00';
    return output;
}

function minutesToSeconds(m) {
    var seconds = m * 60;
    return seconds;
}

function secondsToMinutes(s) {
    var minutes = Math.floor(s / 60);
    var seconds = s % 60;
    if (seconds.toString().length === 1) {
        seconds = "0" + seconds.toString();
    }
    if (minutes.toString().length === 1) {
        minutes = "0" + minutes.toString();
    }
    return minutes + ":" + seconds.toString();
}

function getDate() {
    monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var today = new Date();
    var date = today.getDate();
    var month = monthList[today.getMonth()];
    var year = today.getFullYear();
    return date + " " + month + " " + year;
}

function getTime() {
    var amOrPm = " AM";
    var today = new Date();
    var hours = today.getHours();
    if (Number(hours) > 12) {
        amOrPm = " PM";
        hours = Number(hours) % 12;
    }
    if (Number(hours) === 12) {
        amOrPm = " PM";
    }
    var minutes = today.getMinutes();
    if (minutes.toString().length === 1) {
        minutes = "0" + minutes;
    }
    var time = hours + ":" + minutes + amOrPm;
    return time;
}
