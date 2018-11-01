const colornamer = require('.')

test('All colors have names', () => {
    for (let r = 0; r < 255; r++)
        for (let g = 0; g < 255; g++)
            for (let b = 0; b < 255; b++)
                expect(colornamer.rgbColorName(r,g,b)).toBeTruthy()
})