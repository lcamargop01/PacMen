const pacArray = [
    ['./images/PacMan1.png', './images/PacMan2.png'],
    ['./images/PacMan3.png', './images/PacMan4.png']
];
const pacMen = []; // This array holds all the pacmen
const xMin = 0;
const yMin = 0;
const xMax = window.innerWidth;
const yMax = window.innerHeight;
const chompInterval = 250; // in milliseconds
let pos = 0;
let direction = 0;
let timeout;

// preload images
window.onload = () => {
    for (let i = 0; i < pacArray.length; i++) {
        let img0 = new Image(1, 1);
        let img1 = new Image(1, 1);
        img0.src = pacArray[i][0];
        img0.style.visibility = 'hidden';
        img1.src = pacArray[i][1];
        img1.style.visibility = 'hidden';
        document.body.appendChild(img0);
        document.body.appendChild(img1);        
    }
}

// get random velocities
function setToRandom(scale) {
    let x = Math.random() * scale;
    let y = Math.random() * scale;
    let avg = (x + y) / 2;
    return {x, y, avg};
}

// get directional angle in degrees to rotate pac-man
function getDirectionalDegrees(vX, vY) {
    let radians = Math.atan(vY / vX); 
    let degrees = radians * 57.2958;
    return degrees;
}

// Factory to make a Pac-Man at a random position with random velocity
function makePac() {
    // returns an object with random values scaled {x: 33, y: 21}
    let velocity = setToRandom(10); // {x:?, y:?}
    let position = setToRandom(400);

    // Add image to div id = game
    let game = document.getElementById('game');
    let img = document.createElement('img');
    let imgState = 0;
    let imgStateTime = Date.now();
    let imgAngle = getDirectionalDegrees(velocity.x, velocity.y);
    img.style.position = 'absolute';
    img.style.transform = 'rotate(' + imgAngle + 'deg)';
    img.src = './images/PacMan1.png';
    img.width = 100;
    
    // set position here 
    if (position.y < 40) position.y = 40;
    img.style.left = position.x;
    img.style.top = position.y;

    // add new Child image to game
    game.appendChild(img);

    // return details in an object
    return {
        position,
        velocity,
        img,
        imgState,
        imgStateTime
    }
}

function update() {
    if (pacMen.length > 0) {
        //loop over pacmen array and move each one and move image in DOM
        pacMen.forEach((item) => {
            checkCollisions(item)

            // calculate directional rotation angle
            let imgAngle = getDirectionalDegrees(item.velocity.x, item.velocity.y);

            // calculate chomping speed based on average velocity
            let vFactor = parseInt((1 - (item.velocity.avg / 10)) * chompInterval);
            if (Date.now() - item.imgStateTime >= vFactor) { 
                item.imgState = (item.imgState + 1) % 2;
                item.imgStateTime = Date.now();
            }

            // get direction for img src
            if (item.velocity.x > 0) direction = 0;
            if (item.velocity.x < 0) direction = 1;

            // set img src and position
            item.img.src = pacArray[direction][item.imgState];
            item.position.x += item.velocity.x;
            item.position.y += item.velocity.y;
            item.img.style.left = item.position.x;
            item.img.style.top = item.position.y;
            item.img.style.transform = 'rotate(' + imgAngle + 'deg)';
        })
        timeout = setTimeout(update, 20);
    }
}

function checkCollisions(item) {
    // detect collision with all walls and make pacman bounce
    if (item.position.x + item.velocity.x + item.img.width >= xMax - 22 || item.position.x + item.velocity.x <= 0) {
        item.velocity.x = -item.velocity.x;
    }
    if (item.position.y + item.velocity.y + item.img.width >= yMax - 22 || item.position.y + item.velocity.y <= 0) {
        item.velocity.y = -item.velocity.y;
    }
}

function makeOne() {
    pacMen.push(makePac()); // add a new PacMan to the pacMen array
}

function pauseGame() {
    clearTimeout(timeout);
}

function clearGame() {
    clearTimeout(timeout);
    for (let i = pacMen.length - 1; i >= 0; i--) {
        pacMen[i].img.remove();
        pacMen.pop();
    }
}
