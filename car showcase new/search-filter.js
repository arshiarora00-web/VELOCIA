
document.addEventListener("DOMContentLoaded", function () {
    const make = document.getElementById("make");
    const type = document.getElementById("type");
    const budget = document.getElementById("budget");
    const keyword = document.getElementById("keyword");
    const searchBtn = document.querySelector(".search-btn");

    searchBtn.addEventListener("click", function () {
        const params = new URLSearchParams();

        params.set("make", make.value);
        params.set("type", type.value);
        params.set("budget", budget.value);
        params.set("keyword", keyword.value.trim());

        window.location.href = "search-results.html?" + params.toString();
    });
});
