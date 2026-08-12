import mongoose from "mongoose";
import {DB_NAME} from "../constant.js"

const connectDB = async ()=>{
    try {
        const connectionVar =await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MongoDb connected Successfully!! DB Host:${connectionVar.connection.host}`,);
    } catch (error) {
        console.log("\n MongoseDB connection Failed",error);
        process.exit(1);
    }
}
export default connectDB;