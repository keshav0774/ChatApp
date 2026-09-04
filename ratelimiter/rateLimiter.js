import redisClient from "../config/redis.js";

export const unauthenticatedRatelimiter = async(req,res,next)=>{
    try {
        // for unauthenticate user be use their IP address:

        const ip = req.ip;

        const key = `rate-limit:ipaddress:${ip}`;

       const limit = await redisClient.incr(key);

       if(limit === 1){
        await redisClient.expire(key,60);
       }else{
        if(limit>12){
            const remainTime = await redisClient.ttl(key);
            return res.status(401).json({
               message : `To many request. Try again after ${remainTime} ` 
            });
        }
       }
       next();
    } catch (error) {
        console.log("Unauthorized rate limiter error:", error.message);

        next();
    }
};

export const authenticateRatelimiter = async(req,res,next)=>{
    try {
        const {_id} = req.user._id;

        const key = `rate-limiter:userId : ${_id}`;

        const limit = await redisClient.incr(key);

        if(limit === 1){
           await redisClient.expire(key,90);
        }else{
            if(limit > 15){
                const remainTime = await redisClient.ttl(key);
                res.status(401).json({
                    message : `To many request. Try again after ${remainTime} time`
                })
            }
        }
        next();
    } catch (error) {
        console.log("Authenticate RateLimiter Error:", error.message);
        next();
    }
}