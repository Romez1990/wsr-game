//#region Options

let
	timeScale        = 1,
	fps              = 60,
	delay            = 1000 / (fps * timeScale),
	playerSpeed      = 150, // px/s
	playerSpeedBoost = playerSpeed * 2.75, // px/s
	meteorSpeed      = 300 // px/s
;

//#endregion

//#region Input

let input = $('#start input');

input.val(localStorage.getItem('name'));
input.select();
let warning     = $('#start p');
let startButton = $('#start button');

startButton.on('click', startButtonClick);

function startButtonClick() {
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
}

input.on('keydown', () => hideWarning());

function showWarning(text) {
	warning.fadeIn(300);
	warning.text(text);
}

function hideWarning() {
	if (warning.css('display') === 'none') return;
	
	warning.fadeOut(170);
}

$(document).on('keydown', startKeyDown);

function startKeyDown(e) {
	switch (e.keyCode) {
		case 13: // Enter
			startButtonClick();
			break;
	}
}

//#endregion

//#region Game

let tableScreen   = $('#table-screen');
let hp            = $('#hp p');
let mp            = $('#mp p');
let secondsPassed = 0;
let meteors       = [];

let app      = $('#app');
let player   = $('#player');
let username = $('#username');
let usernameText;

function startGame(name) {
	// Removing
	tableScreen.fadeOut(250);
	for (let i = 0; i < meteors.length; i++) {
		meteors[i].dom.detach();
		clearInterval(meteors[i].movementTimer);
		meteors.splice(i, 1);
	}
	game.removeClass('paused');
	hp.text(100);
	hp.css({
		'width':      '100%',
		'background': 'red'
	});
	mp.text(100);
	mp.css('width', '100%');
	secondsPassed = 0;
	meteorSpeed   = 300;
	$('#time').text('00:00');
	player.css('transform', 'rotate(0deg)');
	
	$('#start').css('display', 'none');
	username.text(name);
	usernameText = name;
	$('#game').css('display', 'block');
	
	meteors.forEach(meteor => {
		meteor.dom.detach();
		clearInterval(meteor.movementTimer);
	});
	meteors = [];
	
	// Setting
	setAllTimers();
	
	player.css({
		'top':  app.height() / 2 - player.height() / 2,
		'left': app.width() / 2 - player.width() / 2
	});
	
	$(document).off('keydown keyup');
	
	$(document).on({
		keydown: gameKeyDown,
		keyup:   gameKeyUp
	});
	
	// damage(90);
}

let timers = [];

function setAllTimers() {
	timers.push(setInterval(setTime, 1000));
	timers.push(setInterval(createMeteor, 215));
	timers.push(setInterval(removeMeteors, delay));
	timers.push(setInterval(checkAllMeteorsToCollision, delay));
	timers.push(setInterval(regenmp, 1000));
	
	meteors.forEach(meteor => {
		meteor.movementTimer = setInterval(meteor.meteorMovement, delay);
	})
}

function stopAllTimers() {
	while (timers.length !== 0) {
		clearInterval(timers[0]);
		timers.splice(0, 1);
	}
	
	meteors.forEach(meteor => {
		clearInterval(meteor.movementTimer);
	});
}

function setTime() {
	++secondsPassed;
	let second = secondsPassed % 60;
	let minute = (secondsPassed - second) / 60;
	second = second.toString().padStart(2, '0');
	minute = minute.toString().padStart(2, '0');
	$('#time').text(minute + ':' + second);
}

//#endregion

//#region Player movement

let one = false;

let
	up    = false,
	down  = false,
	left  = false,
	right = false
;

function move() {
	if (one) return;
	one = true;
	
	let interval = setInterval(() => {
		if (up) {
			player.css('transform', 'rotate(0deg)');
			
			let newTop = parseFloat(player.css('top')) - playerSpeed / fps;
			if (newTop <= 0) return;
			
			player.css('top', newTop);
		} else if (down) {
			player.css('transform', 'rotate(180deg)');
			
			let newTop = parseFloat(player.css('top')) + playerSpeed / fps;
			if (newTop + player.height() >= app.height()) return;
			
			player.css('top', newTop);
		} else if (left) {
			player.css('transform', 'rotate(270deg)');
			
			let newLeft = parseFloat(player.css('left')) - playerSpeed / fps;
			if (newLeft <= 0) return;
			
			player.css('left', newLeft);
		} else if (right) {
			player.css('transform', 'rotate(90deg)');
			
			let newLeft = parseFloat(player.css('left')) + playerSpeed / fps;
			if (newLeft + player.width() >= app.width()) return;
			
			player.css('left', newLeft);
		} else {
			clearInterval(interval);
			one = false;
		}
	}, delay);
}

