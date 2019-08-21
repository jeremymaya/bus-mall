'use strict';

var section = document.getElementById('images');
var listOfItems = [];
var listOfImages = [
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
var thisSet = {};
var previousSet = {};
var labels = [];
var data = [];
var backgroundColor = [];
var borderColor = [];
var counter = 0;

function Items(name, src) {
  this.name = name;
  this.src = src;
  this.numberOfClicks = 0;
  this.numberOfViews = 0;
  this.percent = 0;
  listOfItems.push(this);
}

// Forked from the code reivew
Items.prototype.updateViews = function () {
  this.numberOfViews++;
};

// Forked from the code reivew
Items.prototype.updateClicks = function () {
  this.numberOfClicks++;
};

Items.prototype.updatePercent = function () {
  this.percent = Math.floor(this.numberOfClicks / this.numberOfViews * 100);
};

// Self invoking function to run the Item object constructor
(function loadImages() {
  for (var i = 0; i < listOfImages.length; i++) {
    new Items (`Image-${i}`, listOfImages[i]);
  }
} )();

// Forked from the code review
// Creates img elemets with id and src based on numImages variable
function setUpImagesSection(numImages) {
  for (var i = 1; i <= numImages; i++) {
    var img = document.createElement('img');
    img.id = `image-${i}`;
    img.src = '';
    section.appendChild(img);
  }
}

// Forked from the code review
// Generates 3 unique random number set based on the number of instances
// Checks if the generated number set does not match the previous number set
// Updates number of times each items was dsiplayed
function getRandomUniqueImage() {
  var found = false;
  while (!found) {
    var random = Math.floor(Math.random() * listOfItems.length);
    if (!thisSet[random] && !previousSet[random]) {
      found = listOfItems[random];
      listOfItems[random].updateViews();
      thisSet[random] = true;
    }
  }
  return found;
}

// Forked from the code reivew
// Prints number of images specified by numImages
// transfers thisSet object to previousSet object so it can be used to check for any repetitive numbers
function showRandomImages(numImages) {
  thisSet = {};
  for (var i = 1; i <= numImages; i++) {
    var id = `image-${i}`;
    var img = document.getElementById(id);
    var imageObject = getRandomUniqueImage();
    img.src = imageObject.src;
    img.alt = imageObject.name;
  }
  previousSet = thisSet;
  counter++;
}

// Forked from the code reivew
// Adds click event listener to the section of HTML where it holds all images
function setupListener() {
  section.addEventListener('click', clickHandler);
}

// Forked from the code reivew
// Uses event bubbling to capture which image is clicked by targeting alt
// Updates how many times an item was clicked
// After 25 rounds of selection, removes the event listner and initiates priting results
function clickHandler(e) {
  var imageName = e.target.alt;
  for (var i = 0; i < listOfItems.length; i++) {
    if (listOfItems[i].name === imageName) {
      listOfItems[i].updateClicks();
    }
  }
  console.log(counter);
  if (counter <= 25) {
    showRandomImages(3);
  }
  else {
    section.removeEventListener('click', clickHandler);
    printRaw();
    preparePercentage();
    printPercent();
  }
}

// Prints raw data of how many times each items was clicked on the Reuslt panel
function printRaw() {
  var result = document.getElementById('raw-result');
  var ul = document.createElement('ul');
  result.appendChild(ul);
  for (var i = 0; i < listOfItems.length; i++) {
    var li = document.createElement('li');
    li.textContent = listOfItems[i].name + ': ' + listOfItems[i].numberOfClicks + ' votes';
    ul.appendChild(li);
  }
}

// Invokes updatePercent prototype to update each Item instances
// Prepares arrays needed to print a chart for the percentage of times that an item was clicked when it was shown
function preparePercentage() {
  for (var i = 0; i < listOfItems.length; i++) {
    listOfItems[i].updatePercent();
    labels.push(listOfItems[i].name);
    data.push(listOfItems[i].percent);
    var r = Math.floor(Math.random() * 255);  // source: https://jsfiddle.net/5kLbasqp/26/
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    var a = 1;
    backgroundColor.push('rgb(' + r + ',' + g + ',' + b + ',' + a * 0.2 + ')');
    borderColor.push('rgb(' + r + ',' + g + ',' + b + ',' + a + ')');
  }
}

// Prints a horizontal bar chart of the percetnage of times that an item was clicked when it was shown
// Uses labels, data, backgroundColor, borderColor array generated from the preparePercentage function
function printPercent() {
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [{
        label: 'The percentage of times that an item was clicked when it was shown',
        data: data,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

setUpImagesSection(3);
showRandomImages(3);
setupListener();
