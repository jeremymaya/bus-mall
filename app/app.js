'use strict';

var section = document.getElementById('images');
var listOfItems = [];
var listOfImages = [
  ['Bag', '../assets/img/bag.jpg'],
  ['Banana', '../assets/img/banana.jpg'],
  ['Bathroom', '../assets/img/bathroom.jpg'],
  ['Boots', '../assets/img/boots.jpg'],
  ['Breakfast', '../assets/img/breakfast.jpg'],
  ['Bubblegum', '../assets/img/bubblegum.jpg'],
  ['Chair', '../assets/img/chair.jpg'],
  ['Cthulhu', '../assets/img/cthulhu.jpg'],
  ['Dog-Duck', '../assets/img/dog-duck.jpg'],
  ['Dragon', '../assets/img/dragon.jpg'],
  ['Pen', '../assets/img/pen.jpg'],
  ['Pet Seeep', '../assets/img/pet-sweep.jpg'],
  ['Scissors', '../assets/img/scissors.jpg'],
  ['Shark', '../assets/img/shark.jpg'],
  ['Sweep', '../assets/img/sweep.png'],
  ['Tauntaun', '../assets/img/tauntaun.jpg'],
  ['Unicorn', '../assets/img/unicorn.jpg'],
  ['USB', '../assets/img/usb.gif'],
  ['Water Can', '../assets/img/water-can.jpg'],
  ['Wine Glass', '../assets/img/wine-glass.jpg']
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

// Self invoking function to run the Item object constructor
(function loadImages() {
  for (var i = 0; i < listOfImages.length; i++) {
    for (var j = 0; j < 1; j++) {
      new Items (listOfImages[i][j], listOfImages[i][j + 1]);
    }
  }
} )();

// Check to see if there's database to track clicks and views count
// Creates database if there is none
(function initiateLocalStorage() {
  var clicks = [];
  if (!localStorage.getItem('clicks')) {
    for (var i = 0; i < listOfItems.length; i++) {
      clicks.push(listOfItems[i].numberOfClicks);
    }
    localStorage.setItem('clicks', JSON.stringify(clicks));
  }
  var views = [];
  if (!localStorage.getItem('views')) {
    for (var j = 0; j < listOfItems.length; j++) {
      views.push(listOfItems[j].numberOfViews);
    }
    localStorage.setItem('views', JSON.stringify(views));
  }
}) ();

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
// Gets local storage database and stores views count
function getRandomUniqueImage() {
  var found = false;
  while (!found) {
    var random = Math.floor(Math.random() * listOfItems.length);
    if (!thisSet[random] && !previousSet[random]) {
      found = listOfItems[random];
      listOfItems[random].updateViews();
      var storedViews = JSON.parse(localStorage.getItem('views'));
      storedViews[random]++;
      localStorage.setItem('views', JSON.stringify(storedViews));
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
// Gets local storage database and stores clicks count
// After 25 rounds of selection, removes the event listner and initiates priting results
function clickHandler(e) {
  var imageName = e.target.alt;
  for (var i = 0; i < listOfItems.length; i++) {
    if (listOfItems[i].name === imageName) {
      listOfItems[i].updateClicks();
      var storedClicks = JSON.parse(localStorage.getItem('clicks'));
      storedClicks[i]++;
      localStorage.setItem('clicks', JSON.stringify(storedClicks));
    }
  }
  console.log(counter);
  if (counter < 25) {
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
  var storedViews = JSON.parse(localStorage.getItem('views'));
  var storedClicks = JSON.parse(localStorage.getItem('clicks'));
  for (var i = 0; i < listOfItems.length; i++) {
    var percent = Math.floor(storedClicks[i] / storedViews[i] * 100);
    labels.push(listOfItems[i].name);
    data.push(percent);
    var r = Math.floor(Math.random() * 255);  // source: https://jsfiddle.net/5kLbasqp/26/
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    var a = 1;
    backgroundColor.push('rgb(' + r + ',' + g + ',' + b + ',' + a * 0.2 + ')');
    borderColor.push('rgb(' + r + ',' + g + ',' + b + ',' + a + ')');
  }
  localStorage.setItem('views', JSON.stringify(storedViews));
  localStorage.setItem('clicks', JSON.stringify(storedClicks));
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
        label: 'The accumulated percentage of times that an item was clicked when it was shown',
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
