import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'
import { __dirname } from '../path.js';
import { Router } from 'express';

const doc = Router()

const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Documentacion del curso de Backend',
            decription: 'API Coderhouse Backend'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)

doc.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

export default doc