// Get saved wishlist
function getWishlist() {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
}

// Save wishlist
function saveWishlist(list) {
    localStorage.setItem("wishlist", JSON.stringify(list));
}

// Add or remove car from wishlist
function toggleWishlist(car) {

    let list = getWishlist();

    let index = list.findIndex(item => item.name === car.name);

    if (index === -1) {
        list.push(car);
        alert(car.name + " added to wishlist!");
    } else {
        list.splice(index, 1);
        alert(car.name + " removed from wishlist!");
    }

    saveWishlist(list);

    showWishlist();
    updateHearts();
}

// Update heart buttons
function updateHearts() {

    let list = getWishlist();

    document.querySelectorAll(".all-car-card").forEach(card => {

        let name = card.querySelector("h3").innerText;

        let button = card.querySelector(".heart-button");

        if (!button) return;

        let found = list.some(car => car.name === name);

        button.innerText = found ? "♥" : "♡";

        button.style.color = found ? "red" : "#c9a227";

    });
}

// Show saved cars on wishlist page
function showWishlist() {

    let grid = document.querySelector(".wishlist-grid");

    if (!grid) return;

    let list = getWishlist();

    if (list.length === 0) {

        grid.innerHTML = `
            <div class="empty-state">
                <h3>Your Wishlist is Empty!</h3>
                <p>Add your favourite cars to see them here.</p>
                <a href="cars.html" class="btn btn-primary">
                    Explore Cars
                </a>
            </div>
        `;

        return;
    }

    grid.innerHTML = "";

    list.forEach(car => {

        grid.innerHTML += `
            <div class="wishlist-card">

                <div class="wishlist-image">

                    <img src="${car.image}" alt="${car.name}">

                </div>

                <div class="wishlist-info">

                    <p class="wishlist-company">${car.brand}</p>

                    <h3>${car.name}</h3>

                    <p class="wishlist-price">${car.price}</p>

                    <div class="wishlist-specs">
                        ${car.specs.map(spec => `<span>${spec}</span>`).join("")}
                    </div>

                    <div class="wishlist-buttons">

                        <a href="${car.link}" class="view-details-btn">
                            View Details
                        </a>

                        <button
                            class="remove-btn"
                            onclick="removeWishlist('${car.name.replace(/'/g, "\\'")}')">
                            Remove
                        </button>

                    </div>

                </div>

            </div>
        `;

    });

}

// Remove car from wishlist
function removeWishlist(name) {

    let list = getWishlist();

    list = list.filter(car => car.name !== name);

    saveWishlist(list);

    showWishlist();
    updateHearts();
}

// Run when heart button is clicked
document.addEventListener("click", function(event) {

    let button = event.target.closest(".heart-button");

    if (!button) return;

    let card = button.closest(".all-car-card");

    if (!card) return;

    event.preventDefault();

    let car = {

        name: card.querySelector("h3").innerText,

        brand: card.querySelector(".car-company").innerText,

        price: card.querySelector(".all-car-price").innerText,

        image: card.querySelector("img").src,

        specs: Array.from(
            card.querySelectorAll(".mini-specs span")
        ).map(spec => spec.innerText),

        link: card.querySelector(".all-car-buttons a").getAttribute("href")

    };

    toggleWishlist(car);

});

// Load wishlist when page opens
document.addEventListener("DOMContentLoaded", function() {

    showWishlist();

    updateHearts();

});