let w, h;
var canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const { sin, cos, PI, hypot, min, max } = Math;

//time
// Set the date we're counting down to
var countDownDate = new Date("Dec 25, 2022 12:00:00").getTime();
var startDate = new Date("Sept 26, 2022 12:00:00").getTime();

var now = new Date().getTime();

// Find the distance between now and the count down date
var distance = countDownDate - now;

// Time calculations for days, hours, minutes and seconds
var days = Math.floor(distance / (1000 * 60 * 60 * 24));
var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
var seconds = Math.floor((distance % (1000 * 60)) / 1000);

// Display the result in the element with id="countdown"
document.getElementById("countdown").innerHTML = days + "d " + hours + "h "
    + minutes + "m " + seconds + "s ";

//rocket
let beginX = 0.0; // Initial x-coordinate
let beginY = canvas.height; // Initial y-coordinate
let endX = 570.0; // Final x-coordinate
let endY = 320.0; // Final y-coordinate
var percent = 0
var direction = 1;

//stars
let x = 0.0; // Current x-coordinate
let y = 0.0; // Current y-coordinate

function anim(t) {
    if (w !== innerWidth) w = canvas.width = innerWidth;
    if (h !== innerHeight) h = canvas.height = innerHeight;
    distX = endX - beginX;
    distY = endY - beginY;
    ctx.fillStyle = "#28282B";
    drawCircle(5, 9, w * 10);
    ctx.fillStyle = ctx.strokeStyle = "#fff";
    t /= 1000
    stars.forEach(stars => stars.tick(t))
    // draw();
    rocketAnim();
    requestAnimationFrame(anim);
}

// cubic bezier percent is 0-1
function getQuadraticBezierXYatPercent(startPt, controlPt, endPt, percent) {
    var x = Math.pow(1 - percent, 2) * startPt.x + 2 * (1 - percent) * percent * controlPt.x + Math.pow(percent, 2) * endPt.x;
    var y = Math.pow(1 - percent, 2) * startPt.y + 2 * (1 - percent) * percent * controlPt.y + Math.pow(percent, 2) * endPt.y;
    return ({ x: x, y: y });
}

function drawRotated(degrees) {

    // save the unrotated context of the canvas so we can restore it later
    // the alternative is to untranslate & unrotate after drawing
    ctx.save();

    // move to the center of the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // rotate the canvas to the specified degrees
    ctx.rotate(degrees * Math.PI / 180);

    // draw the image
    // since the context is rotated, the image will be rotated also
    ctx.drawImage(document.getElementById('jasmineRocket'), -xy.x / 2, -xy.y / 2);

    // we’re done with the rotating so restore the unrotated context
    ctx.restore();
}

function drawRocket(percentValue) {

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.quadraticCurveTo(0, 0, (canvas.width - 300), 100);
    ctx.strokeStyle = '#41CD71';
    ctx.stroke();
    var xy = getQuadraticBezierXYatPercent({ x: 0, y: canvas.height }, { x: 0, y: 0 }, { x: (canvas.width - 300), y: 50 }, (percentValue / 100));

    ctx.drawImage(document.getElementById('moon'), (canvas.width - 400), 50, 350, 250);
    ctx.drawImage(document.getElementById('jasmineRocket'), xy.x, xy.y, 200, 200);

}

function rocketAnim() {

    // set the animation position (0-100)
    let totalTime = countDownDate - startDate;
    let progress = now - startDate;
    let percent = (progress / totalTime) * 100;

    drawRocket(percent);
}

function init() {
    window.requestAnimationFrame(anim);
}

// Update the count down every 1 second
var timeinterval = setInterval(function () {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="countdown"
    document.getElementById("countdown").innerHTML = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";

    // If the count down is finished, write some text
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("countdown").innerHTML = "LANDED";
    }
}, 1000);

function spawn() {

    const pts = many(333, () => {
        return {
            x: rnd(innerWidth),
            y: rnd(innerHeight),
            len: 0,
            r: 0
        };
    });

    const pts2 = many(10, (i) => {
        return {
            x: cos((i / 10) * PI * 2),
            y: sin((i / 10) * PI * 2)
        };
    });

    let seed = rnd(1000)
    let tx = rnd(innerWidth);
    let ty = rnd(innerHeight);
    let x = rnd(innerWidth)
    let y = rnd(innerHeight)
    let kx = rnd(1, 1)
    let ky = rnd(1, 1)
    let walkRadius = pt(rnd(100, 100), rnd(100, 100))
    let r = innerWidth / rnd(1000, 1050);

    function paintPt(pt) {
        pts2.forEach((pt2) => {
            if (!pt.len)
                return
            drawLine(
                lerp(x + pt2.x * r, pt.x, pt.len * pt.len),
                lerp(y + pt2.y * r, pt.y, pt.len * pt.len),
                x + pt2.x * r,
                y + pt2.y * r
            );
        });
        drawCircle(pt.x, pt.y, pt.r);
    }

    return {
        follow(x, y) {
            tx = x;
            ty = y;
        },

        tick(t) {

            const selfMoveX = cos(t * kx + seed) * walkRadius.x
            const selfMoveY = sin(t * ky + seed) * walkRadius.y
            let fx = tx + selfMoveX;
            let fy = ty + selfMoveY;

            x += min(innerWidth / 1, (fx - x) / 1)
            y += min(innerWidth / 100, (fy - y) / 10)

            let i = 10
            pts.forEach((pt) => {
                const dx = pt.x - x,
                    dy = pt.y - y;
                const len = hypot(dx, dy);
                let r = min(2, innerWidth / len / 5);
                pt.t = 0;
                const increasing = len < innerWidth / 1
                    && (i++) < 8;
                let dir = increasing ? 0.1 : -0.0;
                if (increasing) {
                    r *= 1.1;
                }
                pt.r = r;
                pt.len = max(0, min(pt.len + dir, 1));
                paintPt(pt)
            });
        }
    }
}

const stars = many(10, spawn)

// requestAnimationFrame();

// function draw() {
//   ctx.fill(0, 2);
//   ctx.rect(0, 0, width, height);
//   pct += step;
//   if (pct < 1.0) {
//     x = beginX + pct * distX;
//     y = beginY + pow(pct, exponent) * distY;
//   }
//   ctx.fill(255);
//   ctx.ellipse(x, y, 20, 20);
// }

function recalc(X, Y) {
    tx = X;
    ty = Y;
}

function rnd(x = 1, dx = 0) {
    return Math.random() * x + dx;
}

function drawCircle(x, y, r, color) {
    //console.log(x,y,r)
    // ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, PI * 2);
    ctx.fill();
}

function drawLine(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);

    many(100, (i) => {
        i = (i + 1) / 100;
        let x = lerp(x0, x1, i);
        let y = lerp(y0, y1, i);
        let k = noise(x / 5 + x0, y / 5 + y0) * 2;
        ctx.lineTo(x + k, y + k);
    });

    ctx.stroke();
}

function many(n, f) {
    return [...Array(n)].map((_, i) => f(i));
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function noise(x, y, t = 101) {
    let w0 = sin(0.3 * x + 1.4 * t + 2.0 +
        2.5 * sin(0.4 * y + -1.3 * t + 1.0));
    let w1 = sin(0.2 * y + 1.5 * t + 2.8 +
        2.3 * sin(0.5 * x + -1.2 * t + 0.5));
    return w0 + w1;
}

function pt(x, y) {
    return { x, y }
}

window.onload = init();