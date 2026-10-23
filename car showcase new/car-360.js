
document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".viewer-360").forEach(function (viewer) {

        const image = viewer.querySelector("img");
        const section = viewer.closest(".view-360");

        if (!image || !section) return;

        // Supports both class-based and ID-based buttons
        const zoomIn = section.querySelector(".car360ZoomIn, #car360ZoomIn");
        const zoomOut = section.querySelector(".car360ZoomOut, #car360ZoomOut");
        const reset = section.querySelector(".car360Reset, #car360Reset");
        const hint = section.querySelector(".car360Hint, #car360Hint");

        let zoom = 1;
        let rotation = 0;
        let dragging = false;
        let startX = 0;
        let startRotation = 0;

        function updateView() {
            image.style.transform =
                "perspective(1000px) rotateY(" +
                rotation + "deg) scale(" + zoom + ")";
        }

        // Drag left and right
        viewer.addEventListener("pointerdown", function (event) {
            dragging = true;
            startX = event.clientX;
            startRotation = rotation;

            viewer.setPointerCapture(event.pointerId);
            image.style.transition = "none";
            viewer.style.cursor = "grabbing";
        });
        
viewer.addEventListener("wheel", function (event) {
    event.preventDefault();

    rotation += event.deltaY > 0 ? 10 : -10;

    updateView();
}, { passive: false });


        viewer.addEventListener("pointermove", function (event) {
            if (!dragging) return;

            rotation = startRotation +
                (event.clientX - startX) * 0.35;

            updateView();
        });

        function stopDragging() {
            dragging = false;
            viewer.style.cursor = "grab";
            image.style.transition = "transform 0.12s ease-out";
        }

        viewer.addEventListener("pointerup", stopDragging);
        viewer.addEventListener("pointercancel", stopDragging);

        // Zoom In
        if (zoomIn) {
            zoomIn.addEventListener("click", function () {
                zoom = Math.min(zoom + 0.2, 2.5);
                updateView();

                if (hint) {
                    hint.textContent = "Zoom: " +
                        Math.round(zoom * 100) + "%";
                }
            });
        }

        // Zoom Out
        if (zoomOut) {
            zoomOut.addEventListener("click", function () {
                zoom = Math.max(zoom - 0.2, 1);
                updateView();

                if (hint) {
                    hint.textContent = "Zoom: " +
                        Math.round(zoom * 100) + "%";
                }
            });
        }

        // Reset
        if (reset) {
            reset.addEventListener("click", function () {
                zoom = 1;
                rotation = 0;

                updateView();

                if (hint) {
                    hint.textContent =
                        "Drag left or right to move the view. Use the buttons to zoom.";
                }
            });
        }

        viewer.style.cursor = "grab";
        viewer.style.touchAction = "pan-y";

        image.draggable = false;
        image.style.transformOrigin = "center center";
        image.style.transition = "transform 0.12s ease-out";

        updateView();
    });

});
