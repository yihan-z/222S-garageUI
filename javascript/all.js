// User class
class User {
	constructor(username, password, phone, garageId) {
		this.username = username;
		this.password = password;
		this.phone = phone;
		this.garageId = garageId;
		this.doorOpen = false;
		this.autoClose = false;
		this.notif = false;
	}
}

// set to hold all users
var users = new Array();
initializeUser();
function initializeUser() {
	var user1 = new User("yihan", "12345", "3144358056", "garage1");
	var user2 = new User("cheng", "54321", "3144356666", "chenggarage");
	users.push(user1);
	users.push(user2);
	user1.doorOpen = true;
}

//remember me
var remembered;
if (remembered != null){
	document.getElementById("uname").value=remembered.username;
	document.getElementById("pwd").value=remembered.password;
}

var controlPageInterval;
var camerasPageInterval;
var currentTemp = 26;
var currentPage = "login-page";
var pages = ["login-page", "pwd-recovery-page", "register-page", "controls-page", "camera-page"];
function changeVisibility(pageToShow) {
	var controlsButton = document.getElementById("controls-button");
	var camerasButton = document.getElementById("cameras-button");
	if (pageToShow == "controls-page") {
		controlsButton.disabled = true;
		camerasButton.disabled = false;
	}
	else if (pageToShow == "camera-page") {
		controlsButton.disabled = false;
		camerasButton.disabled = true;
	}
	document.getElementById(pageToShow).removeAttribute("hidden");
	document.getElementById(currentPage).setAttribute("hidden", '');
	currentPage = pageToShow;
}

document.getElementById("nav-bar").style.display="none";

//login page js
var loggedIn = false;
var currUser = null;

document.getElementById("pwd").addEventListener("keypress", function(e) {
	if (e.keyCode == 13) {
		logIn();
	}
});

document.getElementById("login-page-login-button").addEventListener("click", logIn);

document.getElementById("login-page-forgot-pwd-button").addEventListener("click", function(){
	changeVisibility("pwd-recovery-page");
});

document.getElementById("login-page-register-button").addEventListener("click", function(){
	changeVisibility("register-page");
});

function logIn() {
	var loginUname = document.getElementById("uname").value;
	var loginPwd = document.getElementById("pwd").value;
	document.getElementById("uname").value="";
	document.getElementById("pwd").value="";
	for (var i = 0; i < users.length; i++){
		var u = users[i];
		if (u.username == loginUname && u.password == loginPwd){ // if login successful
			loggedIn = true;
			currUser = u;
			if(document.getElementById("remember").checked){ // set remember me
				remembered = u;
			} else {
				remembered = null;
			}

			// Setting up control page entries
			document.getElementById("nav-bar").style.display="initial";
			document.getElementById("control-device-name").innerText = currUser.garageId;
			document.getElementById("control-dropdown-overview").innerHTML=currUser.garageId+'&nbsp;<span class="caret"></span>';
			var status = "";
			if (currUser.doorOpen){
				status = "OPEN";
				document.getElementById("controls-page-status-indicator").className = "color-blue";
				document.getElementById("controls-page-close-button").innerText = "CLOSE";
			} else {
				status = "CLOSED";
				document.getElementById("controls-page-status-indicator").className = "color-red";
				document.getElementById("controls-page-close-button").innerText = "OPEN";
			}
			document.getElementById("control-garage").innerText = currUser.garageId;
			document.getElementById("controls-page-status-indicator").innerText = status;

			// autotime status
			document.getElementById("auto-close-slider").checked = currUser.autoClose;
			setAutoCloseDisplay(currUser.autoClose);

			// notif status
			document.getElementById("notif-slider").checked = currUser.notif;
			setNotifDisplay(currUser.notif);

			changeVisibility("controls-page");
			startTempAnimation("controls-page-temp-indicator");
			break;
		}
	}				
	if (!loggedIn){
		alert("Username/Password incorrect. Please log in again.");
	}
}

//pwd recovery page js
document.getElementById("rec-uname").addEventListener("keypress", function(e){
	if (e.keyCode == 13) {
		passwordRecovery();
	}
});

document.getElementById("rec-email").addEventListener("keypress", function(e){
	if (e.keyCode == 13) {
		passwordRecovery();
	}
});

document.getElementById("pwd-recovery-page-recover-button").addEventListener("click", passwordRecovery);

document.getElementById("pwd-recovery-page-cancel-button").addEventListener("click", function(){
	changeVisibility("login-page");
});

document.getElementById("pwd-recovery-page-register-button").addEventListener("click", function(){
	changeVisibility("register-page");
});

