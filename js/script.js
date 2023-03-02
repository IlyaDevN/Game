const rect = document.getElementById("rect");
const rectDynamic = document.getElementById("rectDynamic");
const countList = document.querySelector(".count_list");
const timerAnimation = 1000;
let pointShift = 0;
let step = -25;
let direction = "y";
let isPaused = false;
let intervalId;
let speed = 500;
let isControlButtonEnabled = true;

const BUTTONS = {

	"ArrowUp": function () {

		if (!speedUp(-25, "y")) {
			step = -25;
			direction = "y";
		}
	},
	"ArrowDown": function () {

		if (!speedUp(25, "y")) {
			step = 25;
			direction = "y";
		}
	},
	"ArrowLeft": function () {

		if (!speedUp(-25, "x")) {
			step = -25;
			direction = "x";
		}
	},
	"ArrowRight": function () {

		if (!speedUp(25, "x")) {
			step = 25;
			direction = "x";
		}
	},
	"Space": function () {

		if (isPaused) {
			pause();

		} else {
			go();
		}
	},
}

replaceGoalRect();

document.addEventListener("keydown", keydownHandler);

function keydownHandler(event) {

	for (let key in BUTTONS) {

		if (key === event.code) {
			if ((!isPaused && event.code !== "Space") || !isControlButtonEnabled) {
				continue;
			}
			BUTTONS[key]();
		}
	}
}

function go() {
	intervalId = setInterval(() => {
		rect[direction].baseVal.value = rect[direction].baseVal.value + step;

		if (rect[direction].baseVal.value === 0 || rect[direction].baseVal.value === 750) {
			crash();
		}

		if (rectDynamic.x.baseVal.value === rect.x.baseVal.value && rectDynamic.y.baseVal.value === rect.y.baseVal.value) {
			meet();
		}

		isPaused = true;
	}, speed)
}

function speedUp(newStep, newDirection) {

	if (step !== newStep || direction !== newDirection) {
		return;
	}

	rect[direction].baseVal.value = rect[direction].baseVal.value + step;

	if (rect[direction].baseVal.value === 0 || rect[direction].baseVal.value === 750) {
		crash();
	}

	if (rectDynamic.x.baseVal.value === rect.x.baseVal.value && rectDynamic.y.baseVal.value === rect.y.baseVal.value) {
		meet();
	}
	return true;
}

function crash() {
	rect.dispatchEvent(new Event("start"));
	clearInterval(intervalId);
	rectReset();
	replaceGoalRect();
}

function meet() {
	rect.dispatchEvent(new Event("start"));
	clearInterval(intervalId);
	increasePoints();
	speed -= 50;
	isControlButtonEnabled = false;

	setTimeout(() => {
		replaceGoalRect();
		go();
		isControlButtonEnabled = true;
	}, timerAnimation);
}

function pause() {
	clearInterval(intervalId);
	isPaused = false;
}

function rectReset() {
	setTimeout(() => {
		rect.x.baseVal.value = 375;
		rect.y.baseVal.value = 750;
		countList.style.transform = `translateY(0)`;
		pointShift = 0;
		step = -25;
		direction = "y";
		speed = 500;
		isPaused = false;
	}, timerAnimation);
}

function rand(min, max, num) {
	var random = Math.floor(Math.random() * (max - min + 1) + min);
	var rem = random % num;
	if (rem == 0) return random;

	var gross = random + num - rem;
	if (gross <= max) return gross;

	var less = random - rem;
	if (less >= min) return less;
}

function replaceGoalRect() {
	let RandX = rand(25, 725, 25);
	let RandY = rand(25, 725, 25);

	rectDynamic.x.baseVal.value = RandX;
	rectDynamic.y.baseVal.value = RandY;
}

function increasePoints() {
	pointShift -= 130;
	countList.style.transform = `translateY(${pointShift}px)`
}
