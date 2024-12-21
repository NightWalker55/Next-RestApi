import connect from "@/lib/db"
import User from '@/lib/models/user'
import CategoryModel from "@/lib/models/category"
import Blog from "@/lib/models/blogs"
import { Types } from "mongoose"
import { NextResponse } from "next/server"


export const GET = async (request: Request, context:{params:any}) => {
    const blogId = context.params.blog;
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");


        if(!userId) {
            return new NextResponse("User ID is missing", { status: 400 });
        }

        if(!categoryId){
            return new NextResponse("Category ID is missing", { status: 400 });
        }

        if(!blogId){
            return new NextResponse("Blog ID is missing", { status: 400 });
        }

        await connect();
        
        const user = await User.findById(userId);

        if(!user){
            return new NextResponse("User not found", { status: 404 });
        }

        const category = await CategoryModel.findOne({_id:categoryId,user:userId})

        if(!category){
            return new NextResponse("Category not found", { status: 404 });
        }

        const blog = await Blog.findOne({
            _id: blogId,
            category: categoryId,
            user: userId
        })

        if(!blog){
            return new NextResponse("Blog not found", { status: 404 });
        }
        
        return new NextResponse(JSON.stringify({blog}), { status: 200 });
        
    } catch (error) {
        return new NextResponse("Error in fetching blog", { status: 500 });
    }
}


export const PATCH = async (request: Request, context:{params:any}) => {
    const blogId = context.params.blog;
    try {
        const body = await request.json();
        const {title,description} = body;

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if(!userId) {
            return new NextResponse("User ID is missing", { status: 400 });
        }

        if(!blogId){
            return new NextResponse("Blog ID is missing", { status: 400 });
        }

        await connect();

        const user = await User.findById(userId);

        if(!user){
            return new NextResponse("User not found", { status: 404 });
        }

        const blog = await Blog.findOne({
            _id: blogId,
            user: userId
        })

        if(!blog){
            return new NextResponse("Blog not found", { status: 404 });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {title, description},
            {new: true}
        )

        return new NextResponse(JSON.stringify({message:"Blog updated", blog:updatedBlog}), {status: 200});

    } catch (error) {
        return new NextResponse("Error in updating blog", { status: 500 });
    }
}


export const DELETE = async (request: Request, context:{params:any}) => {
    const blogId = context.params.blog;
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if(!userId) {
            return new NextResponse("User ID is missing", { status: 400 });
        }

        if(!blogId){
            return new NextResponse("Blog ID is missing", { status: 400 });
        }

        await connect();

        const user = await User.findById(userId);

        if(!user){
            return new NextResponse("User not found", { status: 404 });
        }

        const blog = await Blog.findOne({
            _id: blogId,
            user: userId
        })

        if(!blog){
            return new NextResponse("Blog not found", { status: 404 });
        }

        await Blog.findByIdAndDelete(blogId)

        return new NextResponse(JSON.stringify({message:"Blog deleted"}), {status: 200});
    } catch (error) {
        return new NextResponse("Error in deleting blog", { status: 500 });
    }
}
