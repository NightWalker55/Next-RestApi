import mongoose from "mongoose";
import { Schema,model,models } from "mongoose";


const BlogSchema = new Schema(
    {
    title: { type: String, required: true },
    description: { type: String},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
},
{
    timestamps: true
}
)

const Blog = models.Blog || model('Blog',BlogSchema)

export default Blog;