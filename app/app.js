'use strict';

var listOfItem = [];
var listOfDisplayed = [];
var set = [];
var arrayLocation = 0;
var section = document.getElementById('images');
var imagesToBeLoaded = [
  'assets/img/bag.jpg',
  'assets/img/banana.jpg',
  'assets/img/bathroom.jpg',
  'assets/img/boots.jpg',
  'assets/img/breakfast.jpg',
  'assets/img/bubblegum.jpg',
  'assets/img/chair.jpg',
  'assets/img/cthulhu.jpg',
  'assets/img/dog-duck.jpg',
  'assets/img/dragon.jpg',
  'assets/img/pen.jpg',
  'assets/img/pet-sweep.jpg',
  'assets/img/scissors.jpg',
  'assets/img/shark.jpg',
  'assets/img/sweep.png',
  'assets/img/tauntaun.jpg',
  'assets/img/unicorn.jpg',
  'assets/img/usb.gif',
  'assets/img/water-can.jpg',
  'assets/img/wine-glass.jpg'
];

console.log(imagesToBeLoaded);

// Object Constructor for the items
function Item (name, src) {
  this.name = name;
  this.src = src;
  this.numberOfTimesClicked = 0;
  this.numberOfTimesDisplayed = 0;
  listOfItem.push(this);
}

// Creates instances by going through the listofItems array
function loadItems() {
  for (var i = 0; i < imagesToBeLoaded.length; i++) {
    new Item (`Image-${i}`, imagesToBeLoaded[i]);
  }
}
loadItems();

// Generates a random index value
function randomNumberGenerator() {
  return Math.floor(Math.random() * listOfItem.length);
}

// Generates a set of 3 unique numbers in the set array
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
function generateSet() {
  for (var i = 0; i < 3; i++) {
    var random = randomNumberGenerator();
    if (set.includes(random)) {
      set = randomNumberGenerator();
    }
    else {
      set.push(random);
    }
  }
}

// Tests to see if there are any duplicate numbers vs. the last set of 3 and transfer the set to listOfDisplayed array
function updateListOfDisplayed() {
  generateSet();
  var test = false;
  for (var i = listOfDisplayed.length - 3; i < listOfDisplayed.length; i++) {
    for (var j = 0; j < 3; j++) {
      if (listOfDisplayed[i] === set[j]) {
        set = [];
        break;
      }
      test = true;
    }
  }
  if (test) {
    listOfDisplayed = listOfDisplayed.concat(set);
    arrayLocation = arrayLocation + 3;
    set = [];
  }
}

// Renders a new set of 3 items at a time by
function showImages() {
  updateListOfDisplayed();
  for (var i = arrayLocation - 3; i < arrayLocation; i++) {
    var figure = document.createElement('figure');
    var img = document.createElement('img');
    var figcaption = document.createElement('figcaption');
    section.appendChild(figure);
    figure.appendChild(img);
    figure.appendChild(figcaption);
    img.innerHTML = '';
    figcaption.innerHTML = '';
    img.src = listOfItem[listOfDisplayed[i]].src;
    figcaption.textContent = listOfItem[listOfDisplayed[i]].name;
  }
  console.log(listOfDisplayed);
  console.log(arrayLocation);
}

// Keep getting random Uncaught TypeError message
// Need a function to remove the previous item set when clicked
// Need a click counter (https://codepen.io/juliogcampos/pen/BzdjwY)
// Need to track numberOfTimesClicked
// Need to track numberOfTimesDisplayed
// Need to stop event lisstner when total number of clicks = 25


// https://gomakethings.com/removing-an-event-listener-with-vanilla-javascript/
var clickHandler = function() {
  document.getElementById('images').addEventListener('click', showImages);
};

listOfDisplayed;
showImages();
clickHandler();
console.log(listOfDisplayed);
console.log(arrayLocation);
