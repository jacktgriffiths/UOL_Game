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

var lives;
var soundPlays; //used to ensure game over sound only plays once.

function preload() {
    soundFormats('wav','mp3');
    
    deathSound = loadSound('sounds/doh-enemy-death.wav');
    jumpSound = loadSound('sounds/jump.wav');
    gameOverSound = loadSound('sounds/game-over.wav');
    fallSound = loadSound('sounds/nooo-falling-death.wav');
    winSound = loadSound('sounds/win.mp3');
    
    deathSound.setVolume(0.5);
    jumpSound.setVolume(0.5);
    gameOverSound.setVolume(0.5);
    fallSound.setVolume(0.5);
    winSound.setVolume(0.5);
}

function setup() {
    createCanvas(1024, 576);
    floorPos_y = height * 3 / 4;
    lives = 3;

    startGame();
        soundPlays = 1;

}

function draw() {
    
    
    background(100, 155, 255); // fill the sky blue

    noStroke();
    fill(0, 155, 0);
    rect(0, floorPos_y, width, height / 4); // draw some green ground

    push();
    translate(scrollPos, 0);
    

    

    gameChar_world_x = gameChar_x - scrollPos;

    // Draw clouds.

    drawClouds();

    // Draw mountains.

    drawMountains();

    // Draw trees.

    drawTrees();
    
    
    
    for(var i = 0; i < platforms.length; i++) {
        platforms[i].draw();
    }
    

    // Draw canyons.

    for (var i = 0; i < canyons.length; i++) {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }

    // Draw collectable items.

    for (var i = 0; i < collectables.length; i++) {
        if (!collectables[i].isFound) {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }

    renderFlagpole();
    
    
    for(var i = 0; i < enemies.length; i++) {
        enemies[i].draw();
        
        var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
        
        if(isContact) {
            deathSound.play();
            if(lives > 0) {
                lives--;
                startGame();
                break;
            }
        }
    }
    
    pop();


    
    


    drawLives();

    drawGameChar();

    checkPlayerDie();

    fill(255);
    noStroke();
    textSize(15);
    text("Score: " + gameScore, 20, 20);
    

    if(lives < 1) {
        if(soundPlays > 0) {
            gameOverSound.play();
            soundPlays--;
        }
        
        fill(255,253,0)
        textSize(20);
        text("GAME OVER - PRESS SPACE TO CONTINUE", width/2, height/2);
        return;
    }
    
    if(flagpole.isReached) {
        winSound.play();
       fill(255,253,0)
        textSize(20);
        text("LEVEL COMPLETE!", width/2, height/2);
        return; 
    }
    

    // Logic to make the game character move or the background scroll.
    if (isLeft) {
        if (gameChar_x > width * 0.2) {
            gameChar_x -= 5;
        } else {
            scrollPos += 5;
        }
    }

    if (isRight) {
        if (gameChar_x < width * 0.8) {
            gameChar_x += 5;
        } else {
            scrollPos -= 5; // negative for moving against the background
        }
    }

    // Logic to make the game character rise and fall.


    if (gameChar_y < floorPos_y) {
        
        var isContact = false;
        
        for(var i = 0; i < platforms.length; i++) {
            
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y)) {
                isContact = true;
                break;
            }
        }
        
        if(!isContact) {
            isFalling = true;
            gameChar_y += 5;
        } else {
            isFalling = false;
        }
        
    } else {
        isFalling = false;
    }

    if (isPlummeting == true) {
        gameChar_y += 10;
    }

    if (!flagpole.isReached) {
        checkFlagpole();
    }
    
    
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed() {


    // if statements to control the animation of the character when
    // keys are pressed.

    if (keyCode == 37) {
        //console.log("Left Arrow");
        isLeft = true;

    } else if (keyCode == 39) {
        //console.log("Right Arrow");
        isRight = true;

    } else if (keyCode == 32) {
        jumpSound.play();
        //console.log("Spacebar");

        if (!isFalling) {
            gameChar_y -= 200;
        }

    }

    //open up the console to see how these work
    //console.log("keyPressed: " + key);
    //console.log("keyPressed: " + keyCode);


}