//#endregion

//#region Meteors

// px takes from css
let meteorTypes = [
	{ size: 'small', px: 30 },
	{ size: 'medium', px: 50 },
	{ size: 'large', px: 90 }
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
	
	let sin    = Math.sin(angle);
	let sinWin = height / hypotenuse;
	let cos    = Math.cos(angle);
	
	let x, y, direction;
	
	let selectedMeteor = meteorTypes[randomRange(3)];
	
	if (toDegrees(angle) >= 0 && toDegrees(angle) <= 135 || toDegrees(angle) > 315 && toDegrees(angle) < 360) {
		if (Math.round(sin * 10000) / 10000 > Math.round(sinWin * 10000) / 10000) {
			// console.log('Top');
			let h = height / sin;
			x     = h * cos;
			y     = -height;
			
			y -= selectedMeteor.px;
			
			direction = randomRangeFloat(180, 360);
		} else if (sin < sinWin) {
			// console.log('Right');
			let h = width / cos;
			x     = width;
			y     = -h * sin;
			
			direction = randomRangeFloat(90, 270);
		} else if (cos > 0) {
			// console.log('Right-top');
			x = width;
			y = -height;
			
			y -= selectedMeteor.px;
			
			direction = randomRangeFloat(180, 270);
		} else if (cos < 0) {
			// console.log('Left-top');
			x = -width;
			y = -height;
			
			x -= selectedMeteor.px;
			y -= selectedMeteor.px;
			
			direction = randomRangeFloat(270, 360);
		}
	} else {
		if (Math.abs(Math.round(sin * 10000)) / 10000 > Math.round(sinWin * 10000) / 10000) {
			// console.log('Bottom');
			let h = height / sin;
			x     = -h * cos;
			y     = height;
			
			direction = randomRangeFloat(0, 180);
		} else if (Math.abs(Math.round(sin * 10000)) / 10000 < Math.abs(Math.round(sinWin * 10000) / 10000)) {
			// console.log('Left');
			let h = width / cos;
			x     = -width;
			y     = h * sin;
			
			x -= selectedMeteor.px;
			
			direction = randomRange(2) === 0 ? randomRangeFloat(270, 360) : randomRangeFloat(90);
		} else if (cos < 0) {
			// console.log('Left-bottom');
			x = -width;
			y = height;
			
			x -= selectedMeteor.px;
			
			direction = randomRangeFloat(0, 90);
		} else {
			// console.log('Right-bottom');
			x = width;
			y = height;
			
			direction = randomRangeFloat(90, 180);
		}
	}
	
	let size = selectedMeteor.size;
	
	let meteor = {
		dom: $(`<div class="meteor ${ size }"></div>`)
	};
	
	meteor.dom.css({
		'left': app.width() / 2 + x,
		'top':  app.height() / 2 + y
	});
	
	$('#meteors').append(meteor.dom);
	
	//#endregion
	
	//#region Rotation
	
	let angle2        = randomRangeFloat(1, 7);
	angle2            = randomRange(2) === 0 ? angle2 : -angle2;
	let currentangle2 = 0;
	
	meteor.direction      = direction;
	meteor.currentAngle   = currentangle2;
	meteor.angle          = angle2;
	meteor.meteorMovement = () => {
		let cos = Math.cos(toRadians(meteor.direction));
		let x   = meteorSpeed / fps * cos;
		let sin = Math.sin(toRadians(meteor.direction));
		let y   = -meteorSpeed / fps * sin;
		meteor.dom.css({
			'top':  parseFloat(meteor.dom.css('top')) + y,
			'left': parseFloat(meteor.dom.css('left')) + x
		});
		
		meteor.currentAngle += meteor.angle;
		
		meteor.dom.css('transform', `translate(-50%, -50%) rotate(${ meteor.currentAngle }deg)`)
	};
	
	meteor.movementTimer = setInterval(meteor.meteorMovement, delay);
	
	meteors.push(meteor);
	
	//#endregion
}

