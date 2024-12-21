import connect from "@/lib/db"
import User from '@/lib/models/user'
import CategoryModel from "@/lib/models/category"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

export const GET = async (request:Request ) => {
    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId");

        if(!userId){
            return new NextResponse("User ID is missing", { status: 400 });
        }
        await connect();

        const user = await User.findById(userId); 
        if(!user){
            return new NextResponse("User not found", { status: 404 });
        }

        const category = await CategoryModel.find({user: userId})

        return new NextResponse(JSON.stringify(category), { status: 200 });


        
    } catch (error) {
        return new NextResponse("Error in fetching users", { status: 500 });
    }
}


export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        const { title } = await request.json();

      
        if (!userId) {
            return new NextResponse("User ID is missing", { status: 400 });
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse("Invalid User ID format", { status: 400 });
        }

        if (!title) {
            return new NextResponse("Category title is missing", { status: 400 });
        }

       
        await connect();

        
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const newCategory = new CategoryModel({
            title: title,
            user: userId, 
        });

        await newCategory.save();

        
        return new NextResponse(
            JSON.stringify({ message: "Category created successfully", category: newCategory }),
            { status: 200 }
        );
    } catch (error: any) {
       
        return new NextResponse(
            JSON.stringify({ message: "Error in creating category", error: error.message }),
            { status: 500 }
        );
    }
};