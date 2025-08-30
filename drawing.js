// this module contains functionality to draw the layout of a node tree
// on a given Cairo context

const TAU = Math.PI * 2;

// blueish default / fallback colors
const DefaultColors = {
    background: {
        r: 12 / 255,
        g: 117 / 255,
        b: 222 / 255,
        a: 0.3
    },
    highlight: {
        r: 12 / 255,
        g: 117 / 255,
        b: 222 / 255,
        a: 0.6
    },
    border: {
        r: 0 / 255,
        g: 255 / 255,
        b: 0 / 255,
        a: 1
    }
}

function drawRoundedRect(cr, rect, radius, fillColor, strokeColor) {
    let { x, y, width, height } = rect;

    let drawPath = function () {
        // Start a new path for the rounded rectangle
        cr.newPath();

        // Move to starting point
        cr.moveTo(x + radius, y);

        // Top edge and top-right corner
        cr.lineTo(x + width - radius, y);
        cr.arc(x + width - radius, y + radius, radius, -TAU / 4, 0);

        // Right edge and bottom-right corner 
        cr.lineTo(x + width, y + height - radius);
        cr.arc(x + width - radius, y + height - radius, radius, 0, TAU / 4);

        // Bottom edge and bottom-left corner
        cr.lineTo(x + radius, y + height);
        cr.arc(x + radius, y + height - radius, radius, TAU / 4, TAU / 2);

        // Left edge and top-left corner
        cr.lineTo(x, y + radius);
        cr.arc(x + radius, y + radius, radius, TAU / 2, TAU * 3 / 4);

        cr.closePath();
    }

    // fill the region
    cr.setSourceRGBA(fillColor.r, fillColor.g, fillColor.b, fillColor.a);
    drawPath();
    cr.fill();

    // draw the border
    cr.setSourceRGBA(strokeColor.r, strokeColor.g, strokeColor.b, strokeColor.a);
    drawPath();
    cr.stroke();
}

function addMargins(rect, margin) {
    return {
        x: rect.x + margin,
        y: rect.y + margin,
        width: rect.width - margin * 2,
        height: rect.height - margin * 2
    }
}

function drawLayout(cr, node, displayRect, colors = DefaultColors, cornerRadius = 10) {
    if (!node) return;

    // Draw current node
    let rect = node.rect;

    // Offset by monitor displayRect
    let x = rect.x - displayRect.x;
    let y = rect.y - displayRect.y;
    let width = rect.width;
    let height = rect.height;

    // draw the region of a leaf node
    if (node.isLeaf()) {
        let c = colors.background;
        if (node.isHighlighted) {
            // highlighted regions have a more active color
            c = colors.highlight;
        }
        cr.setSourceRGBA(c.r, c.g, c.b, c.a);

        let regionRect = addMargins({ x, y, width, height }, node.margin);
        drawRoundedRect(cr, regionRect, cornerRadius, c, colors.border);
    }

    for (let child of node.children) {
        drawLayout(cr, child, displayRect, colors, cornerRadius);
    }
}

module.exports = {
    drawLayout,
    DefaultColors
};