function removeMeteors() {
	for (let i = 0; i < meteors.length; i++) {
		let meteorPosition = meteors[i].dom.css(['left', 'top', 'right', 'bottom']);
		
		if (
			parseInt(meteorPosition.right) + meteors[i].dom.width() + 5 < 0 ||
			parseInt(meteorPosition.bottom) + meteors[i].dom.width() + 5 < 0 ||
			parseInt(meteorPosition.left) + meteors[i].dom.width() + 5 < 0 ||
			parseInt(meteorPosition.top) + meteors[i].dom.width() + 5 < 0
		) {
			meteors[i].dom.detach();
			clearInterval(meteors[i].movementTimer);
			meteors.splice(meteors.indexOf(meteors[i]), 1);
		}
	}
}

//#endregion

//#region Abilities

let shield = {
	dom:        $('#shield .filling'),
	available:  true,
	enable:     false,
	set:        setShield,
	remove:     removeShield,
	recharge:   15,
	actionTime: 5,
	mp:         15
};
let boost  = {
	dom:        $('#boost .filling'),
	available:  true,
	enable:     false,
	set:        setBoost,
	remove:     removeBoost,
	recharge:   15,
	actionTime: 5,
	mp:         15
};

function activateAbility(ability) {
	if (!ability.available) return;
	
	ability.available = false;
	ability.enable    = true;
	
	ability.dom.css({
		'transition': 'none',
		'top':        0
	});
	setTimeout(() => ability.dom.css('transition', `top ${ ability.recharge }s linear`), 1);
	setTimeout(() => ability.dom.css('top', 100 + '%'), 1);
	
	ability.set();
	
	if (!removemp(ability.mp)) return;
	
	setTimeout(() => {
		ability.available = true;
	}, ability.recharge * 1000);
	
	setTimeout(() => {
		ability.remove();
		ability.enable = false;
	}, ability.actionTime * 1000);
}

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

function regenmp() {
	if (mp.text() === '100') return;
	
	let newmp = parseInt(mp.text()) + 5;
	mp.text(newmp);
	mp.css('width', newmp + '%');
}

setInterval(() => {
	if (meteorSpeed > 3000) return;
	
	meteorSpeed *= 1.5;
}, 30000);

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

function damage(damage) {
	if (shield.enable) return;
	
	let newhp = parseInt(hp.text()) - damage;
	if (newhp > 0) {
		hp.text(newhp);
		hp.css('width', newhp + '%');
	} else {
		hp.text(0);
		hp.css('width', 0);
		setTimeout(() => {
			hp.css('background', 'none');
			gameOver();
		}, 270);
	}
}

//#endregion

//#region Collision

function collisionCheck(x1, y1, r1, x2, y2, r2) {
	let dx       = x1 - x2;
	let dy       = y1 - y2;
	let distance = Math.sqrt(dx * dx + dy * dy);
	if (distance < r1 + r2) {
		return [(x1 + x2) / 2, (y1 + y2) / 2];
	} else {
		return false;
	}
}

function checkAllMeteorsToCollision() {
	meteors.forEach(meteor => {
		let r1;
		
		if (!shield.enable) r1 = player.width() / 2;
		else r1 = $('#shield-on').width() / 2;
		
		let x1        = parseInt(player.css('left')) + r1;
		let y1        = parseInt(player.css('top')) + r1;
		let r2        = meteor.dom.width() / 2;
		let x2        = parseInt(meteor.dom.css('left')) + r2;
		let y2        = parseInt(meteor.dom.css('top')) + r2;
		let collision = collisionCheck(
			x1, y1, r1,
			x2, y2, r2
		);
		
		if (collision === false) return;
		
		let damage;
		if (meteor.dom.hasClass('small')) {
			damage = 10;
		} else if (meteor.dom.hasClass('medium')) {
			damage = 20;
		} else {
			damage = 30;
		}
		
		if (!shield.enable) this.damage(damage);
		
		meteor.dom.detach();
		let index = meteors.indexOf(meteor);
		if (index !== -1) {
			meteors.splice(index, 1);
		}
		clearInterval(meteor.movementTimer);
		for (let key in meteor) {
			delete meteor[key];
		}
		
		let x = collision[0];
		let y = collision[1];
		
		let explosion = $('<div class="explosion explosion1"></div>');
		
		explosion.css({
			'left': x,
			'top':  y
		});
		
		$('main').append(explosion);
		
		setTimeout(() => {
			explosion.removeClass('explosion1');
			explosion.addClass('explosion2');
			setTimeout(() => explosion.detach(), 170)
		}, 170);
	});
}

//#endregion

//#region Pause

let isPause     = false;
let pauseScreen = $('#pause-screen');
let game        = $('#game');

function pause() {
	if (isPause) {
		setAllTimers();
		pauseScreen.fadeOut(500);
	} else {
		stopAllTimers();
		pauseScreen.fadeIn(500);
	}
	
	game.toggleClass('paused');
	
	up = down = left = right = false;
	
	isPause = !isPause;
}

