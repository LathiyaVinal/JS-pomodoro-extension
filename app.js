let section_timer = document.querySelector('.timer_num');
let section_header = document.querySelector('.section_header');
let main_container = document.querySelector('.main_container');
let modal_setting = document.querySelector('#modal_setting');
let full_body = document.querySelector('.full_body');
let btn_menu_sub = document.querySelector("#btn-menu-sub");
let bottom_task_section = document.querySelector(".bottom-task-section");
let label_current_state = document.querySelector('#label_current_state');
let setting_save_changes = document.querySelector('#setting_save_changes');
let btn_reset = document.querySelector('#btn_reset');
let btn_clear_done_task = document.querySelector('#btn_clear_done_task');
let btn_start = document.querySelector('#btn_start');
let btn_play_pause = document.querySelector('#btn-play-pause');
let btn_add_task = document.querySelector("#addtask");
let task_list = document.querySelector("#tasklist");
let btn_todo = document.querySelector('.bi-list-task');
var locationUpdateLog = document.getElementById("locationUpdateLog");
let tick_sound = document.getElementById("tick_sound");
let btn_clear_logs = document.getElementById("btn_clear_logs");
let btn_clear_task = document.getElementById("btn_clear_task");
let arrow_up = document.getElementById("arrow-up");
let arrow_down = document.getElementById("arrow-down");
var notificationTextInput = document.getElementById("input_notification_time");
let autoStartRoundsInput = document.getElementById("autoStartRoundsInput");
let longBreakIntervalInput = document.getElementById("longBreakIntervalInput");
let txt_sliderValue = document.getElementById("txt_sliderValue");
let backgroundMusicOptions = document.getElementById("backgroundMusicOptions");
let focus_btn = document.getElementById("focus_id");
let short_break_btn = document.getElementById("short_break_id");
let long_break_btn = document.getElementById("long_break_id");
let arrow_bg_up = document.getElementById("arrow-bg-up");
let arrow_bg_down = document.getElementById("arrow-bg-down");

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
    displayTimerToMain();
    setDataInSettingModal();
    getToDoList();
    displayLog();
    displayNoTask();
    displayAutoStartValue();
    displayNotificationValue();
    displayLongIntervalValue();
    displayBackGroundMusic();
    changeButtonColor();
    displayCurrentLabel();
}

function displayCurrentLabel() {
    if (localStorage.myitems !== undefined) {
        if (localStorage.myitems.indexOf("li") == -1) {
            label_current_state.innerHTML = "Time to focus!";
        }
    }
}

const btn_menu = document.querySelector("#btn-menu");
const elContent = document.querySelector(".iXSNdx");

btn_menu.addEventListener("click", function () {
    elContent.classList.toggle("is-hidden");
});

document.querySelector(".add-task-div").addEventListener("click", function () {
    document.querySelector(".add-text-dialog").classList.add("vanish");

    window.scrollTo(0, document.body.scrollHeight);


});

$(document).click((event) => {
    if ($(event.target).closest('#btn-menu').length) {
    }
    else if (!$(event.target).closest('#btn-menu-sub').length) {

        if (!elContent.classList.contains("is-hidden")) {
            console.log("skdnskndksnkdnsd")
            elContent.classList.toggle("is-hidden");
        }
    }
});

document.querySelector(".add-task-cancel").addEventListener("click", function () {
    document.querySelector(".add-text-dialog").classList.remove("vanish");
})

document.querySelector(".add-task-save").addEventListener("click", function () {
    document.querySelector(".add-text-dialog").classList.remove("vanish");
})

btn_clear_done_task.addEventListener("click", function () {

    var child = task_list.childNodes.length;

    for (let i = 0; i < task_list.childNodes.length; i++) {
        var child = task_list.childNodes[i];
        var children = child.querySelector('#complete');
        if (children.getAttribute('src') == 'images/tick-mark_highlight.png') {
            child.remove();
        }
    }
    storeTask();
});


