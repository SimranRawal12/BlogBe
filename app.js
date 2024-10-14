const express= require('express');
const bodyParser = require("body-parser");
const cors = require('cors')
const app= express();
const router = require("./routes/useRoutes");
const userRouter = require('./routes/signInRoutes')
const multer  = require('multer');

// app.use(express.urlencoded({ extended: false }));


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true // Include cookies in CORS requests (if applicable)
  }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/static', express.static('uploads'));
app.use(cors());
app.use('/Api',router);
app.use('/Api',userRouter);
app.listen(8000, () => {
    console.log("Server is running on 8000")
})