//#endregion

//#region Key pressing

function gameKeyDown(e) {
	switch (e.keyCode) {
		case 27: // Esc
			pause();
			break;
	}
	
	if (isPause) return;
	
	switch (e.keyCode) {
		case 49: // 1
		case 97: // 1
			activateAbility(shield);
			break;
		
		case 50: // 2
		case 98: // 2
			activateAbility(boost);
			break;
	}
	
	if (up || down || left || right) return;
	
	switch (e.keyCode) {
		case 38: // Up
		case 87: // W
			up = true;
			move();
			break;
		case 40: // Down
		case 83: // S
			down = true;
			move();
			break;
		case 37: // Left
		case 65: // A
			left = true;
			move();
			break;
		case 39: // Right
		case 68: // D
			right = true;
			move();
			break;
	}
}

function gameKeyUp(e) {
	if (isPause) return;
	
	switch (e.keyCode) {
		case 38: // Up
		case 87: // W
			up = false;
			break;
		case 40: // Down
		case 83: // S
			down = false;
			break;
		case 37: // Left
		case 65: // A
			left = false;
			break;
		case 39: // Right
		case 68: // D
			right = false;
			break;
	}
}

//#endregion

//#region Game over

let tableWrapper = $('#table-wrapper');

function gameOver() {
	stopAllTimers();
	up = down = left = right = false;
	game.toggleClass('paused');
	$(document).off('keydown keyup');
	
	$.ajax({
		url:      'php/scoreboard.php',
		method:   'POST',
		dataType: 'json',
		data:     {
			username: usernameText,
			score:    secondsPassed
		},
		success:  setTable,
		error:    error => {
			console.log(error);
			
			tableScreen.fadeIn(250);
			
			tableWrapper.empty();
			
			let table = $('<table></table>');
			tableWrapper.append(table);
			
			table.append('<tr><th>№</th><th>Nickname</th><th>Score</th><th>Datetime</th></tr>');
			
			let row = $('<tr></tr>');
			row.append($('<td></td>').text(1));
			row.append($('<td></td>').text(usernameText));
			row.append($('<td></td>').text(secondsPassed));
			row.append($('<td></td>').text(new Date()));
			row.attr('id', 'current');
			table.append(row);
			table.append($('<tr>An error has occurred while displaying the results</tr>'));
		}
	});
}

function setTable(topRecords) {
	tableScreen.fadeIn(250);
	
	tableWrapper.empty();
	
	let table = $('<table></table>');
	tableWrapper.append(table);
	
	table.append('<tr><th>№</th><th>Nickname</th><th>Score</th><th>Datetime</th></tr>');
	
	let currentFound = false;
	for (let i = 0; i < topRecords.length; i++) {
		let row = $('<tr></tr>');
		
		row.append($('<td></td>').text(topRecords[i]['position']));
		row.append($('<td></td>').text(topRecords[i]['nickname']));
		row.append($('<td></td>').text(topRecords[i]['score']));
		const date = new Date((parseInt(topRecords[i]['datetime']) - new Date().getTimezoneOffset() * 60) * 1000);
		row.append($('<td></td>').text(date.toLocaleDateString(undefined, { day: '2-digit' }) + '-' + date.toLocaleDateString(undefined, { month: '2-digit' }) + '-' + date.toLocaleDateString(undefined, { year: '2-digit' })));
		
		if (topRecords[i].username === usernameText && topRecords[i].score == secondsPassed && !currentFound) {
			row.attr('id', 'current');
			currentFound = true;
		}
		
		if (topRecords[i].position > 10) {
			table.append($('<tr><td>...</td></tr>'));
		}
		
		table.append(row);
	}
}

let startOver = $('#table-screen button');

startOver.on('click', () => startGame(usernameText));

//#endregion

//#region Functions

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

//#region Adaptivity

let gameWidth  = 933;
let gameHeight = 700;

function adapt() {
	let width  = $(window).width();
	let height = $(window).height();
	
	if (width / height < gameWidth / gameHeight) {
		app.css('transform', 'translate(-50%, -50%) scale(' + width / gameWidth + ')');
	} else {
		app.css('transform', 'translate(-50%, -50%) scale(' + height / gameHeight + ')');
	}
}

$(window).on('resize', adapt);
adapt();

//#endregion

// Debug:

// startGame('Romez1990');
// secondsPassed = 1;
// gameOver();
