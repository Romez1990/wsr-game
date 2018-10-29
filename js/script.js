//TODO: Move all shortcuts to one function

//#region Options

let
	fps = 60,
	delay = 1000 / fps,
	playerSpeed = 150, // px/s
	playerSpeedBoost = playerSpeed * 2.5, // px/s
	meteorSpeed = 300 // px/s
;

//#endregion

//#region Input

let input = $('#start input');

input.val(localStorage.getItem('name'));
input.select();
let warning = $('#start p');
let startButton = $('#start button');

startButton.on('click', () => {
	if (input.val().length === 0) {
		showWarning('Fill in the name');
		input.focus();
	} else if (input.val().length < 4) {
		showWarning('The name is too short');
		input.focus();
	} else {
		let val = input.val();
		localStorage.setItem('name', val);
		startGame(val);
	}
});

$(window).on('keydown', (e) => {
	if (e.keyCode === 13) {
		startButton.click();
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
	
	setAllTimers();
	
	$(document).on('keydown', (e) => {
		switch (e.keyCode) {
			case 27:
				stopAllTimers();
				break;
		}
	});
}

let timers = [];

function setAllTimers() {
	timers.push(setInterval(setTime, 1000));
	timers.push(setInterval(createMeteor, 200));
	timers.push(setInterval(removeMeteors, delay));
	timers.push(setInterval(checkAllMeteorsToCollision, delay));
}

function stopAllTimers() {
	while (timers.length !== 0) {
		clearInterval(timers[0]);
		timers.splice(0, 1);
	}
	
}

let secondsPassed = 0;

function setTime() {
	secondsPassed++;
	
	let second = secondsPassed % 60;
	let minute = (secondsPassed - second) / 60;
	
	minute = minute < 10 ? '0' + minute : minute;
	second = second < 10 ? '0' + second : second;
	
	$('#time').text(minute + ':' + second);
}

//#endregion

//#region Player movement

let player = $('#player');

let one = false;

let
	up = false,
	down = false,
	left = false,
	right = false
;

$(document).on('keydown', (e) => {
	if (up || down || left || right) return;
	
	switch (e.keyCode) {
		case 38:
		case 87:
			up = true;
			break;
		
		case 40:
		case 83:
			down = true;
			break;
		
		case 37:
		case 65:
			left = true;
			break;
		
		case 39:
		case 68:
			right = true;
			break;
	}
	
	move();
});

$(document).on('keyup', (e) => {
	switch (e.keyCode) {
		case 38:
		case 87:
			up = false;
			break;
		
		case 40:
		case 83:
			down = false;
			break;
		
		case 37:
		case 65:
			left = false;
			break;
		
		case 39:
		case 68:
			right = false;
			break;
	}
});

function move() {
	if (one) return;
	one = true;
	
	let interval = setInterval(() => {
		if (up) {
			player.css('top', parseFloat(player.css('top')) - playerSpeed / fps);
			player.css('transform', 'translate(-50%, -50%) rotate(0deg)');
		} else if (down) {
			player.css('top', parseFloat(player.css('top')) + playerSpeed / fps);
			player.css('transform', 'translate(-50%, -50%) rotate(180deg)');
		} else if (left) {
			player.css('left', parseFloat(player.css('left')) - playerSpeed / fps);
			player.css('transform', 'translate(-50%, -50%) rotate(270deg)');
		} else if (right) {
			player.css('left', parseFloat(player.css('left')) + playerSpeed / fps);
			player.css('transform', 'translate(-50%, -50%) rotate(90deg)');
		} else {
			clearInterval(interval);
			one = false;
		}
	}, delay);
}

//#endregion

//#region Meteors

let meteors = [];
let app = $('#app');

// px takes from css
let meteorTypes = [
	{size: 'small', px: 30},
	{size: 'medium', px: 50},
	{size: 'large', px: 90}
];

function createMeteor() {
	if (meteors.length >= 5) return;
	
	//#region Set direction
	
	// Random angle for meteor fly
	let angle = toRadians(randomRange(360));
	
	let width = app.width() / 2;
	
	let height = app.height() / 2;
	
	// Hypotenuse of window
	let hypotenuse = Math.pow(Math.pow(width, 2) + Math.pow(height, 2), 0.5);
	
	let sin = Math.sin(angle);
	let sinWin = height / hypotenuse;
	let cos = Math.cos(angle);
	
	let x, y, direction;
	
	let selectedMeteor = meteorTypes[randomRange(3)];
	
	if (toDegrees(angle) >= 0 && toDegrees(angle) <= 135 || toDegrees(angle) > 315 && toDegrees(angle) < 360) {
		if (Math.round(sin * 10000) / 10000 > Math.round(sinWin * 10000) / 10000) {
			// console.log('Top');
			let h = height / sin;
			x = h * cos;
			y = -height;
			
			y -= selectedMeteor.px / 2;
			
			direction = randomRangeFloat(180, 360);
		} else if (sin < sinWin) {
			// console.log('Right');
			let h = width / cos;
			x = width;
			y = -h * sin;
			
			x += selectedMeteor.px / 2;
			
			direction = randomRangeFloat(90, 270);
		} else if (cos > 0) {
			// console.log('Right-top');
			x = width;
			y = -height;
			
			x += selectedMeteor.px / 2;
			y -= selectedMeteor.px / 2;
			
			direction = randomRangeFloat(180, 270);
		} else if (cos < 0) {
			// console.log('Left-top');
			x = -width;
			y = -height;
			
			x -= selectedMeteor.px / 2;
			y -= selectedMeteor.px / 2;
			
			direction = randomRangeFloat(270, 360);
		}
	} else {
		if (Math.abs(Math.round(sin * 10000)) / 10000 > Math.round(sinWin * 10000) / 10000) {
			// console.log('Bottom');
			let h = height / sin;
			x = -h * cos;
			y = height;
			
			y += selectedMeteor.px / 2;
			
			direction = randomRangeFloat(0, 180);
		} else if (Math.abs(Math.round(sin * 10000)) / 10000 < Math.abs(Math.round(sinWin * 10000) / 10000)) {
			// console.log('Left');
			let h = width / cos;
			x = -width;
			y = h * sin;
			
			x -= selectedMeteor.px / 2;
			
			direction = randomRange(2) === 0 ? randomRangeFloat(270, 360) : randomRangeFloat(90);
		} else if (cos < 0) {
			// console.log('Left-bottom');
			x = -width;
			y = height;
			
			x -= selectedMeteor.px / 2;
			y += selectedMeteor.px / 2;
			
			direction = randomRangeFloat(0, 90);
		} else {
			// console.log('Right-bottom');
			x = width;
			y = height;
			
			x += selectedMeteor.px / 2;
			y += selectedMeteor.px / 2;
			
			direction = randomRangeFloat(90, 180);
		}
	}
	
	//#endregion
	
	let size = selectedMeteor.size;
	
	let meteor = {
		dom: $(`<div class="meteor ${size}"></div>`)
	};
	
	meteor.dom.css('left', app.width() / 2 + x);
	meteor.dom.css('top', app.height() / 2 + y);
	
	$('#meteors').append(meteor.dom);
	
	let angle2 = randomRangeFloat(1, 7);
	angle2 = randomRange(2) === 0 ? angle2 : -angle2;
	let currentangle2 = 0;
	
	meteor.direction = direction;
	meteor.currentAngle = currentangle2;
	meteor.angle = angle2;
	meteor.meteorMovement = () => {
		let cos = Math.cos(toRadians(meteor.direction));
		let x = meteorSpeed / fps * cos;
		let sin = Math.sin(toRadians(meteor.direction));
		let y = -meteorSpeed / fps * sin;
		meteor.dom.css('top', parseFloat(meteor.dom.css('top')) + y);
		meteor.dom.css('left', parseFloat(meteor.dom.css('left')) + x);
		
		meteor.currentAngle += meteor.angle;
		
		meteor.dom.css('transform', `translate(-50%, -50%) rotate(${meteor.currentAngle}deg)`)
	};
	
	meteor.movementTimer = setInterval(meteor.meteorMovement, delay);
	
	meteors.push(meteor);
}

function removeMeteors() {
	for (let i = 0; i < meteors.length; i++) {
		let left = parseInt(meteors[i].dom.css('left'));
		let top = parseInt(meteors[i].dom.css('top'));
		let right = parseInt(meteors[i].dom.css('right'));
		let bottom = parseInt(meteors[i].dom.css('bottom'));
		
		if (
			right + meteors[i].dom.width() + 5 < 0 ||
			bottom + meteors[i].dom.width() + 5 < 0 ||
			left + meteors[i].dom.width() + 5 < 0 ||
			top + meteors[i].dom.width() + 5 < 0
		) {
			let index = isColliding.indexOf(meteors[i].dom);
			if (index !== -1) {
				isColliding.splice(index, 1);
			}
			
			meteors[i].dom.detach();
			clearInterval(meteors[i].movementTimer);
			meteors.splice(meteors.indexOf(meteors[i]), 1);
		}
	}
}

//#endregion

//#region Collision

function collisionCheck(x1, y1, r1, x2, y2, r2) {
	let dx = x1 - x2;
	let dy = y1 - y2;
	let distance = Math.sqrt(dx * dx + dy * dy);
	if (distance < r1 + r2) {
		return [(x1 + x2) / 2, (y1 + y2) / 2];
	} else {
		return false;
	}
}

let isColliding = [];

function checkAllMeteorsToCollision() {
	meteors.forEach((meteor) => {
		let r1 = player.width() / 2;
		let x1 = parseInt(player.css('left'));
		let y1 = parseInt(player.css('top'));
		let r2 = meteor.dom.width() / 2;
		let x2 = parseInt(meteor.dom.css('left'));
		let y2 = parseInt(meteor.dom.css('top'));
		let collision = collisionCheck(
			x1, y1, r1,
			x2, y2, r2
		);
		
		if (collision === false) return;
		
		if (isColliding.indexOf(meteor.dom) !== -1) return;
		
		let damage;
		if (meteor.dom.hasClass('small')) {
			damage = 10;
		} else if (meteor.dom.hasClass('medium')) {
			damage = 20;
		} else {
			damage = 30;
		}
		
		this.damage(damage);
		
		isColliding.push(meteor.dom);
		
		let x = collision[0];
		let y = collision[1];
		
		let explosion = $('<div class="explosion explosion1"></div>');
		
		explosion.css('left', x);
		explosion.css('top', y);
		
		$('main').append(explosion);
		
		setTimeout(() => {
			explosion.removeClass('explosion1');
			explosion.addClass('explosion2');
			setTimeout(() => explosion.detach(), 170)
		}, 170);
	});
}

//#endregion

//#region Abilities

let shield = {
	dom: $('#shield .filling'),
	bool: false,
	set: setShield,
	remove: removeShield,
	recharge: 5,
	actionTime: 3,
	mp: 15
};
let boost = {
	dom: $('#boost .filling'),
	bool: false,
	set: setBoost,
	remove: removeBoost,
	recharge: 5,
	actionTime: 3,
	mp: 15
};

$(document).on('keydown', (e) => {
	switch (e.keyCode) {
		case 49:
			activateAbility(shield);
			break;
		
		case 50:
			activateAbility(boost);
			break;
	}
});

function activateAbility(ability) {
	if (ability.bool) return;
	
	ability.bool = true;
	
	ability.dom.css('transition', 'none');
	ability.dom.css('top', 0);
	setTimeout(() => ability.dom.css('transition', `top ${ability.recharge}s linear`), 1);
	setTimeout(() => ability.dom.css('top', 100 + '%'), 1);
	
	ability.set();
	
	if (!removemp(ability.mp)) return;
	
	setTimeout(() => {
		ability.bool = false
	}, ability.recharge * 1000);
	
	setTimeout(() => {
		ability.remove()
	}, ability.actionTime * 1000);
}

let mp = $('#mp p');

function removemp(removemp) {
	let newmp = parseInt(mp.text()) - removemp;
	if (newmp > 0) {
		mp.text(newmp);
		mp.css('width', newmp + '%');
		return true;
	} else {
		return false;
	}
}

setInterval(regenmp, 1000);

function regenmp() {
	if (mp.text() === '100') return;
	
	let newmp = parseInt(mp.text()) + 5;
	mp.text(newmp);
	mp.css('width', newmp + '%');
}

setInterval(() => {
	meteorSpeed *= 1.5;
}, 10000);

let shieldOn = $('#shield-on');

function setShield() {
	shieldOn.css('opacity', 1);
}

function removeShield() {
	shieldOn.css('opacity', 0);
}

let normalSpeed;

function setBoost() {
	normalSpeed = playerSpeed;
	playerSpeed = playerSpeedBoost;
}

function removeBoost() {
	playerSpeed = normalSpeed;
}

let hp = $('#hp p');

function damage(damage) {
	if (shield.bool) return;
	
	let newhp = parseInt(hp.text()) - damage;
	if (newhp > 0) {
		hp.text(newhp);
		hp.css('width', newhp + '%');
	} else {
		hp.text(0);
		setTimeout(() => hp.css('background', 'none'), 300);
		gameOver();
	}
}

//#endregion

//#region Game over

function gameOver() {
	// stopAllTimers();
}

//#endregion

//#region Helpers

function randomRange(min, max) {
	if (max === undefined) {
		return Math.floor(Math.random() * min);
	} else {
		return Math.floor(Math.random() * (max - min) + min);
	}
}

function randomRangeFloat(min, max) {
	if (max === undefined) {
		return Math.random() * min;
	} else {
		return Math.random() * (max - min) + min;
	}
}

function toDegrees(angle) {
	return angle * 180 / Math.PI;
}

function toRadians(angle) {
	return angle * Math.PI / 180;
}

//#endregion

// startGame('Romez1990');
