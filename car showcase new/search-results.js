
document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);

    const selectedMake = (params.get("make") || "").toLowerCase();
    const selectedType = (params.get("type") || "").toLowerCase();
    const selectedBudget = params.get("budget") || "";
    const keyword = (params.get("keyword") || "").toLowerCase();

    const results = document.getElementById("results");
    const count = document.getElementById("result-count");

    try {
        const response = await fetch("index.html");
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        const cars = doc.querySelectorAll(".car-card, .featured-card");
        let found = 0;

        cars.forEach(function (car) {
            const name = car.querySelector("h3")?.textContent.toLowerCase() || "";
            const details = car.textContent.toLowerCase();
            const alt = car.querySelector("img")?.alt.toLowerCase() || "";

            const matchesMake =
                !selectedMake ||
                name.includes(selectedMake) ||
                alt.includes(selectedMake);

            const matchesType =
                !selectedType || details.includes(selectedType);

            const matchesKeyword =
                !keyword ||
                name.includes(keyword) ||
                details.includes(keyword) ||
                alt.includes(keyword);

            const priceText = car.querySelector(".car-price")?.textContent || "";
            const priceMatch = priceText.match(/₹\s*([\d.]+)\s*(Lakh|Crore)/i);

            let price = 0;

            if (priceMatch) {
                price = parseFloat(priceMatch[1]);

                if (priceMatch[2].toLowerCase() === "crore") {
                    price *= 100;
                }
            }

            let matchesBudget = true;

            if (selectedBudget === "Under ₹10 Lakh") {
                matchesBudget = price > 0 && price < 10;
            } else if (selectedBudget === "₹10 Lakh – ₹20 Lakh") {
                matchesBudget = price >= 10 && price <= 20;
            } else if (selectedBudget === "₹20 Lakh – ₹35 Lakh") {
                matchesBudget = price > 20 && price <= 35;
            } else if (selectedBudget === "₹35 Lakh+") {
                matchesBudget = price > 35;
            }

            if (matchesMake && matchesType && matchesKeyword && matchesBudget) {
                results.appendChild(car.cloneNode(true));
                found++;
            }
        });

        count.textContent = found + " car(s) found.";

        if (found === 0) {
            results.innerHTML = `
                <div class="no-results">
                    <h2>No Cars Found</h2>
                    <p>Try changing your make, body type, or budget.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error(error);
        count.textContent = "Could not load cars. Please use Live Server.";
    }
});
