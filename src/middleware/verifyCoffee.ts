import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

/** create schema when add new egg's data, all of fileds have to be required */
const addDataSchema = Joi.object({
    name: Joi.string().required(),
    size: Joi.string().required(),
    price: Joi.number().min(1).required(),
    image: Joi.allow().optional()
})

/** create schema when edit egg's data, all of fileds allow and optional to sent in request */
const updateDataSchema = Joi.object({
    name: Joi.string().optional(),
    size: Joi.string().optional(),
    price: Joi.number().optional(),
    image: Joi.allow().optional()
})

export const verifyAddCoffee = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = addDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const verifyEditCoffee = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = updateDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}