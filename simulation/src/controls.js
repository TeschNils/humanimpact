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

            if (prevX || prevY) {
                
                let leftBound = 0;
                let topBound = 0;
                let rightBound = -(simResX*transformFactor*controls.view.zoom - width);
                let bottomBound = -(simResY*transformFactor*controls.view.zoom - height);
                // If the view goes out of bounds of the canvas, only allow dragging in the direction that keeps the view within the bounds
                if ((controls.view.x + dx) > leftBound && (dx < 0)) {
                    controls.view.x += dx;
                }
                if ((controls.view.y + dy) > topBound && (dy < 0)) {
                    controls.view.y += dy;
                }
                if ((controls.view.x + dx) < rightBound && (dx > 0)) {
                    controls.view.x += dx;
                }
                if ((controls.view.y + dy) < bottomBound && (dy > 0)) {
                    controls.view.y += dy;
                }
                
                // If the view is within the bounds of the canvas, allow dragging in all directions
                if ((controls.view.x + dx) <= leftBound && (controls.view.x +dx) >= rightBound) {
                    controls.view.x += dx;
                }
                if ((controls.view.y + dy) <= topBound && (controls.view.y +dy) >= bottomBound) {
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
            const factor = 0.1;
            const zoom = 1 * direction * factor;

            const wx = (x - controls.view.x) / (width * controls.view.zoom);
            const wy = (y - controls.view.y) / (height * controls.view.zoom);

            if (controls.view.zoom + zoom >= 1 && controls.view.zoom + zoom < 3) {

                let leftBound = 0;
                let topBound = 0;
                let rightBound = -(simResX*transformFactor*(controls.view.zoom+zoom) -width);
                let bottomBound = -(simResY*transformFactor*(controls.view.zoom+zoom) -height);

                let nextX = controls.view.x - wx * width * zoom;
                let nextY = controls.view.y - wy * height * zoom;
                if (nextX > leftBound) nextX = leftBound;
                if (nextY > topBound) nextY = topBound;
                if (nextX < rightBound) nextX = rightBound;
                if (nextY < bottomBound) nextY = bottomBound;
                controls.view.x = nextX;
                controls.view.y = nextY;
                controls.view.zoom += zoom;
            }
        }

        return { worldZoom }
    }
}