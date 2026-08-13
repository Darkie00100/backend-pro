const asyncHandler = (requstHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requstHandler(req,res,next))
        .catch((err)=>next(err))
    }
}





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