function passwordRecovery() {
	var recUname = document.getElementById("rec-uname");
	var recEmail = document.getElementById("rec-email");
	if(recUname.value=="" && recEmail.value==""){
		alert("Please enter username or email.");
	} else {
		var foundMatch = false;
		for (var i = 0; i < users.length; i++){
			var u = users[i];
			if (u.username == recUname.value || u.email == recEmail.value){
				alert("Your password is "+u.password);
				foundMatch = true;	
				break;
			}
		}

		recUname.value = "";
		recEmail.value = "";

		if (!foundMatch){
			alert("Sorry. The username/email you entered is not found.");
		} else {
			changeVisibility("login-page");
		}
	}
}

//register page js
document.getElementById("register-page-cancel-button").addEventListener("click", function(){
	changeVisibility("login-page");
});

document.getElementById("reg-uname").addEventListener("keypress", function(e){
	if (e.keyCode == 13) {
		document.getElementById("reg-pwd").focus();
	}
});

document.getElementById("reg-pwd").addEventListener("keypress", function(e){
	if (e.keyCode == 13) {
		document.getElementById("reg-pwd-confirm").focus();
	}
});

document.getElementById("reg-pwd-confirm").addEventListener("keypress", function(e){
	if (e.keyCode == 13) {
		document.getElementById("reg-phone").focus();
	}
});

document.getElementById("reg-phone").addEventListener("keypress", function(e){
	if (e.keyCode == 13) {
		document.getElementById("reg-garageId").focus();
	}
});

document.getElementById("reg-garageId").addEventListener("keypress", function(e){
	if (e.keyCode == 13) {
		signUp();
	}
});

document.getElementById("register-page-signup-button").addEventListener("click", signUp);

function signUp() {
	var regUname = document.getElementById("reg-uname");
	var regPwd = document.getElementById("reg-pwd");
	var regPwdConfirm = document.getElementById("reg-pwd-confirm");
	var regPhone = document.getElementById("reg-phone");
	var regGarageId = document.getElementById("reg-garageId");

	if (regUname.value == "") {
		alert("ERROR: please enter a user name. ");
	}
	else if (regPwd.value == "") {
		alert("ERROR: please enter a password. ");
	}
	else if (regPwdConfirm.value == "") {
		alert("ERROR: please confirm your password. ");
	}
	else if (regPhone.value == "") {
		alert("ERROR: please enter a phone number. ");
	}
	else if (regGarageId.value == "") {
		alert("ERROR: please enter a garage ID. ");
	}
	else if (regPwd.value != regPwdConfirm.value){
		alert("Password inconsistent. Please enter again");
		regPwd.value="";
		regPwdConfirm.value="";
	}
	else { // data valid, registering new user
		var newUser = new User(regUname.value, regPwd.value, regPhone.value, regGarageId.value);
		users.push(newUser);

		for (var i = 0; i < users.length; i++){
		}

		changeVisibility("login-page");

	}
}

//controls page js
document.getElementById("cameras-button").addEventListener("click", function(){
	if (currentPage != "camera-page") {
		startTempAnimation("cameras-page-temp-indicator");
		changeVisibility("camera-page");
		stopTempAnimation("controls-page-temp-indicator");
		document.getElementById("cameras-button").className += "active";
		document.getElementById("controls-button").className = "";
		console.log("pulling up cameras page");

		// set up camera page entries
		document.getElementById("camera-control-device-name").innerText = currUser.garageId;
		document.getElementById("camera-control-dropdown-overview").innerHTML=currUser.garageId+'&nbsp;<span class="caret"></span>';
		var status = "";
		if (currUser.doorOpen){
			status = "OPEN";
			document.getElementById("cameras-page-status-indicator").className = "color-blue";
			document.getElementById("cameras-page-close-button").innerText = "CLOSE";
		} else {
			status = "CLOSED";
			document.getElementById("cameras-page-status-indicator").className = "color-red";
			document.getElementById("cameras-page-close-button").innerText = "OPEN";
		}
		document.getElementById("cameras-garage").innerText = currUser.garageId;
		document.getElementById("cameras-page-status-indicator").innerText = status;
	}

});

document.getElementById("controls-page-close-button").addEventListener("click", function(){

	var d = document.createElement("div");
	d.className = "statusBarContainer";
	d.id = "status-bar-container";
	var m = document.createElement("div");
	m.className = "statusBarMove";
	m.id = "status-bar-move";
	document.getElementById("controls-page-left-panel").appendChild(d);
	document.getElementById("status-bar-container").appendChild(m);
	animationDoor("controls-page-status-indicator", "controls-page-close-button", "controls-page-left-panel");
});

document.getElementById("controls-page-see-camera-button").addEventListener("click", function(){
	startTempAnimation("cameras-page-temp-indicator");

	document.getElementById("cameras-button").click();

	stopTempAnimation("controls-page-temp-indicator");
});

