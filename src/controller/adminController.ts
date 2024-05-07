import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import md5 from "md5"
import { sign } from "jsonwebtoken"

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getAdmin = async (request: Request, response: Response) => {
    try {
        const { search } = request.query
        const allAdmin = await prisma.admin.findMany({
            where: { name: { contains: search?.toString() || "" } }
        })
        /** contains means search name of admin based on sent keyword */

        return response.json({
            status: true,
            data: allAdmin,
            message: `Admin has retrieved`
        }).status(200)  
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const createAdmin = async (request: Request, response: Response) => {
    try {
        const { name, email, password } = request.body /** get requested data (data has been sent from request) */

        /** process to save new admin */
        const newAdmin = await prisma.admin.create({
            data: {
                name, email, password: md5(password)
            }
        })

        return response.json({
            status: true,
            data: newAdmin,
            message: `Admin has created`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const updateAdmin = async (request: Request, response: Response) => {
    try {
        const { id } = request.params /** get id of egg's id that sent in parameter of URL */
        const { name, email, password } = request.body /** get requested data (data has been sent from request) */

        /** make sure that data is exists in database */
        const findAdmin = await prisma.admin.findFirst({ where: { id: Number(id) } })
        if (!findAdmin) return response
            .status(200)
            .json({ status: false, message: `Admin is not found` })

        /** process to update admin's data */
        const updatedAdmin = await prisma.admin.update({
            where: { id: Number(id) },
            data: {
                name: name || findAdmin.name,
                email: email || findAdmin.email,
                password: password ? md5(password) : findAdmin.password
            }
        })

        return response.json({
            status: true,
            data: updatedAdmin,
            message: `Admin has updated`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const dropAdmin = async (request: Request, response: Response) => {
    try {
        const { id } = request.params /** get id of egg's id that sent in parameter of URL */

        /** make sure that data is exists in database */
        const findAdmin = await prisma.admin.findFirst({ where: { id: Number(id) } })
        if (!findAdmin) return response
            .status(200)
            .json({ status: false, message: `Admin is not found` })

        /** process to delete admin's data */
        const deletedAdmin = await prisma.admin.delete({
            where: { id: Number(id) }
        })
        return response.json({
            status: true,
            data: deletedAdmin,
            message: `Admin has deleted`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const authentication = async (request: Request, response: Response) => {
    try {
        const { email, password } = request.body /** get requested data (data has been sent from request) */

        /** find a valid admin based on username and password */
        const findAdmin = await prisma.admin.findFirst({
            where: { email, password: md5(password) }
        })

        /** check is admin exists */
        if (!findAdmin) return response
            .status(200)
            .json({ status: false, logged: false, message: `Username or password is invalid` })

        /** define payload to generate token */
        let payload = JSON.stringify(findAdmin)

        /** define key of generate token */
        let secretKey = process.env.JWT_SECRET_KEY

        /** generate token */
        let token = sign(payload, secretKey || "joss")

        return response
            .status(200)
            .json({ status: true, logged: true, message: `Login Success`, token })
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}