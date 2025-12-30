const express = require('express');
const dotenv = require('dotenv')
const dbConnect = require('./dbConnect')
const authRouter = require('./router/authRouters');
const postsRouters = require('./router/postsRouter')
const userRouters = require('./router/userRouters')
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const cors = require('cors')
const cloudinary = require('cloudinary').v2;

dotenv.config('./.env')

//Configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

//middleware
// app.use(express.json())
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(morgan('common'))
app.use(cookieParser())
app.use(cors({
    credentials: true,
    // origin: process.env.FRONT_END_URL || 'http://localhost:3000'
    origin:"https://social-media-beta-dusky.vercel.app"
}))

app.use('/auth', authRouter)
app.use('/posts', postsRouters)
app.use('/user', userRouters)
app.get('/', (req,res)=>{
    res.status(200).send('ok from server')
})

const PORT = process.env.PORT;
dbConnect()
app.listen(PORT, ()=>{
    console.log(`listening on port: ${PORT} `)
})