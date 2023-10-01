export const handleSaveError =  (error, data, next)=>{
    const {name,code} = error
    error.statur = (name ==="MongoServerError" && code === 11000) ? 409:400;
    error.status = 400;
    next();
}