function animationDoor(indicator_id, button_id, panel_id) {
	var m = document.getElementById("status-bar-move");
	var d = document.getElementById("status-bar-container");
	var indicator = document.getElementById(indicator_id);
	var button = document.getElementById(button_id);
	var width = 0;
	var i = setInterval(frame, 10);
	button.disabled = true;
	indicator.className = "color-green";
	if (currUser.doorOpen) {
		indicator.innerHTML = "CLOSING";
	}
	else {
		indicator.innerHTML = "OPENING";
	}
	function frame() {
		if (width >= 100) {
			clearInterval(i);
			document.getElementById("status-bar-container").removeChild(m);
			document.getElementById(panel_id).removeChild(d);
			if (currUser.doorOpen) {
				indicator.className = "color-red";
				indicator.innerHTML = "CLOSED";
				button.innerHTML = "OPEN";
			}
			else {
				indicator.className = "color-blue";
				indicator.innerHTML = "OPEN";
				button.innerHTML = "CLOSE";
			}
			console.log("changing door status from " + currUser.doorOpen);
			currUser.doorOpen = !currUser.doorOpen;
			button.disabled = false;
		} else {
			width = width + 0.2;  
			m.style.width = width + '%'; 
		}
	}
}

document.getElementById("auto-close-slider").addEventListener("change", function(){
	var thisSlider = document.getElementById("auto-close-slider");
	setAutoCloseDisplay(thisSlider.checked);
});

document.getElementById("notif-slider").addEventListener("change", function(){
	var thisSlider = document.getElementById("notif-slider");
	setNotifDisplay(thisSlider.checked);
});

document.getElementById("controls-page-auto-button").addEventListener("click", function(){
	var h = document.getElementById("auto-close-hour-input").value;
	var m = document.getElementById("auto-close-minute-input").value;
	if (h < 0 || h >= 12 || m < 0 || m > 59 || (h == 0 && m == 0) || (h == "" && m == "")) {
		alert("Input Invalid \nHours: 0-11, Minutes: 0-59\ntotal time cannot be 0");
	}
	else {
		var hour = h;
		if (hour == "" || hour == 0){
			hour = 0;
		}
		else {
			var hour = parseInt(h, 10);
		}
		var min = parseInt(m, 10);
		document.getElementById("curr-auto-close").innerText = "Auto close if door open for "+(hour<10?("0"+hour):hour)+" h "+(min<10?("0"+min):min)+" m";
		currUser.autoClose = true;
	}
	document.getElementById("auto-close-hour-input").value = 0;
	document.getElementById("auto-close-minute-input").value = 0;
});


document.getElementById("notif-submit-btn").addEventListener("click", function(){
	// get checkbox values
	var notifOpen = document.getElementById("notif-open").checked;
	var notifClose = document.getElementById("notif-close").checked;
	var notifLeftOpen = document.getElementById("notif-left-open").checked;
	var notifTempHi = document.getElementById("notif-temp-hi").checked;
	var notifTempLo = document.getElementById("notif-temp-lo").checked;

	var output = "Notification will be sent when:\n";

	if (notifOpen) {
		output += "• Door opens\n";
	}
	if (notifClose) {
		output += "• Door closes\n";
	}

	if (notifLeftOpen){
		// left open time
		var h = document.getElementById("notif-open-hour").value;
		var m = document.getElementById("notif-open-minute").value;
		if (h < 0 || h >= 12 || m < 0 || m > 59 || (h == 0 && m == 0) || (h == "" && m == "")) {
			alert("Input Invalid \nHours: 0-12, Minutes: 0-59\ntotal time cannot be 0");
		}
		else {
			var hour = h;
			if (hour == ""){
				hour = 0;
			}
			else {
				hour = parseInt(h, 10);
			}
			var min = parseInt(m, 10);
			output += "• Door open for "+(hour<10?("0"+hour):hour)+" h "+(min<10?("0"+min):min)+" m\n";

		}

	}
	if (notifTempHi){
		var hi = document.getElementById("notif-temp-hi-val").value;
		if (hi <-40 || hi > 40 || hi == "") {
			alert("Input invalid: high temperature\nValue must be (-40, 40) celsius");
		} else {
			var hiTemp = hi;
			if (hiTemp == ""){
				hiTemp = 0;
			} else {
				hiTemp = parseInt(hiTemp, 10);
			}
			output += "• Temperature higher than " + hiTemp + " degrees Celcius\n";

		}
	}
	if (notifTempLo){
		var lo = document.getElementById("notif-temp-lo-val").value;
		if (lo <-40 || lo > 40 || lo == "") {
			alert("Input invalid: low temperature\nValue must be (-40,40) celsius");
		} else {
			var loTemp = lo;
			if (loTemp == ""){
				loTemp = 0;
			} else {
				loTemp = parseInt(loTemp, 10);
			}
			output += "• Temperature lower than " + loTemp + " degrees Celcius";

		}
	}
	document.getElementById("curr-notif").innerText = output;
	document.getElementById("notif-open").checked = false;
	document.getElementById("notif-close").checked = false;
	document.getElementById("notif-temp-hi").checked = false;
	document.getElementById("notif-temp-hi-val").value = "";
	document.getElementById("notif-temp-lo").checked = false;
	document.getElementById("notif-temp-lo-val").value = "";
	document.getElementById("notif-left-open").checked = false;
	document.getElementById("notif-open-hour").value = 0;
	document.getElementById("notif-open-minute").value = 0;
});



