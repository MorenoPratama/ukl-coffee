import express from "express"
import { verifyToken } from "../middleware/authorization"
import uploadFile from "../middleware/uploadImage"
import { createCoffee, dropCoffee, getAllCoffees, updateCoffee } from "../controller/coffeeController"
import { verifyAddCoffee, verifyEditCoffee } from "../middleware/verifyCoffee"
const app = express()

app.use(express.json())
app.get('/', getAllCoffees )
app.delete('/:id', [verifyToken] , dropCoffee)
app.post('/', [verifyToken, uploadFile.single("image")],verifyAddCoffee, createCoffee)
app.put('/:id', [verifyToken, uploadFile.single("image"), verifyEditCoffee ], updateCoffee)
export default app