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