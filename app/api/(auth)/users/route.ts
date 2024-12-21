import connect from "@/lib/db"
import User from '@/lib/models/user'
import { Types } from "mongoose"
import { NextResponse } from "next/server"



export const GET = async()=>{

    try {
           await connect();
            const users = await User.find();
            return new NextResponse(JSON.stringify(users),{status: 200});
    } catch (error) {
        return new NextResponse("Error in fetching users",{status: 500})
    }
}

export const POST = async(request: Request)=>{

    try {
        const body = await request.json();
        await connect();
        const user = new User(body); 
        await user.save();
        return new NextResponse(JSON.stringify({message:"User is created",user:user}),{status: 200});
    } catch (error) {
        return new NextResponse("Error in creating user",{status: 500})
    }

}

export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const { userId, newUsername } = body;

        if (!userId || !newUsername) {
            return new NextResponse("User ID or new username is missing", { status: 400 });
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse("Invalid user ID format", { status: 400 });
        }

        await connect();

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId }, 
            { username: newUsername },
            { new: true } 
        );

        if (!updatedUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        
        return new NextResponse(
            JSON.stringify({ message: "User updated successfully", user: updatedUser }),
            { status: 200 }
        );
    } catch (error:any) {
        return new NextResponse(
            JSON.stringify({ message: "Error in updating user", error: error.message }),
            { status: 500 }
        );
    }
};


export const DELETE = async (request:Request)=>{
    try {
        const {searchParams} = new URL(request.url)
        const userId = searchParams.get("userId");
        
        if (!userId) {
            return new NextResponse("User ID is missing", { status: 400 });
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse("Invalid user ID format", { status: 400 });
        }

        await connect();

        const deleteUser = await User.findByIdAndDelete(userId);

        if (!deleteUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        return new NextResponse(JSON.stringify({message:"User deleted successfully"}),{status:200})

    } catch (error) {
        return new NextResponse("Error in deleting users",{status: 500})
    }
}