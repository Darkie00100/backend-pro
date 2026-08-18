const asyncHandler = (requstHandler)=>{
   return (req,res,next)=>{
        Promise.resolve(requstHandler(req,res,next))
        .catch((err)=>next(err))
    }
}
export {asyncHandler}




/*const asyncHandler = (requstHandler)=>async(req,res,next)=>{
    try {
        await requstHandler(req,res,next)
    } catch (error) {
        res.status(errror.code||500).json({
            success:false,
            message: error.message
        })

    }
}*/