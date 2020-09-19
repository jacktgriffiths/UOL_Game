/*
Sound: I think I found sound fairly easy to implement as it is somewhat simple, the main issues that I came across was the sounds looping so I had to implement some, what I would call, ‘hot fixes’ to solve these as I am sure there is a more permanent way to implement them. I have designed some games before in Java but I have never used JavaScript nor ever implemented sound so this was something completely new to me and it was interesting to see how much additional sound really changes the experience and dynamic of the game. Overall this has been my first experience with using JavaScript and I really enjoyed getting to understand the language and syntax.

Platforms: After learning the factory pattern I found this super useful when implementing the platforms. I wanted the platforms to look somewhat Mario-esque hence my designing and colour scheme of them. The main refreshing thing about using the factory pattern is that all of my previous development experience has been in object orientated languages so being able to use classes and objects really helped with my understanding on how to use them and implement them into my code. I found the factory patter to be a really powerful way of implementing multiple complex objects and this will definitely shape the way I develop in JavaScript in the future and going forwards throughout this degree. I had actually attempted to implement platforms before knowing about the factory patter and although they worked, there was a lot of duplicate code that really wasn’t very elegant, the factory pattern really changed this.

Enemies: I know we were only meant to do two of the extensions, but I felt like my game would have been really incomplete without them so I decided to implement them as well. I found implementing them again quite straight forward but with my design (caterpillar inspired) they really didn’t look correct when moving back and forward. To fix this I implemented that depending on whether the increment was positive or negative the position of the head would move and this somewhat small change really made a massive difference in the way the game looked and felt; it made it feel like the enemies were actually coming towards you which I really liked.
*/
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var armLength = 18;
var armWidth = 6;
var legLength = 20;
var legWidth = 8;
var bodyLength = 30;
var bodyWidth = 20;
var trees_x;
var treePos_y;
var clouds;
var mountains;
var canyons;
var collectables;
var platforms;
var enemies;
var gameScore;
var flagpole;
var timesReached;
var deathSound;
var jumpSound;
var fallSound;
var gameOverSound;
var winSound;
var yaySound;
var lives;
var soundPlays; //used to ensure game_over sound only plays once.

function preload()
{
	soundFormats('wav', 'mp3');
	deathSound = loadSound('sounds/doh-enemy-death.wav');
	jumpSound = loadSound('sounds/jump.wav');
	gameOverSound = loadSound('sounds/game-over.wav');
	fallSound = loadSound('sounds/nooo-falling-death.wav');
	winSound = loadSound('sounds/win.mp3');
	yaySound = loadSound('sounds/yay.wav');

	deathSound.setVolume(0.1);
	jumpSound.setVolume(0.1);
	gameOverSound.setVolume(0.1);
	fallSound.setVolume(0.1);
	winSound.setVolume(0.1);
	yaySound.setVolume(0.1);
}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3 / 4;
	lives = 3;
	startGame();
	soundPlays = 1;
}

