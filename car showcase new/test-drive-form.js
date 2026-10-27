/* VELOCIA - test-drive.html: frontend validation (static demo, no backend) */
(function () {
    'use strict';
    if (window.__velociaTestDriveInit) return;
    window.__velociaTestDriveInit = true;

    var ids = ['tdName', 'tdPhone', 'tdEmail', 'tdCar', 'tdCity', 'tdDate', 'tdTime'];
    var f = {};
    for (var i = 0; i < ids.length; i++) {
        f[ids[i]] = document.getElementById(ids[i]);
        if (!f[ids[i]]) return;
    }
    var form = f.tdName.form;
    if (!form) return;
    form.setAttribute('novalidate', 'novalidate');

    var style = document.createElement('style');
    style.textContent =
        '.td-error{color:#ff6b6b;font-size:13px;margin-top:6px}' +
        '.td-invalid{border-color:#ff6b6b !important}' +
        '.td-success{margin-top:20px;padding:14px 16px;border:1px solid #c9a227;border-radius:6px;color:#E9EEF0;font-size:14px;line-height:1.6}';
    document.head.appendChild(style);

    function pad(n) { return (n < 10 ? '0' : '') + n; }
    var d0 = new Date();
    var today = d0.getFullYear() + '-' + pad(d0.getMonth() + 1) + '-' + pad(d0.getDate());
    f.tdDate.min = today;

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var PHONE_CHARS = /^\+?[\d\s-]+$/;
    var PHONE_RE = /^(?:\+?91)?[6-9]\d{9}$/;
    var TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

    var checks = {
        tdName: function (v) { return v.trim() ? '' : 'Please enter your full name.'; },
        tdPhone: function (v) {
            v = v.trim();
            if (!v) return 'Please enter your phone number.';
            if (!PHONE_CHARS.test(v) || !PHONE_RE.test(v.replace(/[\s-]/g, ''))) return 'Enter a valid 10-digit Indian mobile number (optional +91).';
            return '';
        },
        tdEmail: function (v) {
            v = v.trim();
            if (!v) return 'Please enter your email address.';
            return EMAIL_RE.test(v) ? '' : 'Please enter a valid email address.';
        },
        tdCar: function (v) { return v ? '' : 'Please select a car.'; },
        tdCity: function (v) { return v ? '' : 'Please select a showroom city.'; },
        tdDate: function (v) {
            if (!v) return 'Please choose a date.';
            if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || isNaN(new Date(v + 'T00:00:00'))) return 'Please enter a valid date.';
            return v < today ? 'The date cannot be in the past.' : '';
        },
        tdTime: function (v) {
            if (!v) return 'Please choose a time.';
            return TIME_RE.test(v) ? '' : 'Please enter a valid time.';
        }
    };

    function errEl(el) { return document.getElementById(el.id + 'Error'); }
    function setError(el, msg) {
        var e = errEl(el);
        if (!msg) {
            if (e) e.remove();
            el.removeAttribute('aria-invalid');
            el.removeAttribute('aria-describedby');
            el.classList.remove('td-invalid');
            return false;
        }
        if (!e) {
            e = document.createElement('div');
            e.className = 'td-error';
            e.id = el.id + 'Error';
            el.parentNode.appendChild(e);
        }
        e.textContent = msg;
        el.setAttribute('aria-invalid', 'true');
        el.setAttribute('aria-describedby', e.id);
        el.classList.add('td-invalid');
        return true;
    }

    ids.forEach(function (id) {
        var el = f[id];
        var evt = (el.tagName === 'SELECT' || el.type === 'date' || el.type === 'time') ? 'change' : 'input';
        el.addEventListener(evt, function () { setError(el, checks[id](el.value)); });
        el.addEventListener('blur', function () { if (el.value !== '' || errEl(el)) setError(el, checks[id](el.value)); });
    });

    var success = null;
    function clearSuccess() { if (success) { success.remove(); success = null; } }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearSuccess();
        var first = null;
        ids.forEach(function (id) {
            if (setError(f[id], checks[id](f[id].value)) && !first) first = f[id];
        });
        if (first) { first.focus(); return; }

        var enquiry = {
        id: new Date().getTime(),
        name: f.tdName.value.trim(),
        phone: f.tdPhone.value.trim(),
        email: f.tdEmail.value.trim(),
        car: f.tdCar.value,
        city: f.tdCity.value,
        date: f.tdDate.value,
        time: f.tdTime.value,
        message: document.getElementById('tdMessage')
        ? document.getElementById('tdMessage').value.trim()
        : '',
        status: 'New',
        submittedAt: new Date().toLocaleString()
        };

        var enquiries = [];

        try {
        enquiries = JSON.parse(localStorage.getItem('velocia_enquiries')) || [];
        } catch (error) {
        enquiries = [];
        }

        enquiries.push(enquiry);

        localStorage.setItem('velocia_enquiries', JSON.stringify(enquiries));


        success = document.createElement('div');
        success.className = 'td-success';
        success.setAttribute('role', 'status');
        success.tabIndex = -1;
        success.textContent = 'Thanks, ' + f.tdName.value.trim() + '! Your test drive request for the ' +
            f.tdCar.value + ' at our ' + f.tdCity.value + ' showroom on ' + f.tdDate.value + ' at ' + f.tdTime.value +
            ' has been recorded in this demo. No booking has been made and no dealership has been contacted.';
        form.appendChild(success);
        success.focus();
        form.reset();
    });

    form.addEventListener('reset', function () {
        ids.forEach(function (id) { setError(f[id], ''); });
    });
})();