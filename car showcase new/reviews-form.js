/* VELOCIA - reviews.html: star selector, validation, localStorage reviews */
/* VELOCIA - reviews.html: star selector, validation, localStorage reviews */
(function () {
    'use strict';
    if (window.__velociaReviewsInit) return;
    window.__velociaReviewsInit = true;

    var STORAGE_KEY = 'velocia_user_reviews';

    var form = document.getElementById('reviewForm');
    var nameInput = document.getElementById('reviewName');
    var carSelect = document.getElementById('reviewCar');
    var emailInput = document.getElementById('reviewEmail');
    var textInput = document.getElementById('reviewText');
    var starGroup = document.getElementById('reviewRating');
    var heading = document.querySelector('.reviews-heading');
    var overall = document.querySelector('.overall-rating-box');
    if (!form || !nameInput || !carSelect || !emailInput || !textInput || !starGroup || !heading) return;

    /* small style block for new UI bits (keeps style.css untouched) */
    var style = document.createElement('style');
    style.textContent =
        '.star-btn{background:none;border:none;padding:0 2px;font-size:inherit;line-height:1;cursor:pointer;color:#555d66;font-family:inherit}' +
        '.star-btn.is-on{color:#c9a227}' +
        '.star-btn:focus-visible{outline:2px solid #c9a227;outline-offset:2px;border-radius:4px}' +
        '.rv-error{color:#ff6b6b;font-size:13px;margin-top:6px}' +
        '.rv-invalid{border-color:#ff6b6b !important}' +
        '.rv-status{margin-top:16px;color:#7ddc9a;font-size:14px}' +
        '.rv-delete{margin-top:16px;padding:8px 16px;background:none;border:1px solid #ff6b6b;color:#ff6b6b;border-radius:5px;cursor:pointer;font-size:13px}' +
        '.rv-delete:hover,.rv-delete:focus-visible{background:#ff6b6b;color:#111}';
    document.head.appendChild(style);

    /* ---------- star selector ---------- */
    var rating = 0;
    var stars = [];
    starGroup.textContent = '';
    starGroup.setAttribute('role', 'radiogroup');
    starGroup.setAttribute('aria-labelledby', 'reviewRatingLabel');

    function paintStars() {
        stars.forEach(function (btn, i) {
            var n = i + 1;
            btn.classList.toggle('is-on', n <= rating);
            btn.setAttribute('aria-checked', String(n === rating));
            btn.tabIndex = (rating === 0 ? i === 0 : n === rating) ? 0 : -1;
        });
    }
    function setRating(n, focus) {
        rating = n;
        paintStars();
        if (focus && stars[n - 1]) stars[n - 1].focus();
        clearError(starGroup);
    }
    for (var i = 1; i <= 5; i++) {
        (function (n) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'star-btn';
            b.setAttribute('role', 'radio');
            b.setAttribute('aria-label', n + (n === 1 ? ' star' : ' stars'));
            b.textContent = '★';
            b.addEventListener('click', function () { setRating(n, false); });
            b.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setRating(Math.min(5, (rating || n - 1) + 1), true); }
                else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setRating(Math.max(1, (rating || n + 1) - 1), true); }
            });
            stars.push(b);
            starGroup.appendChild(b);
        })(i);
    }
    paintStars();

    /* ---------- errors ---------- */
    function errorFor(el) { return el.parentNode.querySelector('.rv-error[data-for="' + el.id + '"]'); }
    function showError(el, msg) {
        var e = errorFor(el);
        if (!e) {
            e = document.createElement('div');
            e.className = 'rv-error';
            e.id = el.id + 'Error';
            e.setAttribute('data-for', el.id);
            el.parentNode.appendChild(e);
        }
        e.textContent = msg;
        el.setAttribute('aria-invalid', 'true');
        el.setAttribute('aria-describedby', e.id);
        if (el !== starGroup) el.classList.add('rv-invalid');
    }
    function clearError(el) {
        var e = errorFor(el);
        if (e) e.remove();
        el.removeAttribute('aria-invalid');
        el.removeAttribute('aria-describedby');
        el.classList.remove('rv-invalid');
    }

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function validate() {
        var firstBad = null;
        function bad(el, msg) { showError(el, msg); if (!firstBad) firstBad = el; }
        [nameInput, carSelect, emailInput, textInput, starGroup].forEach(clearError);

        if (!nameInput.value.trim()) bad(nameInput, 'Please enter your name.');
        if (!EMAIL_RE.test(emailInput.value.trim())) bad(emailInput, 'Please enter a valid email address.');
        if (!carSelect.value) bad(carSelect, 'Please choose a car.');
        if (rating < 1 || rating > 5) bad(starGroup, 'Please select a rating from 1 to 5 stars.');
        if (!textInput.value.trim()) bad(textInput, 'Please write your review.');
        if (firstBad) (firstBad === starGroup ? stars[0] : firstBad).focus();
        return !firstBad;
    }

    [nameInput, emailInput, textInput].forEach(function (el) {
        el.addEventListener('input', function () { clearError(el); });
    });
    carSelect.addEventListener('change', function () { clearError(carSelect); });

    /* ---------- storage ---------- */
    function load() {
        try {
            var data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            return Array.isArray(data) ? data : [];
        } catch (e) { return []; }
    }
    function makeId() { return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
    function save(list) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); return true; }
        catch (e) { return false; }
    }

    /* ---------- overall rating (existing figures + new reviews) ---------- */
    var baseAvg = null, baseCount = null, avgEl = null, countEl = null;
    if (overall) {
        avgEl = overall.querySelector('h2');
        countEl = overall.querySelector('p');
        var a = avgEl ? parseFloat(avgEl.textContent) : NaN;
        var c = countEl ? parseInt((countEl.textContent.match(/\d+/) || [])[0], 10) : NaN;
        if (!isNaN(a) && !isNaN(c)) { baseAvg = a; baseCount = c; }
    }
    function updateOverview(list) {
        if (baseAvg === null) return;
        var sum = baseAvg * baseCount, n = baseCount;
        list.forEach(function (r) { sum += r.rating; n++; });
        avgEl.textContent = (sum / n).toFixed(1);
        countEl.textContent = 'Based on ' + n + ' Reviews';
    }

    /* ---------- rendering (textContent only) ---------- */
    function el(tag, cls, text) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined) e.textContent = text;
        return e;
    }
    function initials(name) {
        var parts = name.trim().split(/\s+/);
        var s = parts[0].charAt(0) + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : '');
        return s.toUpperCase();
    }
    function buildCard(r) {
        var card = el('div', 'review-card');
        card.setAttribute('data-user-review', '1');

        var header = el('div', 'review-card-header');
        var user = el('div', 'review-user');
        user.appendChild(el('div', 'user-avatar', initials(r.name)));
        var who = document.createElement('div');
        who.appendChild(el('h3', '', r.name));
        who.appendChild(el('p', '', 'Community Review'));
        user.appendChild(who);
        header.appendChild(user);
        var d = new Date(r.date);
        header.appendChild(el('p', 'review-date', isNaN(d) ? '' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })));
        card.appendChild(header);

        card.appendChild(el('p', 'review-car-name', r.car));
        var st = el('div', 'review-stars', '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating));
        st.setAttribute('aria-label', r.rating + ' out of 5 stars');
        card.appendChild(st);
        card.appendChild(el('p', '', r.text));

        var del = el('button', 'rv-delete', 'Delete review');
        del.type = 'button';
        del.setAttribute('aria-label', 'Delete review by ' + r.name);
        del.addEventListener('click', function () { deleteReview(r.id); });
        card.appendChild(del);
        return card;
    }
    function deleteReview(id) {
        if (!window.confirm('Delete this review?')) return;
        save(load().filter(function (r) { return !r || r.id !== id; }));
        render();
    }
    function render() {
        var stored = load();
        var changed = false;
        var list = stored.filter(function (r) {
            return r && typeof r.name === 'string' && typeof r.car === 'string' && typeof r.text === 'string' &&
                r.rating >= 1 && r.rating <= 5;
        });
        list.forEach(function (r) { if (!r.id) { r.id = makeId(); changed = true; } });
        if (changed) save(list);
        document.querySelectorAll('.review-card[data-user-review]').forEach(function (n) { n.remove(); });
        var anchor = heading;
        list.slice().reverse().forEach(function (r) { /* newest first */
            var card = buildCard(r);
            anchor.parentNode.insertBefore(card, anchor.nextSibling);
            anchor = card;
        });
        updateOverview(list);
    }

    /* ---------- submit ---------- */
    var status = null;
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (status) { status.remove(); status = null; }
        if (!validate()) return;

        var list = load();
        list.push({
            id: makeId(),
            name: nameInput.value.trim(),
            car: carSelect.value,
            rating: rating,
            text: textInput.value.trim(),
            date: new Date().toISOString()
        });
        var ok = save(list);
        render();
        form.reset();
        setRating(0, false);

        status = el('div', 'rv-status', ok
            ? 'Thank you! Your review has been added below.'
            : 'Your review was added below, but could not be saved in this browser, so it will disappear on refresh.');
        status.setAttribute('role', 'status');
        form.appendChild(status);
    });
    form.addEventListener('reset', function () {
        setRating(0, false);
        [nameInput, carSelect, emailInput, textInput, starGroup].forEach(clearError);
    });

    render();
})();