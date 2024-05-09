import mongoose from 'mongoose';

const connectDB = async (URI: string) => {
    try {
        await mongoose.connect(URI);
        console.log("DB connected.");
    } catch (err: any) {
        console.log("DB connection error");
        console.log(err.message);
        process.exit(1);
    }
};

export default connectDB;
