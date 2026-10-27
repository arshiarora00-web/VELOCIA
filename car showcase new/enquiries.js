var enquiries = [];

function loadEnquiries() {
    try {
        enquiries = JSON.parse(
            localStorage.getItem("velocia_enquiries")
        ) || [];
    } catch (error) {
        enquiries = [];
    }

    showEnquiries();
}

function escapeHTML(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function saveEnquiries() {
    localStorage.setItem(
        "velocia_enquiries",
        JSON.stringify(enquiries)
    );
}

function showEnquiries() {
    var table = document.getElementById("enquiryTable");
    var search = document.getElementById("searchEnquiry");
    var total = document.getElementById("totalEnquiries");
    var newCount = document.getElementById("newEnquiries");
    var contactedCount = document.getElementById("contactedEnquiries");

    var newTotal = 0;
    var contactedTotal = 0;

    for (var i = 0; i < enquiries.length; i++) {
        if (enquiries[i].status === "New") {
            newTotal++;
        }

        if (enquiries[i].status === "Contacted") {
            contactedTotal++;
        }
    }

    total.innerText = enquiries.length;
    newCount.innerText = newTotal;
    contactedCount.innerText = contactedTotal;

    var text = search.value.toLowerCase();
    var rows = "";

    for (var i = 0; i < enquiries.length; i++) {
        var e = enquiries[i];

        var name = e.name || "";
        var email = e.email || "";
        var phone = e.phone || "";
        var car = e.car || "";
        var date = e.date || "";
        var time = e.time || "";
        var message = e.message || "";
        var status = e.status || "New";

        var allText = (
            name + " " + email + " " + phone + " " + car
        ).toLowerCase();

        if (allText.indexOf(text) === -1) {
            continue;
        }

        var formattedDate = date;

        if (date) {
            var parts = date.split("-");

            if (parts.length === 3) {
                formattedDate =
                    parts[2] + "-" + parts[1] + "-" + parts[0];
            }
        }

        rows += `
            <tr>
                <td class="user-name">
                    ${escapeHTML(name)}
                </td>

                <td>
                    ${escapeHTML(email)}
                    <br><br>
                    ${escapeHTML(phone)}
                </td>

                <td class="car-name">
                    ${escapeHTML(car)}
                </td>

                <td>
                    ${escapeHTML(formattedDate)}
                    <br>
                    ${escapeHTML(time)}
                </td>

                <td>
                    ${escapeHTML(message || "No message")}
                </td>

                <td>
                    <select
                        class="status"
                        onchange="changeStatus(${i}, this.value)"
                        aria-label="Change enquiry status">

                        <option value="New"
                            ${status === "New" ? "selected" : ""}>
                            New
                        </option>

                        <option value="Contacted"
                            ${status === "Contacted" ? "selected" : ""}>
                            Contacted
                        </option>

                        <option value="Pending"
                            ${status === "Pending" ? "selected" : ""}>
                            Pending
                        </option>

                    </select>
                </td>

                <td>
                    <button
                        type="button"
                        class="view-btn"
                        onclick="viewEnquiry(${i})">
                        View
                    </button>

                    <br><br>

                    <button
                        type="button"
                        class="view-btn"
                        onclick="deleteEnquiry(${i})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }

    if (rows === "") {
        rows = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    No enquiries found.
                </td>
            </tr>
        `;
    }

    table.innerHTML = rows;
}

function changeStatus(index, newStatus) {
    enquiries[index].status = newStatus;

    saveEnquiries();
    showEnquiries();
}

function viewEnquiry(index) {
    var e = enquiries[index];

    alert(
        "Customer: " + (e.name || "") +
        "\nPhone: " + (e.phone || "") +
        "\nEmail: " + (e.email || "") +
        "\nCar: " + (e.car || "") +
        "\nCity: " + (e.city || "") +
        "\nDate: " + (e.date || "") +
        "\nTime: " + (e.time || "") +
        "\nMessage: " + (e.message || "No message")
    );
}

function deleteEnquiry(index) {
    var confirmDelete = confirm(
        "Are you sure you want to delete this enquiry?"
    );

    if (confirmDelete) {
        enquiries.splice(index, 1);

        saveEnquiries();
        showEnquiries();
    }
}

document.getElementById("searchEnquiry").addEventListener(
    "input",
    showEnquiries
);

loadEnquiries();