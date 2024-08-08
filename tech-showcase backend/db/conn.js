const mongoose = require("mongoose");

const dotenv = require("dotenv")
dotenv.config()
const DB_URI = process.env.MONGO_URI

const connectDatabase = () => {
mongoose
    .connect(DB_URI)
    .then((data) => {
        console.log("Database Connection Successful...!!😊😊")
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((e) => {
        console.log(e)
    })
}

module.exports = connectDatabase;