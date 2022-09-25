let numbers = [1234, 5678, 9632, 2354];
let coloredLeds = [];

let REFERSH_TIME = 50;
let COUNTDOWN_TIME = 20;

let digits = {
    0: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [1, 0], [1, 8], [2, 0], [2, 8], [3, 0], [3, 8], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7]],
    1: [[0, 4], [1, 3], [2, 2], [3, 1], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]],
    2: [[0, 1], [0, 7], [0, 8], [1, 0], [1, 6], [1, 8], [2, 0], [2, 5], [2, 8], [3, 0], [3, 4], [3, 8], [4, 1], [4, 2], [4, 3], [4, 8]],
    3: [[0, 1], [0, 7], [1, 0], [1, 8], [2, 0], [2, 4], [2, 8], [3, 0], [3, 4], [3, 8], [4, 1], [4, 2], [4, 3], [4, 5], [4, 6], [4, 7]],
    4: [[0, 4], [1, 3], [1, 4], [2, 2], [2, 4], [3, 1], [3, 4], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]],
    5: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 8], [1, 0], [1, 4], [1, 8], [2, 0], [2, 4], [2, 8], [3, 0], [3, 4], [3, 8], [4, 0], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]],
    6: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [1, 0], [1, 4], [1, 8], [2, 0], [2, 4], [2, 8], [3, 0], [3, 4], [3, 8], [4, 0], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]],
    7: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]],
    8: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [1, 0], [1, 4], [1, 8], [2, 0], [2, 4], [2, 8], [3, 0], [3, 4], [3, 8], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]],
    9: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 8], [1, 0], [1, 4], [1, 8], [2, 0], [2, 4], [2, 8], [3, 0], [3, 4], [3, 8], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]],
}

function getDigits(number) {
    let digits = [];
    while (number > 0) {
        digits.push(number % 10);
        number = Math.floor(number / 10);
    }
    return digits.reverse();
}

$(document).ready(function() {
    $("circle").on("click", function() {
        let color = $(this).css('fill');
        if (color == 'rgb(0, 0, 0)') {
            $(this).css('fill', 'rgb(255, 255, 255)');
        } else {
            $(this).css('fill', 'rgb(0, 0, 0)');
        }
    });
    coloredLeds = getColoredLeds();
    turnOnLeds(coloredLeds);
});

function startAnimation() {
    let pointer = 0;

    let wait = 32;
    let countdown = COUNTDOWN_TIME;
    let step = 0;
    let maxSteps = 32*3;
    let redrawIntervalId = 0;

    redrawIntervalId = setInterval(function() {
        if (wait < 32) {
            redrawDigits();
            wait++;
        } else {
            if (countdown > 0) {
                countdown--;
                console.log("LOWER CD " + countdown);
            } else {
                coloredLeds.push(...getColoredLedsForNumber(numbers[pointer], 4));
                pointer++;
                if (pointer > 3) {
                    pointer = 0;
                }
                wait = 0;
                countdown = COUNTDOWN_TIME;               
            }
        }
        
    }, REFERSH_TIME);
    
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

function turnOnLeds(coloredLeds) {
    for (let i = 0; i < coloredLeds.length; i++) {
        let led = coloredLeds[i];
        $("#circle-" + led[0] + "-" + led[1]).css('fill', 'rgb(0, 0, 0)');
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

    console.log(coloredLeds)
    return coloredLeds;  
}

function getColoredLedsForDigit(digit, position) {
    let digitPositions = JSON.parse(JSON.stringify(digits[digit]));
    
    for (let i = 0; i < digitPositions.length; i++) {
        digitPositions[i][0] += position * 5 + position*3;
    }
    return digitPositions;
}