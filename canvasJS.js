//****************************************
// Attributes
//   These will define and drive how we render the dots and lines on 
//   our canvas.. editing these will provide the control necessary
//   to render this the way you want it to be rendered..
//****************************************

// Body and canvas..
var body   = document.getElementById('ourBody');
var canvas = document.getElementById('ourCanvas');
var can_w  = parseInt(canvas.getAttribute('width'));
var can_h  = parseInt(canvas.getAttribute('height'));
var contx  = canvas.getContext('2d');
var cScrl  = 0;

// These are our variables related to the dots..
var dot    = {x: 0, y: 0, vx: 0, vy: 0, r: 0, alpha: 1, phase: 0}; // dot object..
var dot_c  = {r: 0, g: 0, b: 225 };  // color of the dots..
var dot_r  = 2;                      // radius of the dots..
var dots   = [];                     // container for dots..

// A multiplier to control the number of dots on the screen
// This will be multiplied by the WIDTH of the screen, as to
// allow us to have LESS dots on mobile, and more on desktop
// (so it essentially looks about the same on both)..
var dot_multiplier = 0.08;                  
    
// Lines connecting the dots..
var link_line_width = 0.8;      // How thick are the lines?
var dis_limit       = 275;      // The cap on the length of the lines between dots..
var add_mouse_point = true;     // allow the lines to point to the cursor?
var mouse_in        = false;    // Is the mouse in our canvas?
var mouse_dot       = {x: 0,  y: 0, vx: 0, vy: 0, r: 0, type: 'mouse'};

//*********************************************************************
// These are the functions we will use to render the dots and lines
// connecting each of them on the screen..
//*********************************************************************

// Function designed to get the random speed using a min/max for 
// whichever direction our position is trying to go..
function randSpd(pos)
{
    var  min = -1;
    var  max = 1;
    switch(pos)
    {
        case 'top':    return [randNum(min, max),  randNum(0.1, max) ]; break;
        case 'right':  return [randNum(min, -0.1), randNum(min, max) ]; break;
        case 'bottom': return [randNum(min, max),  randNum(min, -0.1)]; break;
        case 'left':   return [randNum(0.1, max),  randNum(min, max)] ; break;
        default:       return;                                          break;
    }
}

// Utility function to get a random number between MIN and MAX..
function randNum(min, max)
{
    return Math.random()*(max - min) + min;
}
//console.log(randNum(0, 10));

// Utility function to get a random number up to the value given..
function randPos(length)
{
    return Math.ceil(Math.random() * length);
}
//console.log(randPos(50));

// Find a random position, and render the dot here (connecting it to those around it..)
function getRandomDot()
{
    // Pick one of the above at random..
    var startPos = ['top', 'right', 'bottom', 'left'];
    var pos = startPos[Math.floor(Math.random() * startPos.length)];

    // And render that dot accordingly..
    switch(pos)
    {
        case 'top':    return { x: randPos(can_w), y: -dot_r,           vx: randSpd('top')[0],    vy: randSpd('top')[1],    r: dot_r, alpha: 1, phase: randNum(0, 10) } 
        case 'right':  return { x: can_w + dot_r,  y: randPos(can_h),   vx: randSpd('right')[0],  vy: randSpd('right')[1],  r: dot_r, alpha: 1, phase: randNum(0, 10) } 
        case 'bottom': return { x: randPos(can_w), y: can_h + dot_r,    vx: randSpd('bottom')[0], vy: randSpd('bottom')[1], r: dot_r, alpha: 1, phase: randNum(0, 10) } 
        case 'left':   return { x: -dot_r,         y: randPos(can_h),   vx: randSpd('left')[0],   vy: randSpd('left')[1],   r: dot_r, alpha: 1, phase: randNum(0, 10) } 
    }
}

// Interate thru all of our dots, and update their color, size and location
function renderDots()
{
    Array.prototype.forEach.call(dots, function(b)
    {
       if(!b.hasOwnProperty('type'))
       {
            // Define the COLOR of the dot (property above)..
            contx.fillStyle = 'rgba('+dot_c.r+','+dot_c.g+','+dot_c.b+','+b.alpha+')';

            // Now draw the circle, using the radius defined earlier..
            contx.beginPath();
            contx.arc(b.x, b.y, dot_r, 0, Math.PI*2, true);
            contx.closePath();
            contx.fill();
       }
    });
}

// Update the movement of our dots..
// We want them to be able to bounce around the screen..
function updateDots()
{
    var new_dots = [];
    Array.prototype.forEach.call(dots, function(b)
    {
        // Move the x/y along the vertex defined..
        b.x += b.vx;
        b.y += b.vy;
        
        // Ensure we ADD dots as they move off the screen..
        if(b.x > -(50) && b.x < (can_w+50) && b.y > -(50) && b.y < (can_h+50))
        {
           new_dots.push(b);
        }
        
        // Allow the dots to phase in and out..
        b.phase += 0.03;
        b.alpha = Math.abs(Math.cos(b.phase));
    });
    
    // IGNORE the first one..
    dots = new_dots.slice(0);
}

