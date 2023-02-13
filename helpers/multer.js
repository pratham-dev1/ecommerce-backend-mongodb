const multer = require("multer");
const path = require("path");

const maxSize = 1000000
const storage = multer.diskStorage({
   destination: "./public/uploads/",
   
   filename: function(req, file, cb){
      let myVar = path.extname(file.originalname) === ".pdf" ? "PDF-" : "IMAGE-"
      cb(null, myVar + Date.now() + path.extname(file.originalname));
      }
   }
);

const fileFilter = (req, file, cb) => {
  let fileSize = parseInt(req.headers['content-length'])
   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'|| file.mimetype === 'image/jpg' || file.mimetype === 'application/pdf') {
      if(maxSize >= fileSize){ 
      cb(null, true);
      }
      else{
         req.fileSizeError = "File is too large"
      return cb(null, false, req.fileValidationError);

      }
   } else {
      req.fileValidationError = "Invalid File Format please try jpg, jpeg, png or pdf";
      return cb(null, false, req.fileValidationError);
   }
};

const upload = multer({
   storage: storage,
   limits:{fileSize: maxSize},
   fileFilter:fileFilter,   
})

module.exports = upload