function draw()
{
	background(100, 155, 255); // fill the sky blue
	noStroke();
	fill(0, 155, 0);
	rect(0, floorPos_y, width, height / 4); // draw some green ground
	push();
	translate(scrollPos, 0);
	gameChar_world_x = gameChar_x - scrollPos;

	// Draw background items
	drawClouds();
	drawMountains();
	drawTrees();

	// Draw all of the platforms
	for (var i = 0; i < platforms.length; i++)
	{
		platforms[i].draw();
	}

	// Draw the canyons
	for (var i = 0; i < canyons.length; i++)
	{
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
	}

	// Draw the collectable items
	for (var i = 0; i < collectables.length; i++)
	{
		if (!collectables[i].isFound)
		{
			drawCollectable(collectables[i]);
			checkCollectable(collectables[i]);
		}
	}

	// Draw the flagpole
	renderFlagpole();
	for (var i = 0; i < enemies.length; i++)
	{
		enemies[i].draw();
		var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
		if (isContact)
		{
			deathSound.play();
			if (lives > 0)
			{
				lives--;
				startGame();
				break;
			}
		}
	}

	pop();
	drawLives();
	drawGameChar()
	checkPlayerDie();
	fill(255);
	noStroke();
	textSize(15);
	text("Score: " + gameScore, 20, 20);

	if (lives < 1)
	{
		if (soundPlays > 0)
		{
			gameOverSound.play();
			soundPlays--;
		}

		fill(255, 253, 0)
		textSize(20);
		text("GAME OVER - PRESS SPACE TO CONTINUE", width / 2, height / 2);
		return;
	}

	if (flagpole.isReached)
	{
		winSound.play();
		fill(255, 253, 0)
		textSize(20);
		text("LEVEL COMPLETE!", width / 2, height / 2);
		return;
	}

	if (!isPlummeting)
	{
		// Logic to make the game character move or the background scroll.
		if (isLeft)
		{
			if (gameChar_x > width * 0.2)
			{
				gameChar_x -= 5;
			}
			else
			{
				scrollPos += 5;
			}
		}

		if (isRight)
		{
			if (gameChar_x < width * 0.8)
			{
				gameChar_x += 5;
			}
			else
			{
				scrollPos -= 5; // negative for moving against the background
			}
		}
	}

	// Logic to make the game character rise and fall.
	if (gameChar_y < floorPos_y)
	{
		var isContact = false;
		for (var i = 0; i < platforms.length; i++)
		{
			if (platforms[i].checkContact(gameChar_world_x, gameChar_y))
			{
				isContact = true;
				break;
			}
		}

		if (!isContact)
		{
			isFalling = true;
			gameChar_y += 5;
		}
		else
		{
			isFalling = false;
		}

	}
	else
	{
		isFalling = false;
	}

	if (isPlummeting == true)
	{
		gameChar_y += 10;
	}

	if (!flagpole.isReached)
	{
		checkFlagpole();
	}
}

