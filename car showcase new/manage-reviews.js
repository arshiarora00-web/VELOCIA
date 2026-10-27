// Get search box and reviews container
var searchBox = document.getElementById("reviewSearch");
var reviewsContainer = document.getElementById("reviewsContainer");

// Get all review cards
var reviews = reviewsContainer.getElementsByClassName("review-card");

// Search reviews by user name or car name
searchBox.addEventListener("input", function () {

var searchText = searchBox.value.toLowerCase();

for (var i = 0; i < reviews.length; i++) {

    var userName = reviews[i].getElementsByTagName("h3")[0].innerText.toLowerCase();

    var carName = reviews[i].getElementsByClassName("car-name")[0].innerText.toLowerCase();

    if (userName.includes(searchText) || carName.includes(searchText)) {
        reviews[i].style.display = "";
    } else {
        reviews[i].style.display = "none";
    }

}

});
// Delete review
var deleteButtons = reviewsContainer.getElementsByClassName("delete-btn");
for (var i = 0; i < deleteButtons.length; i++) {

deleteButtons[i].addEventListener("click", function (event) {
    event.preventDefault();
    var answer = confirm("Are you sure you want to delete this review?");
    if (answer) {
        var reviewCard = this.parentElement.parentElement;
        reviewCard.remove();
        alert("Review deleted successfully!");
    }
});
}
