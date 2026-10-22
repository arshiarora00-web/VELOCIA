document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".viewer-360").forEach(function (viewer) {

        let image = viewer.querySelector("img");

        if (!image) return;

        let zoomIn = document.querySelector("#car360ZoomIn");
        let zoomOut = document.querySelector("#car360ZoomOut");
        let reset = document.querySelector("#car360Reset");
        let hint = document.querySelector("#car360Hint");

        let zoom = 1;
        let rotation = 0;
        let dragging = false;
        let startX = 0;
        let startRotation = 0;

        image.style.transition = "transform 0.12s ease-out";
        image.style.transformOrigin = "center center";

        function updateView() {
            image.style.transform =
                "perspective(1000px) rotateY(" + rotation +
                "deg) scale(" + zoom + ")";
        }

        // DRAG TO SIMULATE ROTATION
        viewer.addEventListener("pointerdown", function (event) {
            dragging = true;
            startX = event.clientX;
            startRotation = rotation;

            viewer.setPointerCapture(event.pointerId);
            viewer.style.cursor = "grabbing";

            image.style.transition = "none";
        });

        viewer.addEventListener("pointermove", function (event) {
            if (!dragging) return;

            let difference = event.clientX - startX;

            rotation = startRotation + difference * 0.35;

            updateView();
        });

        function stopDragging() {
            dragging = false;
            viewer.style.cursor = "grab";
            image.style.transition = "transform 0.12s ease-out";
        }

        viewer.addEventListener("pointerup", stopDragging);
        viewer.addEventListener("pointercancel", stopDragging);

        // ZOOM IN
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

        // ZOOM OUT
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

        // RESET VIEW
        if (reset) {
            reset.addEventListener("click", function () {
                zoom = 1;
                rotation = 0;

                updateView();

                if (hint) {
                    hint.textContent =
                        "Drag to explore the car view";
                }
            });
        }

        viewer.style.cursor = "grab";
        viewer.style.touchAction = "pan-y";

        updateView();

    });

});