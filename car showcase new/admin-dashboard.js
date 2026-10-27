// Read data from LocalStorage
function getData(key) {
var data = localStorage.getItem(key);

if (data == null) {
    return [];
}

try {
    return JSON.parse(data);
} catch (error) {
    return [];
}

}

// Calculate time since a car was viewed
function getTime(time) {
var minutes = Math.floor((Date.now() - time) / 60000);

if (minutes < 1) {
    return "just now";
} else if (minutes < 60) {
    return minutes + " min ago";
} else if (minutes < 1440) {
    var hours = Math.floor(minutes / 60);
    return hours + " hr ago";
} else {
    var days = Math.floor(minutes / 1440);
    return days + " day(s) ago";
}

}

// Show dashboard information
function loadDashboard() {

// Get car view data
var views = VelociaRecent.getLog();

// Total Cars
var totalCars = Object.keys(VelociaRecent.cars).length;
document.getElementById("statCars").innerText = totalCars;

// Registered Users
var users = getData("velociaUsers");
document.getElementById("statUsers").innerText = users.length;

// Total Car Views
document.getElementById("statViews").innerText = views.length;

// Wishlisted Cars
var wishlist = getData("wishlist");
document.getElementById("statWish").innerText = wishlist.length;


// Count views of each car
var carCounts = {};

for (var i = 0; i < views.length; i++) {
    var carLink = views[i].link;

    if (carCounts[carLink] == null) {
        carCounts[carLink] = 1;
    } else {
        carCounts[carLink]++;
    }
}


// Find the most viewed cars
var carLinks = Object.keys(carCounts);

carLinks.sort(function (a, b) {
    return carCounts[b] - carCounts[a];
});


// Show top 5 cars
var topCars = document.getElementById("topCars");
topCars.innerHTML = "";

if (carLinks.length == 0) {
    topCars.innerHTML =
        "<p class='empty-note'>No views recorded yet. Open a car page on the website.</p>";
} else {

    var maxViews = carCounts[carLinks[0]];

    for (var i = 0; i < carLinks.length && i < 5; i++) {

        var link = carLinks[i];
        var carName = VelociaRecent.cars[link].name;
        var count = carCounts[link];

        var percentage = count / maxViews * 100;

        topCars.innerHTML +=
            "<div class='bar-row'>" +
                "<div class='bar-label'>" +
                    "<span>" + carName + "</span>" +
                    "<span>" + count + " views</span>" +
                "</div>" +
                "<div class='bar-track'>" +
                    "<div class='bar-fill' style='width:" + percentage + "%'></div>" +
                "</div>" +
            "</div>";
    }
}


// Show recently viewed cars
var viewFeed = document.getElementById("viewFeed");
viewFeed.innerHTML = "";

if (views.length == 0) {
    viewFeed.innerHTML =
        "<p class='empty-note'>Nothing viewed yet.</p>";
} else {

    for (var i = 0; i < views.length && i < 6; i++) {

        var carName = views[i].name;
        var viewTime = getTime(views[i].time);
        var firstLetter = carName.charAt(0);

        viewFeed.innerHTML +=
            "<div class='activity-item'>" +
                "<div class='activity-icon'>" + firstLetter + "</div>" +
                "<div class='activity-info'>" +
                    "<h4>" + carName + "</h4>" +
                    "<p>Viewed " + viewTime + "</p>" +
                "</div>" +
            "</div>";
    }
}

}

// Reset car views
document.getElementById("clearViews").onclick = function () {

var answer = confirm("Reset all view tracking data?");

if (answer == true) {
    localStorage.removeItem("velociaViewLog");
    localStorage.removeItem("velociaRecent");

    loadDashboard();
}

};

// Load dashboard
loadDashboard();
