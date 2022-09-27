let numbers = [0, 12, 345, 6789];
let coloredLeds = [];
let gapsLeds = [];

let pointer = 0;

let wait = LED_PANEL_WIDTH + 3;
let countdown = COUNTDOWN_TIME;

let startedAnimationId = 0;

let digits = {
    0: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [1, 0], [1, 8], [2, 0], [2, 8], [3, 0], [3, 8], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]],
    1: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]],
    2: [[0, 0], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [1, 0], [1, 4], [1, 8], [2, 0], [2, 4], [2, 8], [3, 0], [3, 4], [3, 8], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 8]],
    3: [[0, 0], [0, 4], [0, 8], [1, 0], [1, 4], [1, 8], [2, 0], [2, 4], [2, 8], [3, 0], [3, 4], [3, 8], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]],
    4: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 4], [2, 4], [3, 4], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]],
    5: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 8], [1, 0], [1, 4], [1, 8], [2, 0], [2, 4], [2, 8], [3, 0], [3, 4], [3, 8], [4, 0], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]],
    6: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [1, 0], [1, 4], [1, 8], [2, 0], [2, 4], [2, 8], [3, 0], [3, 4], [3, 8], [4, 0], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]],
    7: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]],
    8: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [1, 0], [1, 4], [1, 8], [2, 0], [2, 4], [2, 8], [3, 0], [3, 4], [3, 8], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]],
    9: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 8], [1, 0], [1, 4], [1, 8], [2, 0], [2, 4], [2, 8], [3, 0], [3, 4], [3, 8], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]],
}

function getDigits(number) {
    let originalNumber = number;
    let digits = [];
    if (number == 0) {
        digits.push(0);
    } else {
        while (number > 0) {
            digits.push(number % 10);
            number = Math.floor(number / 10);
        }
    }

    if (originalNumber < 10) {
        digits.push('x');
        digits.push('x');
        digits.push('x');
    } else if (originalNumber < 100) {
        digits.push('x');
        digits.push('x');
    } else if (originalNumber < 1000) {
        digits.push('x');
    }

    return digits.reverse();

}

function generateLedDisplay() {
    // generate svg circle grid
    var svg = document.querySelector('svg');
    var svgNS = svg.namespaceURI;
    var circle;

    var paddingX = 15;
    var paddingY = 15;

    var r = 10;
    var dx = 2 * r;
    var dy = 2 * r;
    
    if (HIDE_LED_GAPS) {
        let digitSpace = DIGIT_WIDTH;
        let gapSpace = GAP_WIDTH;
        for (let i = 0; i < LED_PANEL_WIDTH; i++) {
            if (digitSpace > 0) {
                digitSpace--;
            } else if (gapSpace > 0) {
                gapsLeds.push(i);
                gapSpace--;
                if (gapSpace == 0) {
                    digitSpace = DIGIT_WIDTH;
                    gapSpace = GAP_WIDTH;
                }
            }
        }
    }

    for (let i = 0; i < LED_PANEL_WIDTH; i++) {
        for (let j = 0; j < LED_PANEL_HEIGHT; j++) {
            let cx = paddingX + dx * i;
            let cy = paddingY + dy * j;
            circle = document.createElementNS(svgNS, 'circle');
            circle.setAttributeNS(null, 'cx', cx);
            circle.setAttributeNS(null, 'cy', cy);
            circle.setAttributeNS(null, 'r', r);
            circle.setAttributeNS(null, 'fill', 'rgb(255, 255, 255)');
            if (gapsLeds.includes(i)) { 
                circle.setAttributeNS(null, 'stroke', GAP_LED_STROKE);
            } else {
                circle.setAttributeNS(null, 'stroke', DIGIT_LED_STROKE);
            }
            circle.setAttributeNS(null, 'stroke-width', '1');
            circle.setAttributeNS(null, 'id', 'circle-' + i + '-' + j);
            circle.setAttributeNS(null, 'class', 'led-circle');
            svg.appendChild(circle);
        }
    }
}

