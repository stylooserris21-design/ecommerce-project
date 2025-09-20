import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import ProductModel from "@/models/Product.model";

export async function GET(request) {
    try {

        await connectDB()

        const searchParams = request.nextUrl.searchParams

        // get filters from query params  
        const size = searchParams.get('size')
        const color = searchParams.get('color')
        const minPrice = parseInt(searchParams.get('minPrice')) || 0
        const maxPrice = parseInt(searchParams.get('maxPrice')) || 100000
        const categorySlug = searchParams.get('category')
        const search = searchParams.get('q')



        // pagination 
        const limit = parseInt(searchParams.get('limit')) || 9
        const page = parseInt(searchParams.get('page')) || 0
        const skip = page * limit


        // sorting 
        const sortOption = searchParams.get('sort') || 'default_sorting'
        let sortquery = {}
        if (sortOption === 'default_sorting') sortquery = { createdAt: -1 }
        if (sortOption === 'asc') sortquery = { name: 1 }
        if (sortOption === 'desc') sortquery = { name: -1 }
        if (sortOption === 'price_low_high') sortquery = { sellingPrice: 1 }
        if (sortOption === 'price_high_low') sortquery = { sellingPrice: -1 }


        // find category by slug 
        let categoryId = []
        if (categorySlug) {
            const slugs = categorySlug.split(',')
            const categoryData = await CategoryModel.find({ deletedAt: null, slug: { $in: slugs } }).select('_id').lean()
            categoryId = categoryData.map(category => category._id)
        }

        // match stage  
        let matchStage = {}
        if (categoryId.length > 0) matchStage.category = { $in: categoryId }  // filter by category   

        if (search) {
            matchStage.name = { $regex: search, $options: 'i' }
        }


        // aggregation pipeline  
        const products = await ProductModel.aggregate([
            { $match: matchStage },
            { $sort: sortquery },
            { $skip: skip },
            { $limit: limit + 1 },
            {
                $lookup: {
                    from: 'productvariants',
                    localField: '_id',
                    foreignField: 'product',
                    as: 'variants'
                }
            },
            {
                $addFields: {
                    variants: {
                        $filter: {
                            input: "$variants",
                            as: 'variant',
                            cond: {
                                $and: [
                                    size ? { $in: ["$$variant.size", size.split(',')] } : { $literal: true },
                                    color ? { $in: ["$$variant.color", color.split(',')] } : { $literal: true },
                                    { $gte: ["$$variant.sellingPrice", minPrice] },
                                    { $lte: ["$$variant.sellingPrice", maxPrice] },
                                ]
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    variants: { $ne: [] }
                }
            },
            {
                $lookup: {
                    from: 'medias',
                    localField: 'media',
                    foreignField: '_id',
                    as: 'media'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    mrp: 1,
                    sellingPrice: 1,
                    discountPercentage: 1,
                    media: {
                        _id: 1,
                        secure_url: 1,
                        alt: 1
                    },
                    variants: {
                        color: 1,
                        size: 1,
                        mrp: 1,
                        sellingPrice: 1,
                        discountPercentage: 1,
                    }
                }
            }
        ])



        // check if more data exists 
        let nextPage = null
        if (products.length > limit) {
            nextPage = page + 1
            products.pop() // remove extra item
        }

        return response(true, 200, 'Product data found.', { products, nextPage })

    } catch (error) {
        return catchError(error)
    }
}
