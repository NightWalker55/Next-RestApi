import connect from "@/lib/db"
import User from '@/lib/models/user'
import CategoryModel from "@/lib/models/category"
import { Types } from "mongoose"
import { NextResponse } from "next/server"


export const PATCH = async (request: Request, context:{params:any}) => {
    const categoryId = context.params.category;
    try {
        const body = await request.json();
        const {title} = body;

        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId");

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

        const updatedCategory = await CategoryModel.findByIdAndUpdate(
            categoryId,
            {title},
            {new: true}
        )

        return new NextResponse(JSON.stringify({message:"Category updated",category:updatedCategory}), {status: 200});

    } catch (error) {
        return new NextResponse("Error in updating category", { status: 500 });
    }
}

export const DELETE = async (request: Request, context:{params:any}) => {
    const categoryId = context.params.category;
try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId");

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

        await CategoryModel.findByIdAndDelete(categoryId)

        return new NextResponse(JSON.stringify({message:"Category deleted"}), {status: 200});

} catch (error) {
    return new NextResponse("Error in deleting category", { status: 500 });
}
}