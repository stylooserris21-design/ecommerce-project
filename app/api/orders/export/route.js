import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import OrderModel from "@/models/Order.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }

        await connectDB()

        const filter = {
            deletedAt: null
        }

        const getOrder = await OrderModel.find(filter).select("-products").sort({ createdAt: -1 }).lean()

        if (!getOrder) {
            return response(false, 404, 'Collection empty.')
        }

        return response(true, 200, 'Data found.', getOrder)


    } catch (error) {
        return catchError(error)
    }
}