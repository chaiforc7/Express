const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const flash = require("connect-flash");
const session = require("express-session")
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");


router.get("/Register", (req, res) => {
  res.render("register");
});

let error = []

router.post("/Register", (req, res) => {
  const { name, email, password, password2 } = req.body;
async function User(res, req) {
  await prisma.users.create({
    data: {
      Name: name,
      Email: email,
      Password: password,
      Password2: password2,
    },
  });
}
  if (password != password2) {
    error.push({ msg: 'Passwords do not match' })
  }

  if (password.length < 8) {
    error.push({ msg: 'Password must be at least 8 characters' })

  }
  console.log(error)
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
                error.push({ msg: "registration successful" });
                }); 
          
          res.redirect("/Login");
        }
        
        
    })
  }
})

router.post("/Login", (req, res, next) => {
  const {email, password } = req.body;
  passport.authenticate('local',
    (err, user, info) => {
      console.log(user);
      console.log(password, user.Password)
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
          return res.redirect('/user/Todo');
      
        })
      }
    })
    (req, res, next)
});

router.get("/Login", (req, res, next) => {
  res.render("login");
})
 



module.exports = router
