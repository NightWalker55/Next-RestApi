import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI 

const connect = async()=>{
    const connectionState = mongoose.connection.readyState;

    if(connectionState === 1){
        console.log('Already connected')
        return;
    }
     if(connectionState === 2){
        console.log('Connecting...');
    }

    try {
        mongoose.connect(MONGODB_URI!) 
        .then(()=>console.log('Database connection established'))
    } catch (error) {
        console.log(error)
    }
}

export default connect;