// camera page js
document.getElementById("controls-button").addEventListener("click", function(){
	if (currentPage != "controls-page") {
		startTempAnimation("controls-page-temp-indicator");
		changeVisibility("controls-page");
		stopTempAnimation("cameras-page-temp-indicator");
		document.getElementById("cameras-button").className = "";
		document.getElementById("controls-button").className += "active";

		// set up controls page entries
		document.getElementById("control-device-name").innerText = currUser.garageId;
		document.getElementById("control-dropdown-overview").innerHTML=currUser.garageId+'&nbsp;<span class="caret"></span>';
		var status = "";
		if (currUser.doorOpen){
			status = "OPEN";
			document.getElementById("controls-page-status-indicator").className = "color-blue";
			document.getElementById("controls-page-close-button").innerText = "CLOSE";
		} else {
			status = "CLOSED";
			document.getElementById("controls-page-status-indicator").className = "color-red";
			document.getElementById("controls-page-close-button").innerText = "OPEN";
		}
		document.getElementById("control-garage").innerText = currUser.garageId;
		document.getElementById("controls-page-status-indicator").innerText = status;
	}
});

function changeTemp(indicator_id) {
	var newTemp = Math.floor(Math.random()*30 + 10);
	var tempIndicator = document.getElementById(indicator_id);
	if (newTemp >= 30) {
		tempIndicator.className = "color-red";
	}
	else {
		tempIndicator.className = "color-blue";
	}
	tempIndicator.innerHTML = newTemp+"°C";
	currentTemp = newTemp;
}

function startTempAnimation(indicator_id) {
	if (indicator_id == "controls-page-temp-indicator") {
		controlPageInterval = setInterval(changeTemp, 3000, indicator_id);
	}
	else if (indicator_id == "cameras-page-temp-indicator") {
		camerasPageInterval = setInterval(changeTemp, 3000, indicator_id);
	}
}

function stopTempAnimation(indicator_id) {
	if (indicator_id == "controls-page-temp-indicator") {
		clearInterval(controlPageInterval);
	}
	else if (indicator_id == "cameras-page-temp-indicator") {
		clearInterval(camerasPageInterval);
	}
}

function setAutoCloseDisplay(autoClose){
	if(autoClose){
		document.getElementById("auto-close-time-form").style.display = "initial";
		document.getElementById("controls-page-auto-button").style.display = "initial";
		document.getElementById("auto-close-disabled").style.display = "none";
		currUser.autoClose = true;
		
	} else {
		document.getElementById("auto-close-time-form").style.display = "none";
		document.getElementById("controls-page-auto-button").style.display = "none";
		document.getElementById("auto-close-disabled").style.display = "initial";
		document.getElementById("auto-close-disabled").style.color = "gray";
		currUser.autoClose = false;
	}
}

function setNotifDisplay(notif){
	if(notif){
		document.getElementById("notif-options").style.display="initial";
		document.getElementById("notif-submit-btn").style.display="initial";
		document.getElementById("notif-disabled").style.display = "none";
		currUser.notif = true;
	} else {
		document.getElementById("notif-options").style.display="none";
		document.getElementById("notif-submit-btn").style.display="none";
		document.getElementById("notif-disabled").style.display = "initial";
		document.getElementById("notif-disabled").style.color = "gray";
		currUser.notif = false;

	}
}

//camera page JS
document.getElementById("cameras-page-close-button").addEventListener("click", function(){


	var d = document.createElement("div");
	d.className = "statusBarContainer";
	d.id = "status-bar-container";
	var m = document.createElement("div");
	m.className = "statusBarMove";
	m.id = "status-bar-move";
	document.getElementById("cameras-page-left-panel").appendChild(d);
	document.getElementById("status-bar-container").appendChild(m);
	animationDoor("cameras-page-status-indicator", "cameras-page-close-button", "cameras-page-left-panel");
});