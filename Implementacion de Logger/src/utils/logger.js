import winston from "winston"

//Colores permitidos:
//Font styles: bold, dim, italic, underline, inverse, hidden, strikethrough.
// Font foreground colors: black, red, green, yellow, blue, magenta,
// cyan, white, gray, grey.
// Background colors: blackBG, redBG, greenBG, yellowBG, blueBG
// magentaBG, cyanBG, whiteBG

const customOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4
    },
    colors: {
        fatal: 'yellowBG red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        debug: 'green'
    }
}

export const logger = winston.createLogger({
    levels: customOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({colors: customOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({filename: './logs/errors.log', level: 'warn'})
    ]
})



export function requestLogger (req,res,next) {
    logger.info(`Request ${req.method} - ${req.url} - Date: ${new Date().toLocaleString()}`)
    next()
}