function displayLongIntervalValue() {
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

function displayTimerToMain() {

    if (allPossibleModes[currentTab].localStorage) {
        timeleft = minutesToSeconds(allPossibleModes[currentTab].localStorage);
    } else {
        timeleft = minutesToSeconds(allPossibleModes[currentTab].default_time);
    }

    section_timer.style.borderColor = allPossibleModes[currentTab].borderColor;
    section_timer.innerHTML = secondsToMinutes(timeleft);
    document.title = secondsToMinutes(timeleft) + " - " + label_current_state.innerHTML;
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
    displayTimerToMain();
    changeButtonColor();
});
short_break_btn.addEventListener('click', function () {
    currentTab = "short_break";
    currentIntervalCount = 0;
    stopTimer();
    displayTimerToMain();
    changeButtonColor();
});

long_break_btn.addEventListener('click', function () {
    currentTab = "long_break";
    currentIntervalCount = 0;
    stopTimer();
    displayTimerToMain();
    changeButtonColor();
});

longBreakIntervalInput.addEventListener("input", function () {
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
    storeTask();
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
            label_current_state.innerHTML = allPossibleModes[currentTab].lable;
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

    displayTimerToMain();
});

btn_reset.addEventListener('click', function () {
    stopTimer();
    displayTimerToMain();

})

arrow_bg_up.addEventListener("click", function () {
    document.querySelector(".input-time").value = parseInt(document.querySelector(".input-time").value) + 1;
})

arrow_bg_down.addEventListener("click", function () {

    if (document.querySelector(".input-time").value > 0) {
        document.querySelector(".input-time").value = parseInt(document.querySelector(".input-time").value) - 1;
    }

})

function stopTimer() {
    clearInterval(updateSeconds);
    timerIsRunning = false;
    stopBackGroundMusic();
    resetBodyColor();
    btn_start.innerHTML = "START";
    btn_play_pause.style.visibility = "hidden"
    bottom_task_section.style.display = "block"
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

    label_current_state.style
        .color = "black"
}

function changeBodyColor() {
    main_container.style.backgroundColor = "black"
    full_body.style.backgroundColor = "black"

    section_header.style.visibility = "hidden"
    label_current_state.style.color = "white"
}

btn_play_pause.addEventListener("click", function () {
    if (confirm("Are you sure you want to finish the round early? (The remaining time will not be counted in the report.)", "OK", "Cancle")) {
        timeleft = 0;
        stopTimer();
        autoStartRound();
        displayTimerToMain();
    }
})

function startCountDown() {

    timerIsRunning = true;
    playBackGroundMusic();
    changeBodyColor();
    changeButtonColor();
    currentStartTime = getTime();
    currentDate = getDate();
    btn_start.innerHTML = "STOP";
    btn_play_pause.style.visibility = "visible"
    bottom_task_section.style.display = "none"


    updateSeconds = setInterval(function () {
        if (timeleft <= 0) {

            stopTimer();
            currentEndTime = getTime();
            allPossibleModes[currentTab].sound.play();
            appendDataToLogModal();
            displayLog();
            autoStartRound();
            displayTimerToMain();
            sendNotificationToBrowser(currentTab);
        }

        playTickSound();
        playEndingNotification();
        section_timer.innerHTML = secondsToMinutes(timeleft);
        document.title = secondsToMinutes(timeleft) + " - " + label_current_state.innerHTML;
        timeleft -= 1;

    }, 1000);
}

function sendNotificationToBrowser(data) {

    if (chrome.notifications !== undefined) {
        var options = {
            title: "Pomodoro Timer",
            message: data,
            iconUrl: "/images/favicon-16x16.png",
            type: "basic",
            requireInteraction: true
        };
        chrome.notifications.create("", options);
    }
}

btn_start.addEventListener('click', function () {

    if (!timerIsRunning) {
        startCountDown();
    } else {
        stopTimer();
    }
})


