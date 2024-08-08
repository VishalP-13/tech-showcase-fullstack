require("dotenv").config(); //to load environment file

const express = require("express");
const bodyParser = require("body-parser");
const { errorHandler } = require("./utils/errorHandler");
const port = process.env.PORT;
const app = express();

const userRoutes = require("./routes/userRoutes");

// app.use(cookieParser());

app.use(bodyParser.json()); // application/json           //to parse json data from incoming requests
const connectDatabase = require("./db/conn");
connectDatabase();

app.use((req, res, next) => {
  //CORS error setting
  res.setHeader("Access-Control-Allow-Origin", "*"); // It will not send  response, but only set the Header
  res.setHeader(
    "Access-Control-Allow-Methods",
    " GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/user", userRoutes);
app.use(errorHandler);

// app.use((error, req, res, next) => {
//     console.log('Hey I am the error',error);
//     const status = error.statusCode || 500;
//     const message = error.message;
//     const data = error.data;
//     res.status(status).json({
//         message: message,
//         data: data
//     });
// });

app.listen(port || 8080, () => {
  console.log(`Connection is live on port number ${port || 8080}`);
});

// mongoose.connect(process.env.MONGO_URI)
//     .then(() => {
//         app.listen(process.env.PORT || 3000, () => {

//             console.log(`Server started at port: ${process.env.PORT || 3000}`)
//         })
//     })
//     .catch(err => console.log(err))
