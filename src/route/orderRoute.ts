import express from 'express'
import { getAllOrders, createOrder, dropOrder } from '../controller/orderController'
import { verifyAddOrder } from '../middleware/verifyOrder'

const app = express()
app.use(express.json())

app.get('/', getAllOrders)
app.post('/', [ verifyAddOrder ], createOrder)
app.delete('/:id', dropOrder)

export default app