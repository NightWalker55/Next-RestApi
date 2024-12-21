import connect from "@/lib/db"
import User from '@/lib/models/user'
import CategoryModel from "@/lib/models/category"
import Blog from "@/lib/models/blogs"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

export const GET = async (request:Request ) => {
    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");
        const searchKeywords = searchParams.get("keywords") as string;
        const startDate = searchParams.get("startDate")
        const endDate = searchParams.get("endDate")
        const page = parseInt(searchParams.get("page")||"1");
        const limit= parseInt(searchParams.get("limit") || "10");

        if(!userId) {
            return new NextResponse("User ID is missing", { status: 400 });
        }

        if(!categoryId){
            return new NextResponse("Category ID is missing", { status: 400 });
        }

        await connect()

        const user = await User.findById(userId);

        if(!user){
            return new NextResponse("User not found", { status: 404 });
        }
        
        const category = await CategoryModel.findOne({_id:categoryId,user:userId})

        if(!category){
            return new NextResponse("Category not found", { status: 404 });
        }

        const filter: any = {
            category: new Types.ObjectId(categoryId),
            user: new Types.ObjectId(userId)
        }

        if(searchKeywords){
            filter.$or = [
                {
                    title: { $regex: searchKeywords, $options: 'i' },
                },
                {
                    description: { $regex: searchKeywords, $options: 'i' }
                }
            ]
        }

        if(startDate && endDate){
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }
        else if(startDate){
            filter.createdAt = {
                $gte: new Date(startDate)
            }
        }
        else if(endDate){
            filter.createdAt = {
                $lte: new Date(endDate)
            }
        }

        const skip = (page-1)* limit
        const blogs = await Blog.find(filter).skip(skip).limit(limit)

        return new NextResponse(JSON.stringify({blogs}), {status: 200});

    } catch (error:any) {
        return new NextResponse(JSON.stringify({message:"Error in getting blogs"}),{status:500})
    }
}

export const POST = async (request: Request) => {
    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        const body = await request.json();
        const {title, description} = body;

        if(!userId) {
            return new NextResponse("User ID is missing", { status: 400 });
        }

        if(!categoryId){
            return new NextResponse("Category ID is missing", { status: 400 });
        }

        await connect()

        const user = await User.findById(userId);

        if(!user){
            return new NextResponse("User not found", { status: 404 });
        }
        
        const category = await CategoryModel.findOne({_id:categoryId,user:userId})

        if(!category){
            return new NextResponse("Category not found", { status: 404 });
        }


        const newBlog = new Blog({
            title,
            description,
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId),
        })

        await newBlog.save()

        return new NextResponse(JSON.stringify({message:"Blog created successfully", blog: newBlog}),{status:200})

    } catch (error) {
        return new NextResponse(JSON.stringify({message:"Error in creating blogs"}),{status:500})
    }
}
