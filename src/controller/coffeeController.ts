import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs"
import { BASE_URL } from "../global";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getAllCoffees = async (request: Request, response: Response) => {
    try {
        const { search } = request.query
        const allCoffees = await prisma.coffee.findMany({
            where: { name: { contains: search?.toString() || "" } },
            orderBy: { name: 'asc' }
        })
        return response.json({
            status: true,
            data: allCoffees,
            message: `Coffees has retrieved`
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

export const createCoffee = async (request: Request, response: Response) => {
    try {
        const { name, size, price } = request.body

        let filename = ""
        if (request.file) filename = request.file.filename 

        const newCoffee = await prisma.coffee.create({
            data: { name, size, price: Number(price), image: filename }
        })

        return response.json({
            status: true,
            data: newCoffee,
            message: `New Coffee has created`
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

export const updateCoffee = async (request: Request, response: Response) => {
    try {
        const { id } = request.params
        const { name, size, price } = request.body

        const findCoffee = await prisma.coffee.findFirst({ where: { id: Number(id) } })
        if (!findCoffee) return response
            .status(200)
            .json({ status: false, message: `Coffee is not found` })

        let filename = findCoffee.image 
        if (request.file) {
            filename = request.file.filename
            // Delete old image file
            let path = `${BASE_URL}/public/coffee-image/${findCoffee.image}`
            const imageExists = fs.existsSync(path);

            if (imageExists && findCoffee.image !== '') {
                fs.unlinkSync(path);
            }
        }

        const updatedCoffee = await prisma.coffee.update({
            data: {
                name: name || findCoffee.name,
                size: size || findCoffee.size,
                price: price ? Number(price) : findCoffee.price,
                image: filename
            },
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: updatedCoffee,
            message: `Coffee has updated`
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

export const dropCoffee = async (request: Request, response: Response) => {
    try {
        const { id } = request.params

        const findCoffee = await prisma.coffee.findFirst({ where: { id: Number(id) } })
        if (!findCoffee) return response
            .status(200)
            .json({ status: false, message: `Coffee is not found` })

        if (findCoffee && findCoffee.image) {
            let path = `${BASE_URL}/public/coffee-image/${findCoffee.image}`
            let exists = fs.existsSync(path)
            if (exists && findCoffee.image !== ``) fs.unlinkSync(path)
        }

        const deletedCoffee = await prisma.coffee.delete({
            where: { id: Number(id) }
        })

        return response.json({
            status: true,
            data: deletedCoffee,
            message: `Coffee has deleted`
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