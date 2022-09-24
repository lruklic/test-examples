let numbers = [6789];

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
    return digits;
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
    turnOnLeds(getColoredLeds());
});

function turnOnLeds(coloredLeds) {
    for (let i = 0; i < coloredLeds.length; i++) {
        let led = coloredLeds[i];
        $("#circle-" + led[0] + "-" + led[1]).css('fill', 'rgb(0, 0, 0)');
    }
}

function getColoredLeds() {
    let digits = getDigits(numbers[0]);
    let coloredLeds = [];
    for (let i = 0; i < digits.length; i++) {
        let digit = digits[i];
        let coloredLedsForDigit = getColoredLedsForDigit(digit, i);
        coloredLeds.push(...coloredLedsForDigit);
    }
    return coloredLeds;
}

function getColoredLedsForDigit(digit, position) {
    let digitPositions = JSON.parse(JSON.stringify(digits[digit]));
    
    for (let i = 0; i < digitPositions.length; i++) {
        digitPositions[i][0] += position * 5 + position*3;
    }
    return digitPositions;
}