$(document).ready(function() {

    generateLedDisplay();

    $("circle").on("click", function() {
        let color = $(this).css('fill');
        if (color == 'rgb(0, 0, 0)') {
            $(this).css('fill', 'rgb(255, 255, 255)');
        } else {
            $(this).css('fill', 'rgb(0, 0, 0)');
        }
    });

    $("#update-values").on("click", function() {
        numbers = [];
        for (let i = 0; i < NUMBER_OF_VALUES; i++) {
            numbers.push(parseInt($("#value-" + i).val()));
        }
    });

    $("#start-animation").on("click", function() {
        startedAnimationId = startAnimation();
    });

    $("#stop-animation").on("click", function() {
        clearInterval(startedAnimationId);
    });

    coloredLeds = getColoredLeds();
    turnOnLeds(coloredLeds);
});

function startAnimation() {

    let redrawIntervalId = 0;

    redrawIntervalId = setInterval(function() {
        if (wait < LED_PANEL_WIDTH + 3) {
            redrawDigits();
            wait++;
        } else {
            if (countdown > 0) {
                countdown--;
            } else {
                coloredLeds.push(...getColoredLedsForNumber(numbers[pointer], NUMBER_OF_VALUES));
                pointer++;
                if (pointer > (NUMBER_OF_VALUES-1)) {
                    pointer = 0;
                }
                wait = 0;
                countdown = COUNTDOWN_TIME;               
            }
        }
        
    }, REFRESH_TIME);

    return redrawIntervalId;
    
}

function startAnimationRandom() {

    redrawIntervalId = setInterval(function() {
        coloredLeds.push(...getColoredLedsForNumber(numbers[pointer], NUMBER_OF_VALUES));
        pointer++;
        if (pointer > (NUMBER_OF_VALUES-1)) {
            pointer = 0;
        }
        redrawDigitsRandom();
    }, REFRESH_TIME_RANDOM);

}

function redrawDigits() {
    for (let i = 0; i < coloredLeds.length; i++) {
        coloredLeds[i][0] = coloredLeds[i][0] - 1;
    }
    // Reset all LED to white
    $(".led-circle").css('fill', 'rgb(255, 255, 255)');

    // Turn on LEDs
    turnOnLeds(coloredLeds);

}

function redrawDigitsRandom() {
    for (let i = 0; i < coloredLeds.length; i++) {
        coloredLeds[i][0] = coloredLeds[i][0] - LED_PANEL_WIDTH - 3;
    }
    // Reset all LED to white
    $(".led-circle").css('fill', 'rgb(255, 255, 255)');

    // Turn on LEDs
    turnOnLeds(coloredLeds, true);

}

function turnOnLeds(coloredLeds, random=false) {
    for (let i = 0; i < coloredLeds.length; i++) {
        let led = coloredLeds[i];
        if (gapsLeds.includes(led[0])) {
            $("#circle-" + led[0] + "-" + led[1]).css('fill', '#fff');
        } else {
            if (random) {
                // Generate random number between 1 and 
                let rand = Math.floor(Math.random() * 4) + 1;
                $("#circle-" + led[0] + "-" + led[1]).css({fill : DIGIT_LED_FILL, transition: rand+".0s"});
            } else {
                $("#circle-" + led[0] + "-" + led[1]).css('fill', DIGIT_LED_FILL);
            }
        }
        
    }
}

function getColoredLeds() {
    let coloredLeds = [];
    for (let i = 0; i < numbers.length; i++) {
        let digits = getDigits(numbers[i]);
        for (let j = 0; j < digits.length; j++) {
            let digit = digits[j];
            let coloredLedsForDigit = getColoredLedsForDigit(digit, 4*i+j);
            coloredLeds.push(...coloredLedsForDigit);
        }  
    }

    return coloredLeds;  
}

function getColoredLedsForNumber(number, offset) {
    let coloredLeds = [];
    let digits = getDigits(number);
    for (let j = 0; j < digits.length; j++) {
        let digit = digits[j];
        let coloredLedsForDigit = getColoredLedsForDigit(digit, 4*offset+j);
        coloredLeds.push(...coloredLedsForDigit);
    }  

    return coloredLeds;  
}

function getColoredLedsForDigit(digit, position) {
    if (digit === 'x') {
        return [];
    } 
    let digitPositions = JSON.parse(JSON.stringify(digits[digit]));
    
    for (let i = 0; i < digitPositions.length; i++) {
        digitPositions[i][0] += position * DIGIT_WIDTH + position * GAP_WIDTH;
    }
    return digitPositions;
}