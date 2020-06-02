const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const { ensureAuthenticated } = require('../config/auth');

router.get("/dashboard",  (req, res) => {
  res.render("welcome");
});

router.get("/quotes",  (req, res, next) => {
  // async function getQuote() {
  //   const response = await fetch("https://api.quotable.io/random")
  //   const data = await response.json()
  //   const { content, author } = data;
  // }
  // getQuote()
  //   .catch(err => console.log(err))
  //   .then(res => {
  //     res.render('quote', {
  //       content: content,
  //       author: author
  //   })
  // })
  res.render("quotes");
});

router.get("/Logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "Logout successful");
  res.redirect("/Login");
});

//prisma get fxn
async function main(res, user) {
  const qoutes = await prisma.quotes
    .findMany();
  res.render("Todo", {
      Title: "Todo List",
      data: qoutes,
    });
    
};
    
 
    

// prisma get
router.get("/Todo",  (req, res) => {
  main(res)
    .catch(e => {
      throw e
    })
    .finally(async () => {
      await prisma.disconnect()
    })
});


//prisma post

async function Todo(req, res, user) {
  const { id, Task, Content } = req.body;
  console.log(req.user)
  await prisma.quotes.create({
    data: {
      id: parseInt(req.body.id),
      Task: req.body.Task,
      Content: req.body.Content,
      link:`/del/${req.body.id}`,
      users:{
        connect:{
          Email:  req.user.Email
        }
      }
    }
  });
  res.redirect('/user/Todo')
}

router.post("/Todo", (req, res,next) => {  
 
  
  Todo(req, res)
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.disconnect();
    })
});



//delete fxn
async function Delete(req, res) {
  await prisma.quotes.delete({
    where: {
      id: parseInt(req.params.id), 
    }
  });
  res.redirect("/"); 
}

//prisma delete
router.get("/del/:id", async (req, res) => {
  await Delete(req, res)
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.disconnect();
    });
});


module.exports = router;
