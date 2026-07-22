import mongoose from 'mongoose';

let isConnected = false;

export async function connect() {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });

        connection.on('error', (err) => {
            console.log('MongoDB connection error: ' + err);
        });

        isConnected = true;
    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
    }
}