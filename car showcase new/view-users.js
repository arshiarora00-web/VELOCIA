// Get the users table and search box
var searchBox = document.getElementById("userSearch");
var tableBody = document.getElementById("usersTableBody");

// Get all users
var rows = tableBody.getElementsByTagName("tr");

// Search users by name or email
searchBox.addEventListener("input", function () {
var searchText = searchBox.value.toLowerCase();

for (var i = 0; i < rows.length; i++) {
    var name = rows[i].cells[0].innerText.toLowerCase();
    var email = rows[i].cells[1].innerText.toLowerCase();

    if (name.includes(searchText) || email.includes(searchText)) {
        rows[i].style.display = "";
    } else {
        rows[i].style.display = "none";
    }
}

});

// View user details
var viewButtons = document.getElementsByClassName("view-btn");

for (var i = 0; i < viewButtons.length; i++) {
viewButtons[i].addEventListener("click", function (event) {
event.preventDefault();
    var row = this.parentElement.parentElement;

    var name = row.cells[0].innerText;
    var email = row.cells[1].innerText;
    var joinedDate = row.cells[2].innerText;
    var status = row.cells[3].innerText;

    alert(
        "USER DETAILS\n\n" +
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Joined Date: " + joinedDate + "\n" +
        "Status: " + status
    );
});

}
