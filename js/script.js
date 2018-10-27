let input = $('#start input');
let warning = $('#start p');

$('#start button').on('click', () => {
	if (input.val().length === 0) {
		//warning.fadeOut(300);
	}
});

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