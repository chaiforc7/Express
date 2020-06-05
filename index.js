const express = require("express");
const app = express();
const exhbs = require("express-handlebars");
const bodyParser = require("body-parser");
const flash = require('connect-flash');
const session = require("express-session");
const { ensureAuthenticated } = require('./config/auth');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const passport = require('passport')

app.engine("handlebars", exhbs());
app.set("view engine", "handlebars");

//passport config
require('./config/passport')(passport)

// when you are using a fetch api or just ajax you need to add the line below for it to work
app.use(bodyParser.json());
// assuming you are sending from a form you need to add the line below for it work.
app.use(bodyParser.urlencoded({ extended: false }));

//session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true },
    cookie: { maxAge: 600000 },
  })
);

 //Passprt Middleware
app.use(passport.initialize());
app.use(passport.session())

//connect flash
app.use(flash());

 
app.use("/", require('./routes/routes'))
app.use("/user", require("./routes/users"));

app.use(express.static("public"));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server connected at port ${PORT}`);
});
