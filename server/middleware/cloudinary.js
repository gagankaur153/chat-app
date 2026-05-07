// const multer = require ('multer')
// const { CloudinaryStorage } = require ('multer-storage-cloudinary')
// const cloudinary = require("cloudinary").v2;
// require("dotenv").config()



// const cloudOptions = {
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET

// }

// console.log(process.env.CLOUDINARY_NAME)

// cloudinary.config(cloudOptions)

// // const storage = new CloudinaryStorage({
// //     cloudinary: cloudinary,
// //     params: async (req , file) => {
// //         return {
// //             folder: "chatapp",
// //             allowed_formats: ["jpg", "jpeg", "png", "webp"],
// //             public_id: file.originalname.split('.')[0]
// //         }
// //     }
// // })

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => ({
//     folder: "chatapp",
//     public_id: Date.now() + "-" + file.originalname.split(".")[0],
//     resource_type: "image"
//   })
// });

// const cloudinaryfileuploader = multer({
//     storage: storage
// })

// // console.log("Strogaef0", storage)

// module.exports = cloudinaryfileuploader;
require("dotenv").config({ quiet: true });
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});



const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "chatapp",
    public_id: Date.now() + "-" + file.originalname.split(".")[0],
    resource_type: "image"
  })
});

const upload = multer({ storage });

module.exports = upload;
