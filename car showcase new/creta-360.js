
document.addEventListener("DOMContentLoaded", function () {
    const viewer = document.getElementById("car360Viewer");
    const image = document.getElementById("car360Image");
    const zoomIn = document.getElementById("car360ZoomIn");
    const zoomOut = document.getElementById("car360ZoomOut");
    const reset = document.getElementById("car360Reset");
    const hint = document.getElementById("car360Hint");

    if (!viewer || !image || !zoomIn || !zoomOut || !reset) {
        console.log("Creta viewer elements not found");
        return;
    }

    let zoom = 1;
    let rotation = 0;
    let dragging = false;
    let startX = 0;
    let startRotation = 0;

    function updateView() {
        image.style.transform =
            `perspective(1000px) rotateY(${rotation}deg) scale(${zoom})`;
    }

    viewer.addEventListener("pointerdown", function (e) {
        dragging = true;
        startX = e.clientX;
        startRotation = rotation;
        viewer.setPointerCapture(e.pointerId);
        image.style.transition = "none";
    });

    viewer.addEventListener("pointermove", function (e) {
        if (!dragging) return;

        rotation = startRotation + (e.clientX - startX) * 0.35;
        updateView();
    });

    function stopDrag() {
        dragging = false;
        image.style.transition = "transform 0.12s ease-out";
    }

    viewer.addEventListener("pointerup", stopDrag);
    viewer.addEventListener("pointercancel", stopDrag);

    zoomIn.addEventListener("click", function () {
        zoom = Math.min(zoom + 0.2, 2.5);
        updateView();
        if (hint) hint.textContent = `Zoom: ${Math.round(zoom * 100)}%`;
    });

    zoomOut.addEventListener("click", function () {
        zoom = Math.max(zoom - 0.2, 1);
        updateView();
        if (hint) hint.textContent = `Zoom: ${Math.round(zoom * 100)}%`;
    });

    reset.addEventListener("click", function () {
        zoom = 1;
        rotation = 0;
        updateView();
        if (hint) {
            hint.textContent =
                "Drag left or right to move the view. Use the buttons to zoom.";
        }
    });

    viewer.style.cursor = "grab";
    viewer.style.touchAction = "pan-y";
    image.style.transformOrigin = "center center";
    image.style.transition = "transform 0.12s ease-out";

    updateView();
});
