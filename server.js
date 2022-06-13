require('dotenv').config({path : "./config.env"});
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const app = express();


const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const connectDB= require('./database/db');
connectDB();

app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cors);
app.use(cookieParser())
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})