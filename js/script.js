const rect = document.getElementById("rect");
const rectDynamic = document.getElementById("rectDynamic");
const countList = document.querySelector(".count_list");
const keyboard = document.querySelector(".keyboard");
const timerAnimation = 1000;
let pointShift = 0;
let step = -25;
let direction = "y";
let isPaused = true;
let intervalId;
let speed = 500;
let isControlButtonEnabled = true;

const BUTTONS = {

	"ArrowUp": {

		action: function () {
			if (!speedUp(-25, "y")) {
				step = -25;
				direction = "y";
			}
		},
		screenButton: keyboard.querySelector(".ArrowUp"),
		isPressed: false,
	},

	"ArrowDown": {

		action: function () {

			if (!speedUp(25, "y")) {
				step = 25;
				direction = "y";
			}
		},
		screenButton: keyboard.querySelector(".ArrowDown"),
		isPressed: false,
	},

	"ArrowLeft": {

		action: function () {

			if (!speedUp(-25, "x")) {
				step = -25;
				direction = "x";
			}
		},
		screenButton: keyboard.querySelector(".ArrowLeft"),
		isPressed: false,
	},

	"ArrowRight": {

		action: function () {

			if (!speedUp(25, "x")) {
				step = 25;
				direction = "x";
			}
		},
		screenButton: keyboard.querySelector(".ArrowRight"),
		isPressed: false,
	},

	"Space": {

		action: function () {

			if (!isPaused) {
				pause();

			} else {
				play(this.isPressed);
			}
		},
		screenButton: keyboard.querySelector(".Space"),
		isPressed: false,
	},
}

replaceGoalRect();

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

for (let key in BUTTONS) {
	BUTTONS[key].screenButton.addEventListener("mousedown", mouseDownHandler);
	BUTTONS[key].screenButton.addEventListener("mouseup", mouseUpHandler);
}

function mouseDownHandler(event){
	const button = event.target.closest(".button");

	for (let key in BUTTONS) {
		
		if (button.classList.contains(key)) {

			if (isPaused && !button.classList.contains("Space")) {
				continue;
			}
			if (!isControlButtonEnabled) {
				continue;
			}
			BUTTONS[key].action();
			BUTTONS[key].isPressed = true;
			BUTTONS[key].screenButton.classList.add("active");
		}
	}
}

function mouseUpHandler(event) {

	const button = event.target.closest(".button");

	for (let key in BUTTONS) {

		if (button.classList.contains(key)) {
			BUTTONS[key].isPressed = false;
			BUTTONS[key].screenButton.classList.remove("active");
		}
	}
}

function keyDownHandler(event) {
	
	for (let key in BUTTONS) {
		
		if (key === event.code) {

			if (isPaused && event.code !== "Space") {
				continue;
			}
			if (!isControlButtonEnabled) {
				continue;
			}
			BUTTONS[key].action();
			BUTTONS[key].isPressed = true;
			BUTTONS[key].screenButton.classList.add("active");
		}
	}
}

function keyUpHandler(event) {

	for (let key in BUTTONS) {

		if (key === event.code) {
			BUTTONS[key].isPressed = false;
			BUTTONS[key].screenButton.classList.remove("active");
		}
	}
}

function play(isPressed) {
	if (isPressed) {
		return;
	}

	intervalId = setInterval(() => {
		rect[direction].baseVal.value = rect[direction].baseVal.value + step;

		if (rect[direction].baseVal.value === 0 || rect[direction].baseVal.value === 750) {
			crash();
		}

		if (rectDynamic.x.baseVal.value === rect.x.baseVal.value && rectDynamic.y.baseVal.value === rect.y.baseVal.value) {
			meet();
		}

	}, speed)

	isPaused = false;

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
		play();
		isControlButtonEnabled = true;
	}, timerAnimation);
}

function pause() {
	clearInterval(intervalId);
	isPaused = true;
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
		isPaused = true;
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
