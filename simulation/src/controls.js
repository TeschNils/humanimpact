const controls = {
    view: { x: 0, y: 0, zoom: 1 },
    viewPos: { prevX: null, prevY: null, isDragging: false },
}

window.mousePressed = e => Controls.move(controls).mousePressed(e)
window.mouseDragged = e => Controls.move(controls).mouseDragged(e);
window.mouseReleased = e => Controls.move(controls).mouseReleased(e)

class Controls {
    static move(controls) {
        function mousePressed(e) {
            controls.viewPos.isDragging = true;
            controls.viewPos.prevX = e.clientX;
            controls.viewPos.prevY = e.clientY;
        }

        function mouseDragged(e) {
            const { prevX, prevY, isDragging } = controls.viewPos;
            if (!isDragging) return;

            const pos = { x: e.clientX, y: e.clientY };
            const dx = pos.x - prevX;
            const dy = pos.y - prevY;
            console.log(controls.view.x, controls.view.y, dx, dy);

            if (prevX || prevY) {
                console.log((((controls.view.x + dx)* transformFactor*controls.view.zoom) + width));
                if ((controls.view.x + dx) <= 0 && ((controls.view.x +dx) >= -(simResX*transformFactor*controls.view.zoom - width))) {
                    controls.view.x += dx;
                }
                if ((controls.view.y + dy) <= 0 && ((controls.view.y +dy) >= -(simResY*transformFactor*controls.view.zoom - height))) {
                    controls.view.y += dy;
                }
                controls.viewPos.prevX = pos.x, controls.viewPos.prevY = pos.y
            }

        }

        function mouseReleased(e) {
            controls.viewPos.isDragging = false;
            controls.viewPos.prevX = null;
            controls.viewPos.prevY = null;
        }

        return {
            mousePressed,
            mouseDragged,
            mouseReleased
        }
    }

    static zoom(controls) {
        function worldZoom(e) {
            const { x, y, deltaY } = e;
            const direction = deltaY > 0 ? -1 : 1;
            const factor = 0.05;
            const zoom = 1 * direction * factor;

            const wx = (x - controls.view.x) / (width * controls.view.zoom);
            const wy = (y - controls.view.y) / (height * controls.view.zoom);

            if (controls.view.zoom + zoom > 1 && controls.view.zoom + zoom < 20) {
                controls.view.x -= wx * width * zoom;
                controls.view.y -= wy * height * zoom;
                controls.view.zoom += zoom;
            }
        }

        return { worldZoom }
    }
}