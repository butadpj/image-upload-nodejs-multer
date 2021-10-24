const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8001;
const router = express.Router();

const multer = require('multer');

// Home page
app.get('/', (req, res) => { 
  res.send('Hello World'); 
});

// Handles where the image should be store
// you can also change the file name and file extension here
const imageStorage = multer.diskStorage({
  // Destination to store image     
  destination: 'images', 
  filename: (req, file, callback) => {
    callback(
      null, // error message
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}` // file name
    )
  }
  // file.fieldname -> field name of the input - <input name="image">
  // file.originalname -> file name (kasama file extension)
  // path.extname() extracts the extension from file name
});


// Handles the 
const imageUpload = multer({
  storage: imageStorage, // we just set the storage to imageStorage
  limits: {
    fileSize: 5_000_000 // 1 million Bytes = 1 MB
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(png|jpg)$/)) { 
      // upload only png and jpg format
      return callback(new Error('Please upload a valid Image'))
    }
    callback(null, true)
    // first argument is error
    // 2nd is if it accepts file - true/false
  }
});

// Parang kagaya sa ginawa natin last time
// Pero dito maraming handler na yung ginagmait natin
router.post(
  '/single', // /upload/single
  imageUpload.single('image'), // 1st handler
  (req, res) => { // second handler (sending back the file)
    res.send(req.file)
  }, 
  (error, req, res, next) => { // third handler (handling errors)
    res.status(400).send({ error: error.message })
  }
);

// You've probably forget to do this.
// Need to para malaman ng server mo yung mga gagamitin na routes
app.use('/upload', router);  // /upload/...

app.listen(port, () => {
  console.log('Server is up on port ' + port);
  console.log(`Check the app on http://localhost:${port}`);
});