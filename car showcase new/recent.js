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

    function ago(t) {
        var s = Math.max(1, Math.floor((Date.now() - t) / 1000));
        if (s < 60) return "Just now";
        var m = Math.floor(s / 60); if (m < 60) return m + " min ago";
        var h = Math.floor(m / 60); if (h < 24) return h + " hr ago";
        var d = Math.floor(h / 24); return d + (d === 1 ? " day ago" : " days ago");
    }

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
            ".rv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px}" +
            ".rv-card{position:relative;display:flex;flex-direction:column;border:1px solid rgba(255,255,255,.1);border-radius:12px;overflow:hidden;background:#12191f;transition:.3s}" +
            ".rv-card:hover{transform:translateY(-6px);border-color:#c9a227}" +
            ".rv-img{position:relative}" +
            ".rv-img img{width:100%;height:150px;object-fit:cover;display:block}" +
            ".rv-time{position:absolute;top:10px;left:10px;background:rgba(0,0,0,.7);color:#fff;font-size:11px;padding:3px 9px;border-radius:20px}" +
            ".rv-body{padding:14px;display:flex;flex-direction:column;flex:1}" +
            ".rv-brand{color:#c9a227;font-size:11px;font-weight:bold;letter-spacing:1px;margin:0 0 5px}" +
            ".rv-body h3{font-size:16px;margin:0 0 8px;color:#fff}" +
            ".rv-specs{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}" +
            ".rv-chip{font-size:11px;color:#cbd5e1;border:1px solid rgba(255,255,255,.18);border-radius:20px;padding:2px 9px}" +
            ".rv-price{font-weight:bold;margin:0 0 10px;color:#fff;font-size:14px}" +
            ".rv-link{color:#c9a227;font-size:13px;margin-top:auto}" +
            ".rv-clear{display:block;margin:20px auto 0;background:none;border:1px solid #c9a227;color:#c9a227;padding:8px 18px;border-radius:6px;cursor:pointer}" +
            ".rv-clear:hover{background:#c9a227;color:#111}" +
            "@media(max-width:900px){.rv-grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:16px}}" +
            "@media(max-width:600px){" +
              ".rv-grid{display:flex;overflow-x:auto;gap:14px;padding-bottom:10px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch}" +
              ".rv-card{flex:0 0 72%;scroll-snap-align:start}" +
              ".rv-img img{height:140px}" +
              ".rv-clear{width:100%}" +
            "}";
        document.head.appendChild(st);
    }

    function render() {
        var box = document.getElementById("recentlyViewed");
        if (!box) return;
        var list = read(RECENT_KEY);
        if (box.hasAttribute("data-exclude-current")) {
            var here = location.pathname.split("/").pop();
            list = list.filter(function (c) { return c.link !== here; });
        }
        if (!list.length && !document.body.hasAttribute("data-recent-page")) { box.style.display = "none"; return; }
        injectStyle();
        box.style.display = "";
        var grid = box.querySelector(".rv-grid");
        if (!list.length) {
            grid.innerHTML = '<div class="rv-empty" style="grid-column:1/-1;color:#cbd5e1;padding:28px;text-align:center;border:1px dashed #64748b;border-radius:10px">No cars viewed yet. Explore Cars and open a car to see it here.</div>';
        } else grid.innerHTML = list.map(function (c) {
            var specs = (c.specs || []).map(function (s) { return '<span class="rv-chip">' + esc(s) + '</span>'; }).join("");
            return '<a class="rv-card" href="' + esc(c.link) + '" style="text-decoration:none">' +
                '<div class="rv-img"><img src="' + esc(c.image) + '" alt="' + esc(c.name) + '" loading="lazy"><span class="rv-time">' + esc(ago(c.time)) + '</span></div>' +
                '<div class="rv-body"><p class="rv-brand">' + esc(c.brand) + '</p><h3>' + esc(c.name) + '</h3>' +
                '<div class="rv-specs">' + specs + '</div>' +
                '<p class="rv-price">' + esc(c.price) + '</p><span class="rv-link">View Again \u2192</span></div></a>';
        }).join("");
        var btn = box.querySelector(".rv-clear");
        if (btn) btn.onclick = function () { localStorage.removeItem(RECENT_KEY); render(); };
    }

    function addNavigationLink() {
        document.querySelectorAll(".dropdown-menu").forEach(function (menu) {
            if (!menu.querySelector('a[href="recently-viewed.html"]')) {
                var link = document.createElement("a");
                link.href = "recently-viewed.html";
                link.textContent = "Recently Viewed";
                menu.appendChild(link);
            }
        });
        document.querySelectorAll(".mobile-menu").forEach(function (menu) {
            if (!menu.querySelector('a[href="recently-viewed.html"]')) {
                var link = document.createElement("a");
                link.href = "recently-viewed.html";
                link.textContent = "Recently Viewed";
                menu.insertBefore(link, menu.firstChild);
            }
        });
    }

    window.VelociaRecent = { cars: CARS, getRecent: function () { return read(RECENT_KEY); }, getLog: function () { return read(LOG_KEY); } };
    track();
    document.addEventListener("DOMContentLoaded", function () { addNavigationLink(); render(); });
})();
