var cars = {
bmw: {
name: "BMW M4 Competition",
price: "₹1.53 Crore",
priceValue: 1.53,
engine: "3.0L Twin-Turbo",
hp: 510,
fuel: "Petrol",
transmission: "8-Speed Automatic",
speed: "250 km/h",
image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80"
},


porsche: {
    name: "Porsche 911",
    price: "₹1.99 Crore",
    priceValue: 1.99,
    engine: "3.0L Twin-Turbo",
    hp: 385,
    fuel: "Petrol",
    transmission: "8-Speed Automatic",
    speed: "293 km/h",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80"
},

audi: {
    name: "Audi RS7 Sportback",
    price: "₹2.23 Crore",
    priceValue: 2.23,
    engine: "4.0L Twin-Turbo",
    hp: 630,
    fuel: "Petrol",
    transmission: "8-Speed Automatic",
    speed: "305 km/h",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=900&q=80"
}


};

function showCars() {
var car1 = document.getElementById("car1").value;
var car2 = document.getElementById("car2").value;


var first = cars[car1];
var second = cars[car2];

document.getElementById("compare-title").innerText =
    first.name + " VS " + second.name;

document.getElementById("car1-details").innerHTML =
    '<img src="' + first.image + '" alt="' + first.name + '">' +
    '<h3>' + first.name + '</h3>' +
    '<p>' + first.price + '</p>';

document.getElementById("car2-details").innerHTML =
    '<img src="' + second.image + '" alt="' + second.name + '">' +
    '<h3>' + second.name + '</h3>' +
    '<p>' + second.price + '</p>';

document.getElementById("car1-name").innerText = first.name;
document.getElementById("car2-name").innerText = second.name;

document.getElementById("car1-price").innerText = first.price;
document.getElementById("car2-price").innerText = second.price;

document.getElementById("car1-engine").innerText = first.engine;
document.getElementById("car2-engine").innerText = second.engine;

document.getElementById("car1-hp").innerText = first.hp + " HP";
document.getElementById("car2-hp").innerText = second.hp + " HP";

document.getElementById("car1-fuel").innerText = first.fuel;
document.getElementById("car2-fuel").innerText = second.fuel;

document.getElementById("car1-transmission").innerText = first.transmission;
document.getElementById("car2-transmission").innerText = second.transmission;

document.getElementById("car1-speed").innerText = first.speed;
document.getElementById("car2-speed").innerText = second.speed;

var result = document.getElementById("comparison-result");

if (car1 === car2) {
    result.innerText =
        "You selected the same car twice. Please select two different cars.";
} else if (first.priceValue < second.priceValue) {
    result.innerText =
        first.name + " has a lower listed price than " + second.name + ". Compare their specifications to decide which suits you.";
} else if (first.priceValue > second.priceValue) {
    result.innerText =
        second.name + " has a lower listed price than " + first.name + ". Compare their specifications to decide which suits you.";
} else {
    result.innerText =
        "Both cars have the same listed price. Compare their specifications to choose.";
}

}

document.getElementById("car1").addEventListener("change", showCars);
document.getElementById("car2").addEventListener("change", showCars);

showCars();
