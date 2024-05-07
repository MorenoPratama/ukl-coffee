/** memanggil library express */
import express from "express"
import AdminRoute from "./route/adminRoute"
import CoffeeRoute from "./route/coffeeRoute"
import OrderRoute from "./route/orderRoute"

/** buat wadah untuk inisiasi express */
const app = express()

/** mendefinisikan PORT berjalannya server */
const PORT = 8000

app.use(`/admin`, AdminRoute)
app.use(`/coffee`, CoffeeRoute)
app.use(`/order`, OrderRoute)

/** run server */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})