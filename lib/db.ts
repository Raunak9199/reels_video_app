import mongoose from "mongoose";

const MONGO_DB_URI = process.env.MONGO_URI!

if(!MONGO_DB_URI){
    throw new Error("Please specify MongoDB URI")
}

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {conn: null, promise:null}
}

export async function connectDB(){
    if(cached.conn){
        return cached.conn
    }

    if(!cached.promise){
        const opts = {
            bufferCommands:true,
            maxPoolSize:10
        }

        cached.promise = mongoose
        .connect(MONGO_DB_URI, opts)
        .then(() => mongoose.connection);

        try {
            cached.conn = await cached.promise
           
        } catch (error) {
            cached.promise = null
            console.log(`Error connecting to Mongo DB`)
            throw error

        }
        return cached.conn

    }
}