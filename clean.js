const colors = require('./colors')
const fs = require('fs')
Math.radians = degrees => degrees * Math.PI / 180;

const hsvDistance = (hsv1, hsv2) => (
    ((Math.sin(Math.radians(hsv1[0])) * 100 * (hsv1[1] / 100) * (hsv1[2] / 100) - Math.sin(Math.radians(hsv2[0])) * 100 * (hsv2[1]) / 100 * (hsv2[2]) / 100) ** 2) +
    ((Math.cos(Math.radians(hsv1[0])) * 100 * (hsv1[1] / 100) * (hsv1[2] / 100) - Math.cos(Math.radians(hsv2[0])) * 100 * (hsv2[1]) / 100 * (hsv2[2]) / 100) ** 2) +
    ((hsv1[2] - hsv2[2]) ** 2)
)

const compute = hsv => colors
    .map(c => ((c.distance = hsvDistance(hsv, c.hsv)) && c) || c)
    .sort((c1, c2) => c1.distance < c2.distance ? -1 : 1)

const clean = thresh => colors.filter(color => compute(color.hsv)[1].distance < thresh)

module.exports =
    thresh =>
        fs.writeFile(`colors-${thresh}.js`, `module.exports = ${JSON.stringify(clean(thresh))}`, 'utf8')