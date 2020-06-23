const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const flash = require("connect-flash");
const session = require("express-session")
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");
const faker = require('faker')
let multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

const today = moment();


let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "C:/Users/Onyebuchi/Desktop/Express/public");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + '-' + file.originalname);
  },
});


let upload = multer({ storage: storage });
router.get("/Register", (req, res) => {
  req.session.is_Follow = false;
  res.render("register");
});

let error = []
//try and check it 
router.post("/Register", upload.single('avatar'), (req, res) => {
  let sampleFile = `${req.file.filename}`
  const { name, email, password, password2 } = req.body;
  async function User(res, req) {
  await prisma.users.create({
    data: {
      Name: name,
      Email: email,
      Password: password,
      Password2: password2,
      Avatar: sampleFile
    },
  });
}
  if (password != password2) {
    error.push({ msg: 'Passwords do not match' })
  }

  if (password.length < 8) {
    error.push({ msg: 'Password must be at least 8 characters' })

  }
  console.log(password, password2)
  if (error.length > 0) {
    res.render('register',{
      error, 
      name,
      email,
      password,
    password2})
  }
  else {
    prisma.users.findOne({
      where: {
        Email: email
      }
    }
     )
      .then(user => {
        if (user) {
          error.push({ msg: 'Email has already been registered' })
          res.render("register", {
            error,
            name,
            email,
            password,
            password2,
          });
           error = [];
        }
        else {
              User(res, req)
                .catch((e) => {
                  throw e;
                })
                .finally(async () => {
                  await prisma.disconnect();
                }); 
          
          res.redirect("/Login");
        }
        
        
    })
  }
})

router.post("/Login", (req, res, next) => {
  const { email, password } = req.body;
  
  passport.authenticate('local',
    (err, user, info) => {
      if (err) {
        error.push({ msg: "You are not Registered" });
        res.render("login", {
          error,
        });
        error = []
      }
      if (!user || password != user.Password) {
        error.push({ msg: "Incorrect Email or password" });
        res.render("login", {
          error
        });
        error = []
       
      }
      else {
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          if (req.session.is_Follow) {
            return res.redirect(`/user/Profile`)
            
          } else {
            return res.redirect("/user/dashboard");
          }
          
      
        })
      }
    })
    (req, res, next)
});

router.get("/Login", (req, res, next) => {
  res.render("login");
})

router.get("/Home", (req, res, next) => {
  req.session.is_Follow = false;
  res.render("Home");
});


router.get("/Contact", (req, res, next) => {
  req.session.is_Follow = false;
  res.render("Contact");
});


async function BlogHome(req, res, user) {
  const Posts = await prisma.posts.findMany(); 
  
  Posts.forEach((element) => {
    element.Created_at = moment(element.Created_at).fromNow();

  });
  Posts.sort(element => element.Created_at)
  res.render('Blog', {
    data: Posts
  })  
  req.session.is_Follow = false;

};

router.get("/Blog", (req, res, next) => {
  BlogHome(req, res)
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.disconnect();
    });
});


router.get(`/Follow/:Email`, (req, res, err) => {
  req.session.is_Follow = true
  req.session.Email = req.params.Email;
  res.render('login') 
})



module.exports = router