// Iterate thru all the dots we have, and connect those local enough to each other..
function renderLines()
{
    var fraction, alpha;

    // First iteration thru our dots..
    for (var i = 0; i < dots.length; i++) 
    {
        // For each of those, connect to those close enough to us..
        for (var j = i + 1; j < dots.length; j++) 
        {
           // Determine the distance between these two dots..
           // If it is within the limit, we will connect them!
           fraction = getDisOf(dots[i], dots[j]) / dis_limit;            
           if(fraction < 1)
           {
               // We want the lines to be in a much lighter, random scale..
               contx.strokeStyle = 'rgba(150,150,150,'+(1 - fraction)+')';
               contx.lineWidth = link_line_width;
               
               // Render the line between the two dots..
               contx.beginPath();
               contx.moveTo(dots[i].x, dots[i].y);
               contx.lineTo(dots[j].x, dots[j].y);
               contx.stroke();
               contx.closePath();
           }
        }
    }
}

// calculate distance between two points
function getDisOf(b1, b2)
{
    // Start with the delta x and y..
    var  delta_x = Math.abs(b1.x - b2.x);
    var  delta_y = Math.abs(b1.y - b2.y);
    
    // Then return distance between them..
    return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
}

// This is our MAIN animation frame!! The window will 
// call this when it is ready to render the next frame..
function render()
{
    // Clear ourselves out..
    contx.clearRect(0, 0, can_w, can_h);

    // Render the dots and lines..
    renderDots();
    renderLines();
    updateDots();

    // add dots if there a little dots
    if(dots.length < dot_multiplier*can_w)
        dots.push(getRandomDot());

    // Draw our new frame..
    window.requestAnimationFrame(render);
}

// Initialize our dots the number of times we were told to..
function initDots(num)
{
    for(var i = 1; i <= num; i++)
    {
        dots.push(
        {
            // x,y of the dot (our position)..
            x: randPos(can_w),
            y: randPos(can_h),
            // x,y of the vertices (the direction we will travel)..
            vx: randSpd('top')[0],
            vy: randSpd('top')[1],
            // The radius of the dot..
            r: dot_r,
            // The transparency of the dot..
            alpha: 1,
            phase: randNum(0, 10)
        });
    }
}

// This function will do the initialization of the canvas..
// Which will set the width/height to the window..
function initCanvas()
{
    // Update the attributes to match the FULL window..
    can_w = window.innerWidth;
    can_h = window.innerHeight
    canvas.setAttribute('width',  can_w);
    canvas.setAttribute('height', can_h);
}

// This is the main function.. 
// It is called when we first load the javascript,
// and is what set's everything up..
function goMovie()
{
    initCanvas();
    initDots(dot_multiplier * can_w);
    window.requestAnimationFrame(render);
}

// Think of this like a static function call.. 
// This get's the party started!
goMovie();


//*********************************************************************
// Define our listeners.. These will control where we generate a new dot 
// with lines that will connect to the other moving dots on the canvas..

// When the user resizes the browser, re-define the width/height..
window.addEventListener('resize', function(e)
{
    console.log('Window Resize..');
    initCanvas();
});

// When the mouse enters the canvas, draw a DOT where the mouse is, 
// and connect the verices to the dots around it..
body.addEventListener('mouseenter', function()
{
    //console.log('mouseenter..');
    mouse_in = true;
    dots.push(mouse_dot);
});

// this is necessary so the dot connect to the mouse is REMOVED..
// along with the lines attaching it to nearby dots..
body.addEventListener('mouseleave', function()
{
    //console.log('mouseleave..');
    mouse_in = false;
    var new_dots = [];

    // Copy ALL our existing dots..
    Array.prototype.forEach.call(dots, function(b)
    {
        if(!b.hasOwnProperty('type'))
        {
            new_dots.push(b);
        }
    });

    // Then REMOVE the first..
    dots = new_dots.slice(0);
});

// When the mouse moves, update the mouse x/y
body.addEventListener('mousemove', function(e)
{
    var e = e || window.event;
    mouse_dot.x = e.pageX;
    mouse_dot.y = e.pageY - cScrl; // retain mouse/cursor position by adjusting for scroll..
    // console.log(mouse_dot);
});

// WIN! This allowed me to fix the bug with the mouse x/y
// moving around on me
window.addEventListener('scroll', function(e)
{
    var e = e || window.event;
    
    //console.log(e.srcElement.scrollingElement.scrollTop);
    var st = e.srcElement.scrollingElement.scrollTop;
    //console.log((st < cScrl) ? 'scroll up..' : 'scroll down..');
    cScrl = st;
});
