const multer = require("multer");
const path = require("path");

// multer module code
const uploadPath = path.join(__dirname, "../public"," /uploads");
console.log(path.join(__dirname, "../public/upload"));
const storage = multer.diskStorage({
    destination: uploadPath,
    filename: function (req, file, cb) {
        try {
            cb(
                null,
                file.fieldname + "_" + Date.now() + path.extname(file.originalname)
            );
        } catch (err) {
            console.log("error");
        }
    },
});

const upload = multer({ storage: storage });
module.exports = upload;