function keyReleased() {

    {
        // if statements to control the animation of the character when
        // keys are released.

        if (keyCode == 37) {
            //console.log("Left Arrow");
            isLeft = false;

        } else if (keyCode == 39) {
            //console.log("Right Arrow");
            isRight = false;

        }

        //console.log("keyReleased: " + key);
        //console.log("keyReleased: " + keyCode);
    }

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar() {
    if (isLeft && isFalling) {
        // add your jumping-left code
        //head
        fill(200, 150, 150);
        ellipse(gameChar_x, gameChar_y - 60, 22);

        //body
        fill(255, 0, 0);
        rect(gameChar_x - 10 + 10, gameChar_y - 50, bodyWidth - 10, bodyLength);



        //leg right
        fill(0);
        rect(gameChar_x - 10, gameChar_y - 25, legLength, legWidth);


        //arm right
        rect(gameChar_x - 10, gameChar_y - 50, armLength, armWidth);

    } else if (isRight && isFalling) {
        // add your jumping-right code
        //head
        fill(200, 150, 150);
        ellipse(gameChar_x, gameChar_y - 60, 22);

        //body
        fill(255, 0, 0);
        rect(gameChar_x - 10, gameChar_y - 50, bodyWidth - 10, bodyLength);

        //leg left
        fill(0);
        rect(gameChar_x - 10, gameChar_y - 25, legLength, legWidth);


        //arm left
        rect(gameChar_x - 8, gameChar_y - 50, armLength, armWidth);



    } else if (isLeft) {
        // add your walking left code

        //head
        fill(200, 150, 150);
        ellipse(gameChar_x, gameChar_y - 60, 22);

        //body
        fill(255, 0, 0);
        rect(gameChar_x - 10 + 10, gameChar_y - 50, bodyWidth - 10, bodyLength);

        //leg right
        fill(0);
        rect(gameChar_x + 2, gameChar_y - 20, legWidth, legLength);

        //arm right
        rect(gameChar_x + 2, gameChar_y - 50, armWidth, armLength);

    } else if (isRight) {
        // add your walking right code

        //head
        fill(200, 150, 150);
        ellipse(gameChar_x, gameChar_y - 60, 22);

        //body
        fill(255, 0, 0);
        rect(gameChar_x - 10, gameChar_y - 50, bodyWidth - 10, bodyLength);

        //leg left
        fill(0);
        rect(gameChar_x - 10, gameChar_y - 20, legWidth, legLength);


        //arm left
        rect(gameChar_x - 8, gameChar_y - 50, armWidth, armLength);




    } else if (isFalling || isPlummeting) {
        // add your jumping facing forwards code
        //head
        fill(200, 150, 150);
        ellipse(gameChar_x, gameChar_y - 60, 22);

        //body
        fill(255, 0, 0);
        rect(gameChar_x - 10, gameChar_y - 50, 20, bodyLength);

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


    } else {
        // add your standing front facing code


        //Add your code here ...

        //head
        fill(200, 150, 150);
        ellipse(gameChar_x, gameChar_y - 60, 22);

        //body
        fill(255, 0, 0);
        rect(gameChar_x - 10, gameChar_y - 50, bodyWidth, bodyLength);

        //leg left
        fill(0);
        rect(gameChar_x - 10, gameChar_y - 20, legWidth, legLength);

        //leg right
        fill(0);
        rect(gameChar_x + 2, gameChar_y - 20, legWidth, legLength);

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

function drawClouds() {
    for (var i = 0; i < clouds.length; i++) {

        fill(255, 255, 255);
        ellipse(clouds[i].x_pos,
            clouds[i].y_pos,
            0.60 * clouds[i].size,
            0.60 * clouds[i].size);

        ellipse(clouds[i].x_pos - 40 * clouds[i].size / 100,
            clouds[i].y_pos - 10 * clouds[i].size / 100,
            0.80 * clouds[i].size,
            0.80 * clouds[i].size);

        ellipse(clouds[i].x_pos - 80 * clouds[i].size / 100,
            clouds[i].y_pos - 5 * clouds[i].size / 100,
            0.70 * clouds[i].size,
            0.70 * clouds[i].size);

        ellipse(clouds[i].x_pos - 120 * clouds[i].size / 100,
            clouds[i].y_pos,
            0.60 * clouds[i].size,
            0.60 * clouds[i].size);

    }
}

// Function to draw mountains objects.

function drawMountains() {
    for (var i = 0; i < mountains.length; i++) {
        fill(113, 126, 142); //grey
        triangle(mountains[i].x_pos, floorPos_y - 176 * mountains[i].size / 100,
            mountains[i].x_pos - 100 * mountains[i].size / 100, floorPos_y,
            mountains[i].x_pos + 100 * mountains[i].size / 100, floorPos_y);

        triangle(mountains[i].x_pos + 80 * mountains[i].size / 100, floorPos_y - 142 * mountains[i].size / 100,
            mountains[i].x_pos - 20 * mountains[i].size / 100, floorPos_y,
            mountains[i].x_pos + 180 * mountains[i].size / 100, floorPos_y);

        //mountains[i] caps
        fill(255, 255, 255);
        triangle(mountains[i].x_pos, floorPos_y - 176 * mountains[i].size / 100,
            mountains[i].x_pos - 25 * mountains[i].size / 100, floorPos_y - 132 * mountains[i].size / 100,
            mountains[i].x_pos + 25 * mountains[i].size / 100, floorPos_y - 132 * mountains[i].size / 100);

        triangle(mountains[i].x_pos + 80 * mountains[i].size / 100, floorPos_y - 142 * mountains[i].size / 100,
            mountains[i].x_pos + 73 * mountains[i].size / 100, floorPos_y - 132 * mountains[i].size / 100,
            mountains[i].x_pos + 87 * mountains[i].size / 100, floorPos_y - 132 * mountains[i].size / 100);
    }

}

// Function to draw trees objects.

function drawTrees() {
    for (var i = 0; i < trees_x.length; i++) {

        //console.log(trees_x[i]);
        //tree  
        fill(120, 100, 40);
        treePos_y = floorPos_y - 150;
        rect(trees_x[i], treePos_y, 60, 150);

        //branches 
        fill(0, 155, 0);
        triangle(trees_x[i] - 50, treePos_y + 50, trees_x[i] + 30, treePos_y - 50, trees_x[i] + 110, treePos_y + 50);
        triangle(trees_x[i] - 50, treePos_y, trees_x[i] + 30, treePos_y - 100, trees_x[i] + 110, treePos_y);
        triangle(trees_x[i] - 50, treePos_y - 50, trees_x[i] + 30, treePos_y - 150, trees_x[i] + 110, treePos_y - 50);
        noStroke();
        fill(255);
    }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon) {

    noStroke();
    fill(139, 69, 19);
    triangle(t_canyon.x_pos, 580,
        t_canyon.x_pos - t_canyon.width, 432,
        t_canyon.x_pos + t_canyon.width, 432);

    fill(100, 155, 255);
    triangle(t_canyon.x_pos, 570,
        t_canyon.x_pos + 10 - t_canyon.width, 432,
        t_canyon.x_pos - 10 + t_canyon.width, 432);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon) {
    //console.log("gameChar_world_X: " + gameChar_world_x);
    //console.log("canyonStart: " + (t_canyon.x_pos - (t_canyon.width / 2)));
    //console.log("canyonFinish:" + (t_canyon.x_pos + (t_canyon.width / 2)));

    if (gameChar_world_x > (t_canyon.x_pos - (t_canyon.width / 2)) && gameChar_world_x < (t_canyon.x_pos + (t_canyon.width / 2)) && gameChar_y >= floorPos_y) {
        isPlummeting = true;
        //console.log("PLUMMETINGGGGG");
    }

    if (gameChar_y < floorPos_y) {
        isPlummeting = false;
    }
}


// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable) {

    if (t_collectable.isFound == false) {
        fill(255, 0, 255);
        ellipse(t_collectable.x_pos,
            t_collectable.y_pos,
            0.2 * t_collectable.size,
            0.2 * t_collectable.size);

        fill(255, 215, 0);
        ellipse(t_collectable.x_pos,
            t_collectable.y_pos + 0.30 * t_collectable.size,
            0.48 * t_collectable.size,
            0.48 * t_collectable.size);

        fill(100, 155, 255);
        ellipse(t_collectable.x_pos,
            t_collectable.y_pos + 0.30 * t_collectable.size,
            0.32 * t_collectable.size,
            0.32 * t_collectable.size);
    }


}

// Function to check character has collected an item.

function checkCollectable(t_collectable) {
    if (dist(t_collectable.x_pos, t_collectable.y_pos, gameChar_world_x, gameChar_y) < 29) {
        //console.log("Dist: " + dist(t_collectable.x_pos, t_collectable.y_pos, gameChar_world_x, gameChar_y));
        t_collectable.isFound = true;
        gameScore++;

    }

}

function renderFlagpole() {
    push();
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    noStroke();
    fill(255, 0, 255);
    //console.log("FRAME: " + frameCount);

    var counter = 0;

    if (flagpole.isReached) {
        rect(flagpole.x_pos, floorPos_y - 250, 50, 50);

    } else {
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50);

    }
    

    pop();
}

function checkFlagpole() {

    var dist = abs(gameChar_world_x - flagpole.x_pos);

    if (dist < 15) {
        flagpole.isReached = true;
    }
}

function checkPlayerDie() {

    if (gameChar_y > height) {
        fallSound.play();
        lives--;
        if (lives > 0) {
            startGame();
        }
    }


}

function startGame() {
    gameScore = 0;
    gameChar_x = width / 2;
    gameChar_y = floorPos_y;

    // Variable to control the background scrolling.
    scrollPos = 0;
    
    enemies = [];
    enemies.push(new Enemy(200, floorPos_y - 10, 100));
    enemies.push(new Enemy(300, floorPos_y - 10, 100));
    
    platforms = [];
    
    platforms.push(createPlatforms(100,floorPos_y -100,200));

    trees_x = [100, 400, 680, 1090, 1500, 1700, -300, -900, -1200];

    canyons = [{
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
        }
    ];


    collectables = [{
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
        }
    ];

    clouds = [{
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
        }
    ];

    mountains = [{
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
        }
    ];

    flagpole = {
        isReached: false,
        x_pos: 2200
     };

    // Boolean variables to control the movement of the game character.
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;

    // Initialise arrays of scenery objects.
}

function drawLives() {
    fill(255,253,0)
    textSize(15);
    text("Lives: ", 240, 20);
    for(var i = 0; i < lives; i++) {
        ellipse(300 + 40 * i, 20, 30);
    }
}

function createPlatforms(x, y, length) {
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function() {
            fill(255,0,255);
            rect(this.x, this.y, this.length, 20);
        },
        checkContact: function(gc_x, gc_y) {
            
            if(gc_x > this.x && gc_x < this.x + this.length) {
                
                var d = this.y - gc_y;
                if(d >= 0 && d < 5) {
                    return true;
                }
                
                
        }
            return false;
    }
    }
    
    return p;
}

function Enemy(x, y, range) {
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function() {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range) {
            this.inc = -1;
        } else if(this.currentX <= this.x) {
            this.inc = 1;
        }
        
    }
    
    this.draw = function() {
        console.log("drawing enemy in func");
        this.update();
        fill(255,0,0);
        ellipse(this.currentX, this.y, 20, 20);
    }
    
    this.checkContact = function(gc_x, gc_y) {
        
        var d = dist(gc_x, gc_y, this.currentX, this.y);
        
        if(d < 20) {
            return true;
        }
        
        return false;
    }
}