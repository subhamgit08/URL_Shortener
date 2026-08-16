import 'dotenv/config';
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import {connectDB} from "./config/mongoDB.js";
import { syncClicksToDatabase } from './controllers/clickSyncer.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();

        setInterval(syncClicksToDatabase, 5 * 60 * 1000);

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error("Failed to start server");
        console.error(err.message);
        process.exit(1);
    }
};

startServer();