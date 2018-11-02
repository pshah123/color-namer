const colors = require('./colors-1')
const assert = require('assert')
Math.radians = degrees => degrees * Math.PI / 180;

const rgb_to_hsv = (r, g, b) => {
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;
    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }
    return [h*360, s*100, v*100]
}

const hex_to_rgb = hex => {
    let result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null
}

const hsvDistance = (hsv1, hsv2) => (
    ((Math.sin(Math.radians(hsv1[0])) * 100 * (hsv1[1] / 100) * (hsv1[2] / 100) - Math.sin(Math.radians(hsv2[0])) * 100 * (hsv2[1]) / 100 * (hsv2[2]) / 100) ** 2) +
    ((Math.cos(Math.radians(hsv1[0])) * 100 * (hsv1[1] / 100) * (hsv1[2] / 100) - Math.cos(Math.radians(hsv2[0])) * 100 * (hsv2[1]) / 100 * (hsv2[2]) / 100) ** 2) +
    ((hsv1[2] - hsv2[2]) ** 2)
)

const compute = hsv => colors
    .map(c => ((c.distance = hsvDistance(hsv, c.hsv)) && c) || c)
    .sort((c1, c2) => c1.distance < c2.distance ? -1 : 1)

module.exports = {
    "hsvColorName": (h, s, v) => {
        assert(0 <= h && h <= 360, 'Hue should be between 0 and 360')
        assert(0 <= s && s <= 100, 'Saturation should be between 0 and 100')
        assert(0 <= v && v <= 100, 'Vibrance/Brightness should be between 0 and 100')
        return compute([h, s, v])[0]
    },
    "rgbColorName": (r, g, b) => {
        assert(0 <= r && r <= 255, "Red channel should be 0-255")
        assert(0 <= g && g <= 255, "Green channel should be 0-255")
        assert(0 <= b && b <= 255, "Blue channel should be 0-255")
        return compute(rgb_to_hsv(r, g, b))[0]
    },
    "hexColorName": hex => {
        assert(typeof hex === 'string', 'Hex should be a string.')
        if (hex.startsWith('#')) hex = hex.slice(1)
        assert(hex.length == 6, "Requires 6 digit hex code")
        return compute(rgb_to_hsv(...hex_to_rgb(hex)))[0]
    },
    "hsvDistance": hsvDistance,
    "compute": compute,
    "converters": {
        "rgb_to_hsv": rgb_to_hsv,
        "hex_to_rgb": hex_to_rgb
    }
}