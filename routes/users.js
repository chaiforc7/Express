const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const { ensureAuthenticated } = require('../config/auth');
const async = require("express-async-await");


//dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("welcome", {
    Name: req.user.Name,
  });
});

//quotes
router.get("/quotes", ensureAuthenticated, (req, res, next) => {  

  res.render("quotes");
  }
)

//Logout
router.get("/Logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "Logout successful");
  res.redirect("/Login");
});

//prisma get fxn
async function main(req, res, user) {
  const todos = await prisma.todo
    .findMany({
      where: {
        Email: req.user.Email
      }
    });
  
  res.render("Todo", {
    Title: "Todo List",
    data: todos
  });   
  
};


// prisma get
router.get("/Todo", ensureAuthenticated,  (req, res) => {
  main(req, res)
    .catch(e => {
      throw e
    })
    .finally(async () => {
      await prisma.disconnect()
    })
});


//prisma Todo post

async function Todo(req, res, user) {
  const { Task, Content } = req.body;
  await prisma.todo.create({
    data: {
      Task: Task,
      Content: Content,
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
async function Delete(req, res, user) { 
  await prisma.todo.delete({
    where: {
     
      id: req.params.id,
    }
  });
   
  res.redirect("/user/Todo");
}

//prisma delete
router.get("/del/:id",  (req, res, user) => {
   Delete(req, res, user)
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.disconnect();
    });
});

//Blog post fxn
async function Bloget(req, res, user) {
  const Posts = await prisma.posts
    .findMany({
      where: {
        Email: req.user.Email
      }
    });
  
  res.render('posts', {
    Name: req.user.Name,
    data: Posts
  })  
  
};
router.get('/Blog', ensureAuthenticated, (req, res, next) => {
 Bloget(req, res)
   .catch((e) => {
     throw e;
   })
   .finally(async () => {
     await prisma.disconnect();
   });
})
  


//prisma blog post

async function Blogpost(req, res, user) {
  const { Title, Content } = req.body;
  await prisma.posts.create({
    data: {
      Title: Title,
      Content: Content,
      users:{
        connect:{
          Email:  req.user.Email
        }
      }
    }
  });
 res.redirect('/user/Blog') 
}

router.post("/Blog", (req, res,next) => {  
 
  
  Blogpost(req, res)
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.disconnect();
    })
});

module.exports = router;
