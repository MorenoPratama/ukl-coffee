import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const getAllOrders = async (request: Request, response: Response) => {
    try {
        const { search } = request.query
        const allOrders = await prisma.order_list.findMany({
            where: {
                OR: [
                    { customer_name: { contains: search?.toString() || "" } },
                    { order_type: { contains: search?.toString() || "" } }
                ]
            },
            orderBy: { order_date: "desc" },
            include: { order_detail: true }
        })
        return response.json({
            status: true,
            data: allOrders,
            message: `Order list has retrieved`
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

export const createOrder = async (request: Request, response: Response) => {
    try {
        const { customer_name, order_type, order_date, order_detail } = request.body
        
        const newOrder = await prisma.order_list.create({
            data: { customer_name, order_type, order_date, }
        })

        for (let index = 0; index < order_detail.length; index++) {
            const { coffee_id, quantity, price } = order_detail[index]
            await prisma.order_detail.create({
                data: {
                    order_id: newOrder.id,
                    coffee_id: Number(coffee_id), 
                    quantity: Number(quantity), 
                    price: Number(price),
                }
            })
        }
        return response.json({
            status: true,
            data: newOrder,
            message: `New Order has created`
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

export const dropOrder = async (request: Request, response: Response) => {
    try {
        const { id } = request.params

        const findOrder = await prisma.order_list.findFirst({ where: { id: Number(id) } })
        if (!findOrder) return response
            .status(200)
            .json({ status: false, message: `Order is not found` })

        let dropOrderDetail = await prisma.order_detail.deleteMany({ where: { order_id: Number(id) } })
        let dropOrder = await prisma.order_list.delete({ where: { id: Number(id) } })

        return response.json({
            status: true,
            data: dropOrder,
            message: `Order has deleted`
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