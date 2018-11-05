const colors = require('./colors-x11')
const assert = require('assert')

const hex_to_rgb = hex => {
    let result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null
}

const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const distance = (rgb1, rgb2) => {
    if (typeof rgb1 == 'string') rgb1 = rgb1.split(/, */g).map(c => parseInt(c))
    if (typeof rgb2 == 'string') rgb2 = rgb2.split(/, */g).map(c => parseInt(c))
    if (rgb1.r) rgb1 = [rgb1.r, rgb1.g, rgb1.b]
    if (rgb2.r) rgb2 = [rgb2.r, rgb2.g, rgb2.b]
    return ((rgb2[0] - rgb1[0])**2 + (rgb2[1] - rgb1[1])**2 + (rgb2[2] - rgb1[2])**2)**0.5
}

const compute = rgb => colors
    .map(c => ((c.distance = distance(rgb, c.rgb)) && c) || c)
    .sort((c1, c2) => c1.distance < c2.distance ? -1 : 1)

module.exports = {
    "rgbColorName": (r, g, b) => {
        assert(0 <= r && r <= 255, "Red channel should be 0-255")
        assert(0 <= g && g <= 255, "Green channel should be 0-255")
        assert(0 <= b && b <= 255, "Blue channel should be 0-255")
        let nearestColor = compute([r, g, b])[0]
        return nearestColor.distance < 40 ? nearestColor : {
            "name": `(${r}, ${g}, ${b})`,
            "hex": rgbToHex(r,g,b),
            "rgb": `${r},${g},${b}`
        }
    },
    "hexColorName": hex => {
        assert(typeof hex === 'string', 'Hex should be a string.')
        if (hex.startsWith('#')) hex = hex.slice(1)
        assert(hex.length == 6, "Requires 6 digit hex code")
        let nearestColor = compute(hex_to_rgb(hex))[0]
        return nearestColor.distance < 40 ? nearestColor : {
            "name": '#' + hex,
            "hex": hex,
            "rgb": hex_to_rgb(hex).join(',')
        }
    },
    "distance": distance,
    "compute": compute,
    "hex_to_rgb": hex_to_rgb
}