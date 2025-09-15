// **** promises:- 
const asyncHandler = (requestHandler) => {
    (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch(next);
    }
}

export {asyncHandler};

// -> **** try catch block
// const asyncHandler =() => {} // this is basic u know it, 
// const asyncHandler =(fn) => {} // this is also basic u know it, if u wanna pass another fucntion (above one in this line)--> do it as below
// const asyncHandler = (fn) => {() =>{}}
// const asyncHandler = (fn) => async () => {}; // its like this, but in the main code we hv just removed the {} -- for inner most code
      // if u wanna make it async, just add async to futnion u wanna makr async

// const asyncHandler = (fn) => async (req,res,next) => {
//     try {
//         await fn(req,res,next)

//     } catch(err){
//         res.status(err.code || 500).json({
//             success : false,
//             message: err.message
//         })
//     }
// }