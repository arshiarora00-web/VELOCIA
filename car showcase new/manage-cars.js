var cars = [];
var editingIndex = -1;

// Load saved cars or existing HTML cards
function loadCars() {
    var savedCars = localStorage.getItem("velocia_cars");

    if (savedCars !== null) {
        try {
            cars = JSON.parse(savedCars);

            if (!Array.isArray(cars)) {
                cars = [];
            }
        } catch (error) {
            cars = [];
        }
    } else {
        var cards = document.querySelectorAll(".admin-car-card");

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];

            cars.push({
                brand: card.querySelector(".car-brand").innerText,
                name: card.querySelector("h3").innerText,
                price: card.querySelector(".car-price").innerText,
                image: card.querySelector("img").src
            });
        }

        saveCars();
    }

    showCars();
}

// Save cars
function saveCars() {
    localStorage.setItem("velocia_cars", JSON.stringify(cars));
}

// Prevent HTML entered by users from being treated as HTML
function escapeHTML(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Display all cars
function showCars() {
    var grid = document.getElementById("carsGrid");
    var search = document.getElementById("carSearch").value.toLowerCase();

    var output = "";

    for (var i = 0; i < cars.length; i++) {
        var car = cars[i];

        var details = (
            car.name + " " + car.brand
        ).toLowerCase();

        if (details.indexOf(search) === -1) {
            continue;
        }

        output += `
            <div class="admin-car-card">

                <div class="car-image">
                    <img
                        src="${escapeHTML(car.image)}"
                        alt="${escapeHTML(car.name)}"
                        onerror="this.onerror=null;this.src='https://placehold.co/800x450/12191f/c9a227?text=Car+Image';">
                </div>

                <div class="car-info">

                    <p class="car-brand">
                        ${escapeHTML(car.brand)}
                    </p>

                    <h3>${escapeHTML(car.name)}</h3>

                    <p class="car-price">
                        ${escapeHTML(car.price)}
                    </p>

                    <div class="car-actions">

                        <button
                            type="button"
                            class="edit-btn"
                            onclick="editCar(${i})">
                            Edit
                        </button>

                        <button
                            type="button"
                            class="delete-btn"
                            onclick="deleteCar(${i})">
                            Delete
                        </button>

                    </div>

                </div>
            </div>
        `;
    }

    if (output === "") {
        output = `
            <p style="color:#c9a227; grid-column:1/-1;">
                No cars found.
            </p>
        `;
    }

    grid.innerHTML = output;
}

// Add a new car or update an existing one
function addOrEditCar() {
    var brand = prompt("Enter car brand:");

    if (brand === null || brand.trim() === "") {
        alert("Please enter the car brand.");
        return;
    }

    var name = prompt("Enter car name:");

    if (name === null || name.trim() === "") {
        alert("Please enter the car name.");
        return;
    }

    var price = prompt("Enter car price:");

    if (price === null || price.trim() === "") {
        alert("Please enter the car price.");
        return;
    }

    var image = prompt("Enter car image URL:");

    if (image === null || image.trim() === "") {
        alert("Please enter the car image URL.");
        return;
    }

    var car = {
        brand: brand.trim(),
        name: name.trim(),
        price: price.trim(),
        image: image.trim()
    };

    if (editingIndex === -1) {
        cars.push(car);
        alert("Car added successfully!");
    } else {
        cars[editingIndex] = car;
        alert("Car updated successfully!");
    }

    saveCars();
    showCars();

    editingIndex = -1;
}

// Open prompts with existing car details
function editCar(index) {
    editingIndex = index;

    var car = cars[index];

    var brand = prompt("Edit car brand:", car.brand);

    if (brand === null || brand.trim() === "") {
        editingIndex = -1;
        return;
    }

    var name = prompt("Edit car name:", car.name);

    if (name === null || name.trim() === "") {
        editingIndex = -1;
        return;
    }

    var price = prompt("Edit car price:", car.price);

    if (price === null || price.trim() === "") {
        editingIndex = -1;
        return;
    }

    var image = prompt("Edit car image URL:", car.image);

    if (image === null || image.trim() === "") {
        editingIndex = -1;
        return;
    }

    cars[index] = {
        brand: brand.trim(),
        name: name.trim(),
        price: price.trim(),
        image: image.trim()
    };

    saveCars();
    showCars();

    editingIndex = -1;

    alert("Car updated successfully!");
}

// Delete a car
function deleteCar(index) {
    var answer = confirm(
        "Are you sure you want to delete " + cars[index].name + "?"
    );

    if (answer) {
        cars.splice(index, 1);

        saveCars();
        showCars();

        alert("Car deleted successfully!");
    }
}

// Search cars
document.getElementById("carSearch").addEventListener(
    "input",
    showCars
);

// Add car button
document.getElementById("addCarBtn").addEventListener(
    "click",
    function(event) {
        event.preventDefault();
        addOrEditCar();
    }
);

// Start
loadCars();
