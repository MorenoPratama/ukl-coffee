import express from "express"
import { verifyToken } from "../middleware/authorization"
import { authentication, createAdmin, dropAdmin, getAdmin, updateAdmin } from "../controller/adminController"
import { verifyAddAdmin, verifyAuthentication, verifyEditAdmin } from "../middleware/verifyAdmin"
const app = express()

app.use(express.json())
/** add middleware process to verify token */
app.get(`/`, [verifyToken], getAdmin)

/** add middleware process to verify token and verify request data */
app.post(`/`, [verifyAddAdmin], createAdmin)

/** add middleware process to varify token and verify request data */
app.put(`/:id`, [verifyToken, verifyEditAdmin], updateAdmin)

/** add middleware process to verify token */
app.delete(`/:id`, [verifyToken], dropAdmin)

/** add middleware process to verify token */
app.post(`/auth`, [verifyAuthentication], authentication)
export default app