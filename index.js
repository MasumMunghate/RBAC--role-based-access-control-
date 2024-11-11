const express = require('express');
const dotenv = require('dotenv');
const authRoute = require('./route/auth.route');
const projectRoute =require('./route/project.route.js')
const adminRoute = require('./route/user.route.js')
const AppError = require('./utils/appError');
const catchAsync = require('./utils/catchAsync');
const globalErrorHandler = require('./controllers/errorController');
const app  = express();
// require('dotenv').config({path:`${process.cwd()}/.env`}) best way to congig the env
dotenv.config()
app.get('/' , ( req,res)=>{
    res.status(200).json({
        status : "succues",
        message : "Rest API are working"
    })
})


app.use(express.json()); 
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/project',projectRoute);
app.use('/api/v1/admin',adminRoute);

// if invalid route are found
// app.use('*',async(req , res , next)=>{
//     return next(new Error('This is Error')) // if async function use this if not then simpley use normal throu error
//     // res.json({                             
//     //     status : "fail",
//     //     message : "404 route not found"
//     // })
// })

app.use(
    '*',
    catchAsync(async (req, res, next) => {
        throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
    })
);
app.use(globalErrorHandler);
// app.use((err,req,res,next) =>{
//     res.status(400).json({
//         status:'fail',
//         message : err.message
//     })
// })
const PORT = process.env.APP_PORT || 8080
app.listen(PORT, ()=>{
    console.log(`App is running on port ${PORT}`);
})


// if our globle error handler is asysc it willl not throw the error we need to explicitly pass into next methode. globle variable could not handle the async function so we need to use explicityly next method

// in thirth party packeges we while handleing erro we could not use next methode so in that case