// ---------------------
// Key control functions
// ---------------------
function keyPressed()
{

	// if statements to control the animation of the character when
	// keys are pressed.
	if (keyCode == 37)
	{
		isLeft = true;

	}
	else if (keyCode == 39)
	{
		isRight = true;

	}
	else if (keyCode == 32)
	{
		jumpSound.play();

		if (!isFalling)
		{
			gameChar_y -= 200;
		}
	}
}

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.
	if (keyCode == 37)
	{
		isLeft = false;
	}
	else if (keyCode == 39)
	{
		isRight = false;
	}

}
// ------------------------------
// Game character render function
// ------------------------------
// Function to draw the game character.
function drawGameChar()
{
	if (isLeft && isFalling)
	{
		// add your jumping-left code
		//head
		fill(200, 150, 150);
		ellipse(gameChar_x, gameChar_y - 60, 22);
		fill(255, 255, 0);
		ellipse(gameChar_x + 2, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x + 7, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x + 10, gameChar_y - 67, 4, 5);
		ellipse(gameChar_x - 2, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x - 7, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x - 10, gameChar_y - 67, 4, 5);
		fill(0);
		ellipse(gameChar_x - 3, gameChar_y - 62, 3, 3);
		//body 
		fill(255, 200, 0);
		rect(gameChar_x, gameChar_y - 50, bodyWidth - 10, bodyLength);
		fill(255, 255, 255);
		rect(gameChar_x, gameChar_y - 35, bodyWidth / 2, bodyLength - 20);
		//leg right
		fill(0);
		rect(gameChar_x - 10, gameChar_y - 25, legLength, legWidth);
		//arm right
		rect(gameChar_x - 10, gameChar_y - 50, armLength, armWidth);
	}
	else if (isRight && isFalling)
	{
		// add your jumping-right code
		//head
		fill(200, 150, 150);
		ellipse(gameChar_x, gameChar_y - 60, 22);
		fill(0);
		ellipse(gameChar_x + 3, gameChar_y - 62, 3, 3);
		fill(255, 255, 0);
		ellipse(gameChar_x + 2, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x + 7, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x + 10, gameChar_y - 67, 4, 5);
		ellipse(gameChar_x - 2, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x - 7, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x - 10, gameChar_y - 67, 4, 5);
		//body
		fill(255, 200, 0);
		rect(gameChar_x - 10, gameChar_y - 50, bodyWidth - 10, bodyLength);
		fill(255, 255, 255);
		rect(gameChar_x - 10, gameChar_y - 35, bodyWidth / 2, bodyLength - 20);
		//leg left
		fill(0);
		rect(gameChar_x - 10, gameChar_y - 25, legLength, legWidth);
		//arm left
		rect(gameChar_x - 8, gameChar_y - 50, armLength, armWidth);
	}
	else if (isLeft)
	{
		// add your walking left code
		//head
		fill(200, 150, 150);
		ellipse(gameChar_x, gameChar_y - 60, 22);
		fill(255, 255, 0);
		ellipse(gameChar_x + 2, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x + 7, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x + 10, gameChar_y - 67, 4, 5);
		ellipse(gameChar_x - 2, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x - 7, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x - 10, gameChar_y - 67, 4, 5);
		fill(0);
		ellipse(gameChar_x - 3, gameChar_y - 62, 3, 3);
		//body 
		fill(255, 200, 0);
		rect(gameChar_x, gameChar_y - 50, bodyWidth - 10, bodyLength);
		fill(255, 255, 255);
		rect(gameChar_x, gameChar_y - 35, bodyWidth / 2, bodyLength - 20);
		//leg right
		fill(0);
		rect(gameChar_x + 2, gameChar_y - 20, legWidth, legLength);
		//arm right
		rect(gameChar_x + 2, gameChar_y - 50, armWidth, armLength);
	}
	else if (isRight)
	{
		// add your walking right code
		//head
		fill(200, 150, 150);
		ellipse(gameChar_x, gameChar_y - 60, 22);
		fill(0);
		ellipse(gameChar_x + 3, gameChar_y - 62, 3, 3);
		fill(255, 255, 0);
		ellipse(gameChar_x + 2, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x + 7, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x + 10, gameChar_y - 67, 4, 5);
		ellipse(gameChar_x - 2, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x - 7, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x - 10, gameChar_y - 67, 4, 5);
		//body
		fill(255, 200, 0);
		rect(gameChar_x - 10, gameChar_y - 50, bodyWidth - 10, bodyLength);
		fill(255, 255, 255);
		rect(gameChar_x - 10, gameChar_y - 35, bodyWidth / 2, bodyLength - 20);
		//leg left
		fill(0);
		rect(gameChar_x - 10, gameChar_y - 20, legWidth, legLength);
		//arm left
		rect(gameChar_x - 8, gameChar_y - 50, armWidth, armLength);
	}
	else if (isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
		//head
		fill(200, 150, 150);
		ellipse(gameChar_x, gameChar_y - 60, 22);
		fill(0);
		ellipse(gameChar_x - 3, gameChar_y - 62, 3, 3);
		ellipse(gameChar_x + 3, gameChar_y - 62, 3, 3);
		ellipse(gameChar_x, gameChar_y - 56, 10, 2);
		ellipse(gameChar_x, gameChar_y - 56, 7, 5);
		fill(255, 255, 0);
		ellipse(gameChar_x + 2, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x + 7, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x + 10, gameChar_y - 67, 4, 5);
		ellipse(gameChar_x - 2, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x - 7, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x - 10, gameChar_y - 67, 4, 5);
		//body
		fill(255, 200, 0);
		rect(gameChar_x - 10, gameChar_y - 50, bodyWidth, bodyLength);
		fill(255, 255, 255);
		rect(gameChar_x - 10, gameChar_y - 35, bodyWidth, bodyLength - 20);
		//leg left
		fill(0);
		rect(gameChar_x - 10, gameChar_y - 25, legWidth, legLength - 10);
		//leg right
		fill(0);
		rect(gameChar_x + 2, gameChar_y - 25, legWidth, legLength - 10);
		//arm left
		rect(gameChar_x - 12, gameChar_y - 50, armWidth, armLength - 10);
		//arm right
		rect(gameChar_x + 6, gameChar_y - 50, armWidth, armLength - 10);
	}
	else
	{
		// add your standing front facing code
		//head
		fill(200, 150, 150);
		ellipse(gameChar_x, gameChar_y - 60, 22);
		fill(0);
		ellipse(gameChar_x - 3, gameChar_y - 62, 3, 3);
		ellipse(gameChar_x + 3, gameChar_y - 62, 3, 3);
		ellipse(gameChar_x, gameChar_y - 56, 10, 2);
		fill(255, 255, 0);
		ellipse(gameChar_x + 2, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x + 7, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x + 10, gameChar_y - 67, 4, 5);
		ellipse(gameChar_x - 2, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x - 7, gameChar_y - 70, 7, 5);
		ellipse(gameChar_x - 10, gameChar_y - 67, 4, 5);
		//body
		fill(255, 200, 0);
		rect(gameChar_x - 10, gameChar_y - 50, bodyWidth, bodyLength);
		fill(255, 255, 255);
		rect(gameChar_x - 10, gameChar_y - 35, bodyWidth, bodyLength - 20);
		//leg left
		fill(0);
		rect(gameChar_x - 10, gameChar_y - 20, legWidth, legLength);
		rect(gameChar_x - 12, gameChar_y - 5, 2, 5);
		//leg right
		fill(0);
		rect(gameChar_x + 2, gameChar_y - 20, legWidth, legLength);
		rect(gameChar_x + 10, gameChar_y - 5, 2, 5);
		//arm left
		rect(gameChar_x - 12, gameChar_y - 50, armWidth, armLength);
		//arm right
		rect(gameChar_x + 6, gameChar_y - 50, armWidth, armLength);
	}
}
// ---------------------------
// Background render functions
// ---------------------------
// Function to draw cloud objects.
function drawClouds()
{
	for (var i = 0; i < clouds.length; i++)
	{
		fill(255, 255, 255);
		ellipse(clouds[i].x_pos, clouds[i].y_pos, 0.60 * clouds[i].size, 0.60 * clouds[i].size);
		ellipse(clouds[i].x_pos - 40 * clouds[i].size / 100, clouds[i].y_pos - 10 * clouds[i].size / 100, 0.80 * clouds[i].size, 0.80 * clouds[i].size);
		ellipse(clouds[i].x_pos - 80 * clouds[i].size / 100, clouds[i].y_pos - 5 * clouds[i].size / 100, 0.70 * clouds[i].size, 0.70 * clouds[i].size);
		ellipse(clouds[i].x_pos - 120 * clouds[i].size / 100, clouds[i].y_pos, 0.60 * clouds[i].size, 0.60 * clouds[i].size);
	}
}
// Function to draw mountains objects.
function drawMountains()
{
	for (var i = 0; i < mountains.length; i++)
	{
		fill(113, 126, 142); //grey
		triangle(mountains[i].x_pos, floorPos_y - 176 * mountains[i].size / 100, mountains[i].x_pos - 100 * mountains[i].size / 100, floorPos_y, mountains[i].x_pos + 100 * mountains[i].size / 100, floorPos_y);
		triangle(mountains[i].x_pos + 80 * mountains[i].size / 100, floorPos_y - 142 * mountains[i].size / 100, mountains[i].x_pos - 20 * mountains[i].size / 100, floorPos_y, mountains[i].x_pos + 180 * mountains[i].size / 100, floorPos_y);
		//mountains[i] caps
		fill(255, 255, 255);
		triangle(mountains[i].x_pos, floorPos_y - 176 * mountains[i].size / 100, mountains[i].x_pos - 25 * mountains[i].size / 100, floorPos_y - 132 * mountains[i].size / 100, mountains[i].x_pos + 25 * mountains[i].size / 100, floorPos_y - 132 * mountains[i].size / 100);
		triangle(mountains[i].x_pos + 80 * mountains[i].size / 100, floorPos_y - 142 * mountains[i].size / 100, mountains[i].x_pos + 73 * mountains[i].size / 100, floorPos_y - 132 * mountains[i].size / 100, mountains[i].x_pos + 87 * mountains[i].size / 100, floorPos_y - 132 * mountains[i].size / 100);
	}
}
// Function to draw trees objects.
function drawTrees()
{
	for (var i = 0; i < trees_x.length; i++)
	{
		//tree trunk 
		fill(120, 100, 40);
		treePos_y = floorPos_y - 150;
		rect(trees_x[i], treePos_y, 30, 150);
		//branches 
		fill(0, 155, 0);
		ellipse(trees_x[i] - 30, treePos_y + 20, 60, 60);
		ellipse(trees_x[i], treePos_y - 20, 70, 70);
		ellipse(trees_x[i] + 50, treePos_y - 20, 70, 70);
		ellipse(trees_x[i] + 25, treePos_y + 30, 70, 70);
		//apples
		fill(255, 0, 0);
		ellipse(trees_x[i] + 25, treePos_y + 30, 10, 10);
		ellipse(trees_x[i] + 5, treePos_y + 38, 10, 10);
		ellipse(trees_x[i] + 5, treePos_y - 20, 10, 10);
		ellipse(trees_x[i] + 35, treePos_y - 35, 10, 10);
		ellipse(trees_x[i] - 20, treePos_y + 10, 10, 10);
		ellipse(trees_x[i] + 30, treePos_y + 5, 10, 10);
	}
}
// ---------------------------------
// Canyon render and check functions
// ---------------------------------
// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
	noStroke();
	fill(139, 69, 19);
	triangle(t_canyon.x_pos, 580, t_canyon.x_pos - t_canyon.width, 432, t_canyon.x_pos + t_canyon.width, 432);
	fill(100, 155, 255);
	triangle(t_canyon.x_pos, 570, t_canyon.x_pos + 10 - t_canyon.width, 432, t_canyon.x_pos - 10 + t_canyon.width, 432);
}
// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{
	if (gameChar_world_x > (t_canyon.x_pos - (t_canyon.width / 2)) && gameChar_world_x < (t_canyon.x_pos + (t_canyon.width / 2)) && gameChar_y >= floorPos_y)
	{
		isPlummeting = true;
	}
	if (gameChar_y < floorPos_y)
	{
		isPlummeting = false;
	}
}
// ----------------------------------
// Collectable items render and check functions
// ----------------------------------
// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
	if (t_collectable.isFound == false)
	{
		fill(255, 0, 255);
		ellipse(t_collectable.x_pos, t_collectable.y_pos, 0.2 * t_collectable.size, 0.2 * t_collectable.size);
		fill(255, 215, 0);
		ellipse(t_collectable.x_pos, t_collectable.y_pos + 0.30 * t_collectable.size, 0.48 * t_collectable.size, 0.48 * t_collectable.size);
		fill(100, 155, 255);
		ellipse(t_collectable.x_pos, t_collectable.y_pos + 0.30 * t_collectable.size, 0.32 * t_collectable.size, 0.32 * t_collectable.size);
	}
}
// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
	if (dist(t_collectable.x_pos, t_collectable.y_pos, gameChar_world_x, gameChar_y) < 29)
	{
		t_collectable.isFound = true;
		gameScore++;
		yaySound.play();
	}
}

