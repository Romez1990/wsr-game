startGame('Romez1990');
//#region Warning

let input = $('#start input');
let warning = $('#start p');

$('#start button').on('click', () => {
	if (input.val().length === 0) {
		showWarning('Fill in the name');
	} else if (input.val().length < 4) {
		showWarning('The name is too short');
	} else {
		startGame(input.val());
	}
});

input.on('keydown', () => {
	hideWarning();
});

function showWarning(text) {
	warning.fadeIn(300);
	warning.text(text);
}

function hideWarning() {
	warning.fadeOut(170);
}

//#endregion

//#region Game

function startGame(name) {
	$('#start').css('display', 'none');
	$('#name').text(name);
	$('#game').css('display', 'block');
	
	let secondsPassed = 0;
	
	setInterval(() => {
		secondsPassed++;
		setTime(secondsPassed);
	}, 1000);
}

function setTime(secondsPassed) {
	let second = secondsPassed % 60;
	let minute = (secondsPassed - second) / 60;
	
	minute = minute < 10 ? '0' + minute : minute;
	second = second < 10 ? '0' + second : second;
	
	$('#time').text(minute + ':' + second);
}

//#endregion

//#region Motion

const speed = 3;

let player = $('#player');
let one = false;

let motion = {
	up: false,
	down: false,
	left: false,
	right: false
};

$(document).on('keydown', (e) => {
	if (motion.up || motion.down || motion.left || motion.right) return;
	
	if (e.keyCode === 38 || e.keyCode === 87) {
		motion.up = true;
	}
	
	if (e.keyCode === 40 || e.keyCode === 83) {
		motion.down = true;
	}
	
	if (e.keyCode === 37 || e.keyCode === 65) {
		motion.left = true;
	}
	
	if (e.keyCode === 39 || e.keyCode === 68) {
		motion.right = true;
	}
	
	move();
});

$(document).on('keyup', (e) => {
	if (e.keyCode === 38 || e.keyCode === 87) {
		motion.up = false;
	}
	
	if (e.keyCode === 40 || e.keyCode === 83) {
		motion.down = false;
	}
	
	if (e.keyCode === 37 || e.keyCode === 65) {
		motion.left = false;
	}
	
	if (e.keyCode === 39 || e.keyCode === 68) {
		motion.right = false;
	}
});

function move() {
	if (one) return;
	one = true;
	
	let interval = setInterval(() => {
		if (motion.up) {
			player.css('top', parseFloat(player.css('top')) - speed);
			player.css('transform', 'rotate(0deg)');
		} else if (motion.down) {
			player.css('top', parseFloat(player.css('top')) + speed);
			player.css('transform', 'rotate(180deg)');
		} else if (motion.left) {
			player.css('left', parseFloat(player.css('left')) - speed);
			player.css('transform', 'rotate(270deg)');
		} else if (motion.right) {
			player.css('left', parseFloat(player.css('left')) + speed);
			player.css('transform', 'rotate(90deg)');
		} else {
			clearInterval(interval);
			one = false;
		}
	}, 20);
}

//#endregion

//#region Meteors

function toDegrees(angle) {
	return angle * (180 / Math.PI);
}

function toRadians(angle) {
	return angle * (Math.PI / 180);
}

let idm = 1;
let meteors = [];

// px takes from css
let meteorTypes = [
	{size: 'small', px: 30},
	{size: 'medium', px: 50},
	{size: 'large', px: 90}
];

setInterval(() => {
	if (meteors.length === 5) return;
	
	launchMeteor();
}, 3500);

let app = $('#app');

function launchMeteor(a) {
	// Random angle for meteor fly
	let angle = toRadians(Math.floor(Math.random() * 360));
	// let angle = toRadians(0);
	
	// console.log(toDegrees(angle));
	$('#line').css('transform', `translate(-50%, -50%) rotate(${-toDegrees(angle)}deg)`);
	
	let width = app.width() / 2;
	// width = 1200;
	
	let height = app.height() / 2;
	// height = 1000;
	
	// Hypotenuse of window
	let hypotenuse = Math.pow(Math.pow(width, 2) + Math.pow(height, 2), 0.5);
	
	let sin = Math.sin(angle);
	console.log('sin = ' + Math.round(Math.sin(angle) * 10000) / 10000);
	let sinWin = height / hypotenuse;
	console.log('sinWin = ' + Math.round(width / hypotenuse * 10000) / 10000);
	let cos = Math.cos(angle);
	console.log('cos = ' + Math.round(cos * 10000) / 10000);
	
	let x, y;
	
	let selectedMeteor = meteorTypes[Math.floor(Math.random() * 3)];
	// let selectedMeteor = meteorTypes[1];
	
	if (toDegrees(angle) >= 0 && toDegrees(angle) <= 135 || toDegrees(angle) >= 315 && toDegrees(angle) < 360) {
		if (Math.round(sin * 10000) / 10000 > Math.round(sinWin * 10000) / 10000) {
			console.log('Top');
			let h = height / sin;
			x = h * cos;
			y = -height;
			
			y -= selectedMeteor.px / 2;
		} else if (sin < sinWin) {
			console.log('Right');
			let h = width / cos;
			x = width;
			y = -h * sin;
			
			x += selectedMeteor.px / 2;
		} else if (cos > 0) {
			console.log('Right-top');
			x = width;
			y = -height;
			
			
			x += selectedMeteor.px / 2;
			y += selectedMeteor.px / 2;
		} else if (cos < 0) {
			console.log('Left-top');
			x = -width;
			y = -height;
			
			x -= selectedMeteor.px / 2;
			y -= selectedMeteor.px / 2;
		}
	} else {
		if (Math.abs(Math.round(sin * 10000)) / 10000 > Math.round(sinWin * 10000) / 10000) {
			console.log('Bottom');
			let h = height / sin;
			x = -h * cos;
			y = height;
			
			y += selectedMeteor.px / 2;
		} else if (Math.abs(Math.round(sin * 10000)) / 10000 < Math.abs(Math.round(sinWin * 10000) / 10000)) {
			console.log('Left');
			let h = width / cos;
			x = -width;
			y = h * sin;
			
			x -= selectedMeteor.px / 2;
		} else if (cos < 0) {
			console.log('Left-bottom');
			x = -width;
			y = height;
			
			x += selectedMeteor.px / 2;
			y += selectedMeteor.px / 2;
		}
	}
	
	addMeteor(selectedMeteor.size, x, y);
}

function addMeteor(size, x, y) {
	let id = 'm' + idm++;
	let meteor = $(`<div class="meteor ${size}" id="${id}"></div>`);
	
	meteor.css('left', app.width() / 2 + x);
	meteor.css('top', app.height() / 2 + y);
	
	$('#meteors').append(meteor);
	meteors.push(id);
	
	
}

//#endregion

launchMeteor();
