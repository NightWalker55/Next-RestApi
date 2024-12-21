import { Schema ,model,models} from "mongoose";


const userSchema = new Schema(
    {
    username:{type: "string", required: true,unique : true},
    email:{type: "string", required: true, unique: true},
    password:{type: "string", required: true}   
},
{
    timestamps: true,
}
)
 

const User = models.User || model('User',userSchema)

export default User;