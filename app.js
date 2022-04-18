require("dotenv").config();
const bodyParser = require("body-parser");
const http = require("http");
const express = require("express");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const session = require("express-session");
const routes = require("./routes");
const { seedersAdmin } = require("./seeders/Admin")
const { engine } = require("express-handlebars");
const path = require("path");
const fs = require("fs");


const app = express();

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(express.json());
app.use(bodyParser.json());

app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
)

app.use(express.urlencoded({ extended: false }));
app.use("/v2", routes)

app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
  res.render("login/index")
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected successfully"))
  seedersAdmin()
  .catch(console.log);


//connect server
const server = http.createServer(app)
const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log("Server running on port")
});