function renderFlagpole()
{
	push();
	strokeWeight(5);
	stroke(180);
	line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
	noStroke();
	fill(255, 0, 255);
	var counter = 0;
	if (flagpole.isReached)
	{
		rect(flagpole.x_pos, floorPos_y - 250, 50, 50);
	}
	else
	{
		rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
	}
	pop();
}

function checkFlagpole()
{
	var dist = abs(gameChar_world_x - flagpole.x_pos);
	if (dist < 15)
	{
		flagpole.isReached = true;
	}
}

function checkPlayerDie()
{
	if (gameChar_y > height)
	{
		fallSound.play();
		lives--;
		if (lives > 0)
		{
			startGame();
		}
	}
}

function startGame()
{
	gameScore = 0;
	gameChar_x = width / 2;
	gameChar_y = floorPos_y;
	// Variable to control the background scrolling.
	scrollPos = 0;
	enemies = [];
	enemies.push(new Enemy(100, floorPos_y - 10, 100));
	enemies.push(new Enemy(700, floorPos_y - 10, 100));
	platforms = [];
	platforms.push(createPlatforms(20, floorPos_y - 90, 50));
	platforms.push(createPlatforms(130, floorPos_y - 160, 60));
	platforms.push(createPlatforms(240, floorPos_y - 240, 125));
	platforms.push(createPlatforms(800, floorPos_y - 100, 125));
	platforms.push(createPlatforms(1220, floorPos_y - 150, 125));
	trees_x = [100, 400, 680, 1090, 1500, 1700, -300, -900, -1200];
	canyons = [
	{
		x_pos: 300,
		width: 100
	},
	{
		x_pos: -720,
		width: 100
	},
	{
		x_pos: 1900,
		width: 100
	}];
	collectables = [
	{
		x_pos: 80,
		y_pos: floorPos_y - 27,
		size: 50,
		isFound: false
	},
	{
		x_pos: 300,
		y_pos: floorPos_y - 70,
		size: 50,
		isFound: false
	},
	{
		x_pos: 980,
		y_pos: floorPos_y - 27,
		size: 50,
		isFound: false
	},
	{
		x_pos: -620,
		y_pos: floorPos_y - 27,
		size: 50,
		isFound: false
	},
	{
		x_pos: 1670,
		y_pos: floorPos_y - 27,
		size: 50,
		isFound: false
	},
	{
		x_pos: -200,
		y_pos: floorPos_y - 27,
		size: 50,
		isFound: false
	},
	{
		x_pos: 302,
		y_pos: floorPos_y - 267,
		size: 50,
		isFound: false
	}];
	clouds = [
	{
		x_pos: 240,
		y_pos: 200,
		size: 50
	},
	{
		x_pos: 200,
		y_pos: 80,
		size: 100
	},
	{
		x_pos: 400,
		y_pos: 160,
		size: 80
	},
	{
		x_pos: 700,
		y_pos: 100,
		size: 120
	},
	{
		x_pos: 950,
		y_pos: 180,
		size: 150
	},
	{
		x_pos: 240 + 1024,
		y_pos: 200,
		size: 50
	},
	{
		x_pos: 200 + 1024,
		y_pos: 80,
		size: 100
	},
	{
		x_pos: 400 + 1024,
		y_pos: 160,
		size: 80
	},
	{
		x_pos: 700 + 1024,
		y_pos: 100,
		size: 120
	},
	{
		x_pos: 950 + 1024,
		y_pos: 180,
		size: 150
	},
	{
		x_pos: 240 - 1024,
		y_pos: 200,
		size: 50
	},
	{
		x_pos: 200 - 1024,
		y_pos: 80,
		size: 100
	},
	{
		x_pos: 400 - 1024,
		y_pos: 160,
		size: 80
	},
	{
		x_pos: 700 - 1024,
		y_pos: 100,
		size: 120
	},
	{
		x_pos: 950 - 1024,
		y_pos: 180,
		size: 150
	}];
	mountains = [
	{
		x_pos: 530,
		size: 130
	},
	{
		x_pos: 750,
		size: 100
	},
	{
		x_pos: 1300,
		size: 100
	},
	{
		x_pos: -500,
		size: 100
	},
	{
		x_pos: -1000,
		size: 100
	}];
	flagpole = {
		isReached: false,
		x_pos: 2200
	};
	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
}

