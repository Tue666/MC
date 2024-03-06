const fs = require("fs");
const path = require("path");
const multer = require("multer");

const LOCAL_SAVE_FILE_PATH = "uploads";

const storage = {
  filename: (req, file, next) => {
    // Will insert even if file existed
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // next(null, uniqueSuffix + '-' + file.originalname)

    // Will not insert if file existed
    next(null, file.originalname);
  },
};

const fileFilter = (limitFileSize) => (req, file, next) => {
  const fileSize = parseInt(req.headers["content-length"]);
  const extension = path.extname(file.originalname).toLowerCase();
  const allows = [".jpg", ".png", ".jpeg", ".gif"];

  if (fileSize > limitFileSize) {
    next(
      {
        status: 200,
        msg: `Maximum file size is ${limitFileSize}`,
      },
      false
    );
    return;
  }

  if (!allows.includes(extension)) {
    next(
      {
        status: 200,
        msg: `Extension does not allow. Expect ${allows.join(", ")}`,
      },
      false
    );
    return;
  }

  next(null, true);
};

module.exports = (saveToLocal = false, limitFileSize = 1024 * 1024 * 4) => {
  if (saveToLocal) {
    // Create folder if not exists
    if (!fs.existsSync(LOCAL_SAVE_FILE_PATH)) {
      fs.mkdirSync(LOCAL_SAVE_FILE_PATH, { recursive: true });
    }

    // Save the files to local project if necessary
    storage.destination = (req, file, next) => {
      next(null, LOCAL_SAVE_FILE_PATH);
    };
  }

  return multer({
    storage: multer.diskStorage(storage),
    limits: {
      fileSize: limitFileSize,
    },
    fileFilter: fileFilter(limitFileSize),
  });
};
