/* VELOCIA - Recently Viewed + view analytics (localStorage) */
(function () {
    var CARS = {
        "car-details.html":      { name: "BMW M4", brand: "BMW", price: "₹1.53 Crore", specs: ["Petrol", "Automatic", "510 HP"], image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80" },
        "mercedes-c-class.html": { name: "Mercedes-Benz", brand: "MERCEDES-BENZ", price: "₹59.40 Lakh", specs: ["Petrol", "Automatic", "204 HP"], image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80" },
        "porsche-911.html":      { name: "Porsche 911", brand: "PORSCHE", price: "₹1.99 Crore", specs: ["Petrol", "Automatic", "385 HP"], image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80" },
        "audi-rs7.html":         { name: "Audi RS7 Sportback", brand: "AUDI", price: "₹2.23 Crore", specs: ["Petrol", "Automatic", "630 HP"], image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=900&q=80" },
        "tesla-model-s.html":    { name: "Tesla Model S", brand: "TESLA", price: "₹1.50 Crore", specs: ["Electric", "Automatic", "670 HP"], image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80" },
        "mahindra-thar.html":    { name: "Mahindra Thar", brand: "MAHINDRA", price: "₹11.50 Lakh", specs: ["Diesel", "Manual", "150 HP"], image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=900&q=80" },
        "hyundai-creta.html":    { name: "Hyundai Creta", brand: "HYUNDAI", price: "₹11.11 Lakh", specs: ["Petrol", "Automatic", "160 HP"], image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80" },
        "toyota-fortuner.html":  { name: "Toyota Fortuner", brand: "TOYOTA", price: "₹35.00 Lakh", specs: ["Diesel", "Automatic", "204 HP"], image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=900&q=80" }
    };
    var RECENT_KEY = "velociaRecent", LOG_KEY = "velociaViewLog", MAX_RECENT = 6, MAX_LOG = 200;

    function read(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch (e) { return []; } }
    function write(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

    function track() {
        var file = location.pathname.split("/").pop();
        var car = CARS[file];
        if (!car) return;
        var entry = { name: car.name, brand: car.brand, price: car.price, specs: car.specs, image: car.image, link: file, time: Date.now() };
        var list = read(RECENT_KEY).filter(function (c) { return c.link !== file; });
        list.unshift(entry);
        write(RECENT_KEY, list.slice(0, MAX_RECENT));
        var log = read(LOG_KEY);
        log.unshift({ link: file, name: car.name, time: Date.now() });
        write(LOG_KEY, log.slice(0, MAX_LOG));
    }

    function injectStyle() {
        if (document.getElementById("rv-style")) return;
        var st = document.createElement("style");
        st.id = "rv-style";
        st.textContent =
            ".rv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:20px}" +
            ".rv-card{position:relative;border:1px solid rgba(255,255,255,.1);border-radius:10px;overflow:hidden;background:#12191f;transition:.3s}" +
            ".rv-card:hover{transform:translateY(-6px);border-color:#c9a227}" +
            ".rv-card img{width:100%;height:130px;object-fit:cover;display:block}" +
            ".rv-body{padding:14px}" +
            ".rv-brand{color:#c9a227;font-size:11px;font-weight:bold;letter-spacing:1px;margin:0 0 5px}" +
            ".rv-body h3{font-size:16px;margin:0 0 6px;color:#fff}" +
            ".rv-price{font-weight:bold;margin:0 0 10px;color:#fff;font-size:14px}" +
            ".rv-link{color:#c9a227;text-decoration:none;font-size:13px}" +
            ".rv-clear{display:block;margin:20px auto 0;background:none;border:1px solid #c9a227;color:#c9a227;padding:8px 18px;border-radius:6px;cursor:pointer}" +
            ".rv-clear:hover{background:#c9a227;color:#111}";
        document.head.appendChild(st);
    }

    function render() {
        var box = document.getElementById("recentlyViewed");
        if (!box) return;
        var list = read(RECENT_KEY);
        if (!list.length) { box.style.display = "none"; return; }
        injectStyle();
        box.style.display = "";
        var grid = box.querySelector(".rv-grid");
        grid.innerHTML = list.map(function (c) {
            return '<a class="rv-card" href="' + esc(c.link) + '" style="text-decoration:none">' +
                '<img src="' + esc(c.image) + '" alt="' + esc(c.name) + '">' +
                '<div class="rv-body"><p class="rv-brand">' + esc(c.brand) + '</p><h3>' + esc(c.name) + '</h3>' +
                '<p class="rv-price">' + esc(c.price) + '</p><span class="rv-link">View Again →</span></div></a>';
        }).join("");
        var btn = box.querySelector(".rv-clear");
        if (btn) btn.onclick = function () { localStorage.removeItem(RECENT_KEY); render(); };
    }

    window.VelociaRecent = { cars: CARS, getRecent: function () { return read(RECENT_KEY); }, getLog: function () { return read(LOG_KEY); } };
    track();
    document.addEventListener("DOMContentLoaded", render);
})();