function autoStartRound() {

    if (currentTab === "focus") {
        currentTab = "long_break"
        displayTimerToMain();
        changeButtonColor();
        changeEstPomodoro();
    } else if (currentTab === "long_break" || currentTab === "short_break") {
        currentTab = "focus"
        displayTimerToMain();
        changeButtonColor();
    }

    if (localStorage.autoStartRoundsValue === "true") {
        if (currentTab === "focus" && currentIntervalCount == ((localStorage.longIntervalTime) - 1)) {
            currentIntervalCount = 0;
        } else if (currentTab === "focus") {
            currentIntervalCount++;
        }
        setTimeout(() => {
            startCountDown();
        }, 1000);
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

function deleteLog(item) {
    item.parentNode.parentNode.remove();
    localStorage.logContents = locationUpdateLog.innerHTML;

    displayLog();

}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function displayTaskOnMain(item) {

    if (item !== undefined) {

        const child = item.childNodes;

        for (let i = 0; i < child.length; i++) {

            if (child[i].id === "todo-div-text") {
                for (let j = 0; j < child[i].childNodes.length; j++) {
                    if (child[i].childNodes[j].id !== undefined) {
                        if (child[i].childNodes[j].id === "todo-text-parent") {
                            let inneEle = child[i].childNodes[j];
                            for (let k = 0; k < inneEle.childNodes.length; k++) {
                                if (inneEle.childNodes[k].id === "todo-text") {
                                    label_current_state.innerHTML = inneEle.childNodes[k].innerHTML;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        };
    }
}

function taskMouseOut(item) {
    item.style.fontSize = "1rem";
    item.style.transition = "100ms";
}

function taskMouseOver(item) {
    item.style.fontSize = "1.2rem";
    item.style.transition = "100ms";
}


function checkedWhenclicked(item) {

    item.parentElement.querySelector("#todo-text").classList.toggle("done");

    if (item.getAttribute('src') == 'images/tick-mark_highlight.png') {

        item.src = "images/tick-mark.png";
    } else {
        item.src = "images/tick-mark_highlight.png";
    }

    storeTask();
}

function storeTask() {
    window.localStorage.myitems = task_list.innerHTML;
}

function deleteTasks(item) {
    item.parentElement.parentElement.parentElement.style.transition = "all 0.2s ease-in";
    item.parentElement.parentElement.parentElement.classList.add("slide-away");
    item.parentElement.parentElement.parentElement.addEventListener("transitionend", function () {
        item.parentElement.parentElement.parentElement.remove();
        storeTask();
        displayNoTask();
    });
}

function getToDoList() {
    var storedValues = window.localStorage.myitems;
    if (storedValues !== undefined) {
        task_list.innerHTML = storedValues;
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
        `<td><button id="btn_delete" onclick="deleteLog(this)" ontype="button" class="close" aria-label="Close"><img src='images/bin-with-lid.png'></img></button></td>`;

    locationUpdateLog.appendChild(row);
    localStorage.logContents = locationUpdateLog.innerHTML;
}

function storeLogDescription(item) {
    item.outerHTML = '<td><input class="form-control" type="text" value="' + item.value + '" onchange="storeLogDescription(this)"></td>';
    localStorage.logContents = locationUpdateLog.innerHTML;
}

btn_add_task.addEventListener('click', function () {
    if (document.querySelector("#textvalue").value !== "") {

        const out = `<li key="uuidv4()" id="list_item" class="list-group-item d-flex align-items-center" style="cursor:pointer; overflow-wrap: break-word;"
        onmouseout="taskMouseOut(this)" onmouseover="taskMouseOver(this)"
        onclick="displayTaskOnMain(this)">
        <div id="todo-div-text" class="d-flex align-items-center">
            <div id = "todo-text-parent" class="d-flex align-items-center">
                <img id="complete" src="images/tick-mark.png" alt=""
                    onclick="checkedWhenclicked(this)"></img>
                <div id="todo-text">${document.querySelector("#textvalue").value}</div>
            </div>
            <div id="pomoCount1" class="d-flex align-items-center">
                <div id="pomoCount">0/${document.querySelector(".input-time").value}</div>
                <img id="delete" src="images/bin-with-lid.png" alt="" onclick="deleteTasks(this)"></img>
            </div>
        </div>
    </li>`


        task_list.innerHTML = out + task_list.innerHTML;

        document.querySelector("#textvalue").value = "";
        storeTask();
        displayNoTask();
    }
})


let btn_clear_act = document.getElementById("btn_clear_act");
btn_clear_act.addEventListener("click", function () {
    console.log("clear act pomodoro");

    clearActPomodoro();
});

function clearActPomodoro() {

    const child = task_list.childNodes;

    for (let i = 0; i < child.length; i++) {

        console.log(833);
        if (child[i].id === "list_item") {
            for (let j = 0; j < child[i].childNodes.length; j++) {
                if (child[i].childNodes[j].id !== undefined) {
                    if (child[i].childNodes[j].id === "todo-div-text") {
                        let inneEle = child[i].childNodes[j];
                        for (let k = 0; k < inneEle.childNodes.length; k++) {
                            console.log(840);

                            if (inneEle.childNodes[k].id === "todo-text-parent") {

                                let inneEleTodo = inneEle.childNodes[k];
                                console.log(845);
                                for (let v = 0; v < inneEleTodo.childNodes.length; v++) {
                                    console.log(847);
                                    if (inneEleTodo.childNodes[v].id !== undefined) {
                                        if (inneEleTodo.childNodes[v].id === "todo-text") {
                                            let innerTodoText = inneEleTodo.childNodes[v].innerHTML;
                                            console.log(851);

                                            for (let x = 0; x < inneEle.childNodes.length; x++) {
                                                console.log(855);
                                                if (inneEle.childNodes[x].id === "pomoCount1") {
                                                    let inneEleTodopomo = inneEle.childNodes[x];
                                                    for (let z = 0; z < inneEleTodopomo.childNodes.length; z++) {
                                                        console.log(859);
                                                        if (inneEleTodopomo.childNodes[z].id === "pomoCount") {
                                                            var str = inneEleTodopomo.childNodes[z].innerHTML;

                                                            var rest = str.substring(0, str.lastIndexOf("/"));
                                                            var last = str.substring(str.lastIndexOf("/") + 1, str.length);
                                                            inneEleTodopomo.childNodes[z].innerHTML = 0 + "/" + last;
                                                            console.log("First : " + rest);
                                                            console.log("Second : " + last);

                                                        }

                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    storeTask();
}


function changeEstPomodoro() {

    if (label_current_state.innerHTML !== "Time to focus!" && label_current_state.innerHTML !== "Time for a break!") {

        console.log("INSIDE : " + label_current_state.innerHTML);

        const child = task_list.childNodes;

        for (let i = 0; i < child.length; i++) {

            if (child[i].id === "list_item") {
                for (let j = 0; j < child[i].childNodes.length; j++) {
                    if (child[i].childNodes[j].id !== undefined) {
                        if (child[i].childNodes[j].id === "todo-div-text") {
                            let inneEle = child[i].childNodes[j];
                            for (let k = 0; k < inneEle.childNodes.length; k++) {

                                if (inneEle.childNodes[k].id === "todo-text-parent") {

                                    let inneEleTodo = inneEle.childNodes[k];

                                    for (let v = 0; v < inneEleTodo.childNodes.length; v++) {

                                        if (inneEleTodo.childNodes[v].id !== undefined) {
                                            if (inneEleTodo.childNodes[v].id === "todo-text") {
                                                let innerTodoText = inneEleTodo.childNodes[v].innerHTML;

                                                if (innerTodoText === label_current_state.innerHTML) {

                                                    for (let x = 0; x < inneEle.childNodes.length; x++) {
                                                        if (inneEle.childNodes[x].id === "pomoCount1") {
                                                            let inneEleTodopomo = inneEle.childNodes[x];
                                                            for (let z = 0; z < inneEleTodopomo.childNodes.length; z++) {
                                                                if (inneEleTodopomo.childNodes[z].id === "pomoCount") {
                                                                    var str = inneEleTodopomo.childNodes[z].innerHTML;

                                                                    var rest = str.substring(0, str.lastIndexOf("/"));
                                                                    var last = str.substring(str.lastIndexOf("/") + 1, str.length);
                                                                    inneEleTodopomo.childNodes[z].innerHTML = parseInt(rest) + 1 + "/" + last;
                                                                    console.log("First : " + rest);
                                                                    console.log("Second : " + last);

                                                                }

                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    storeTask();
}