function drawLives()
{
	fill(255, 253, 0)
	textSize(15);
	text("Lives: ", 240, 20);
	for (var i = 0; i < lives; i++)
	{
		ellipse(300 + 40 * i, 20, 30);
	}
}
// Function that creates each of the platforms
function createPlatforms(x, y, length)
{
	var p = {
		x: x,
		y: y,
		length: length,
		draw: function()
		{
			fill(34, 139, 34);
			rect(this.x, this.y, this.length, 10, 10);
			fill(205, 133, 63);
			rect(this.x + 5, this.y + 10, this.length - 10, 15);
		},
		checkContact: function(gc_x, gc_y)
		{
			if (gc_x > this.x && gc_x < this.x + this.length)
			{
				var d = this.y - gc_y;
				if (d >= 0 && d < 5)
				{
					return true;
				}
			}
			return false;
		}
	}
	return p;
}
// Function to create each enemy
function Enemy(x, y, range)
{
	this.x = x;
	this.y = y;
	this.range = range;
	this.currentX = x;
	this.inc = 1;
	this.update = function()
	{
		this.currentX += this.inc;
		if (this.currentX >= this.x + this.range)
		{
			this.inc = -1;
		}
		else if (this.currentX <= this.x)
		{
			this.inc = 1;
		}
	}
	this.draw = function()
	{
		this.update();
		if (this.inc == -1)
		{ //this code changes the head position of the enemy so it always faces the way it walks
			fill(184, 92, 0);
			ellipse(this.currentX + 10, this.y + 5, 5, 10);
			ellipse(this.currentX, this.y + 5, 5, 10);
			ellipse(this.currentX - 10, this.y + 5, 5, 10);
			ellipse(this.currentX - 20, this.y + 5, 5, 10);
			fill(0, 255, 0);
			ellipse(this.currentX + 10, this.y + 1, 12, 12);
			ellipse(this.currentX, this.y, 12, 12);
			ellipse(this.currentX - 10, this.y - 1, 12, 12);
			ellipse(this.currentX - 20, this.y - 1, 12, 12);
			ellipse(this.currentX - 27, this.y - 10, 15, 15);
			fill(0);
			ellipse(this.currentX - 29, this.y - 13, 5, 5);
			ellipse(this.currentX - 25, this.y - 18, 3, 7);
			ellipse(this.currentX - 24, this.y - 18, 3, 7);
		}
		else
		{
			fill(184, 92, 0);
			ellipse(this.currentX + 10, this.y + 5, 5, 10);
			ellipse(this.currentX, this.y + 5, 5, 10);
			ellipse(this.currentX - 10, this.y + 5, 5, 10);
			ellipse(this.currentX - 20, this.y + 5, 5, 10);
			fill(0, 255, 0);
			ellipse(this.currentX + 10, this.y + 1, 12, 12);
			ellipse(this.currentX, this.y, 12, 12);
			ellipse(this.currentX - 10, this.y - 1, 12, 12);
			ellipse(this.currentX - 20, this.y - 1, 12, 12);
			ellipse(this.currentX + 18, this.y - 7, 15, 15);
			fill(0);
			ellipse(this.currentX + 20, this.y - 10, 5, 5);
			ellipse(this.currentX + 16, this.y - 16, 3, 7);
			ellipse(this.currentX + 18, this.y - 16, 3, 7);
		}
	}
	this.checkContact = function(gc_x, gc_y)
	{
		var d = dist(gc_x, gc_y, this.currentX, this.y);
		if (d < 20)
		{
			return true;
		}
		return false;
	}
}