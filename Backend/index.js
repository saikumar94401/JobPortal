import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './utils/db.js';
const app = express()
import dotenv from 'dotenv'
import UserRouter from './routes/user.route.js';
dotenv.config({})
// middleware
app.use(cookieParser());
app.use(express.json())
// app.use(cors())


// all user api's


app.use('/api/v1/user',UserRouter);



app.get('/home', (req, res) => {
    return res.status(200).send("hello");
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    connectDB();
    console.log(`port is running at ${PORT}`)
})

