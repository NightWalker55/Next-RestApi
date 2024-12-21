import mongoose from "mongoose";
import { Schema,model,models } from "mongoose";

const Category = new Schema(
    {
    title: { type: String, required: true },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
},
{
    timestamps: true
}

)

const CategoryModel = models.Category || model('Category', Category);

export default CategoryModel;