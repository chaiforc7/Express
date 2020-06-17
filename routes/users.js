const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const { ensureAuthenticated } = require('../config/auth');
const async = require("express-async-await");
const moment = require("moment");
const { en } = require("faker/lib/locales");
const { json } = require("body-parser");

const today = moment()


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

let error = []
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
async function Delete(req, res, profile) { 
  await prisma.todo.delete({
    where: {
     
      id: req.params.id,
    }
  });
   
  res.redirect("/user/Todo");
}

//prisma delete
router.get("/del/:id",  (req, res, profile) => {
   Delete(req, res, profile)
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.disconnect();
    });
});

//Blog get fxn
async function Bloget(req, res, user) {
     const users = await prisma.users.findMany({
       include: {
         followedBy: {
           include: {
             posts: true
           }
         },
         following: {
           include: {
             posts: true
           }
         }
       },
     where: {
       Email: req.user.Email,
     },
   })
  
  // console.dir(users, { depth: null})
  let Posts = [];
   req.user.following.forEach(element => {
     Posts.push(element.posts)
  })
 
      const Post = await prisma.posts.findMany({
        where: {
          Email: req.user.Email
        }
      })
      
      Posts.push(Post)

  let Poots = []
  Posts.forEach((element) => {
    element.forEach((item) => {
      item.Created_at = moment(item.Created_at).fromNow();
      if (req.user.Name == item.Author) {
        current_user = true;
      }
    });
    })
    
  Posts.forEach(element => {
    element.forEach(item => {
       Poots.push(item);
    })
   
  })
    
  res.render("posts", {
    Name: req.user.Name,
    data: Poots
  });  
 
  
  
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
      Avatar: req.user.Avatar,
      Author: req.user.Name,
      users:{
        connect:{
          Email: req.user.Email

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

router.get('/userProfile', ensureAuthenticated, async (req, res) => {
  const user = await prisma.users.findMany({
    include: {
      followedBy: true,
      following: true,
    },
    where: {
      Email: req.user.Email,
    },
  });

  const Posts = await prisma.posts
    .findMany({
      where: {
        Email: req.user.Email,
      }
    });

  Posts.forEach(item => {
    item.Created_at = moment(item.Created_at).fromNow();
  })
  
  const Profile = await prisma.profile.findMany({
    where: {
      Email: req.user.Email,
    },
  });
  console.log(req.user.Avatar)
  res.render("userProfile", {
    data: Posts,
    Profile: Profile,
    Author: req.user.Name,
    Avatar: req.user.Avatar,
    Followers: req.user.followedBy.length,
    Following: req.user.following.length
  });
}); 

router.get('/Editprofile', ensureAuthenticated, async(req, res, profile) => {
  res.render('EditProfile')
})

async function Profile(req, res, profile) {
  const { Name, Email, Occupation, Hobbies, Skills, About } = req.body;
  await prisma.profile.findOne({
    where: {
      Email: Email
    }
  })
    .then (async profile => {
      if (profile) {
        error.push({ msg: 'UserName has been registered' })
        res.render("EditProfile", {
            error,
            Name,
            Email,
            Hobbies,
          Occupation,
          Skills,
            About
          });
        error = [];
        }
      else {
        await prisma.profile.create({
          data: {
            Name: Name,
            Email: Email,
            Occupation: Occupation,
            Hobbies: Hobbies,
            Skills: Skills,
            About: About
     },
   });
   res.redirect("/user/Blog");
    }
  })
   
}

 
router.post('/EditProfile', (req, res, next) => {
 
  Profile(req, res)
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.disconnect();
    });
})
let FollowChange = "";

router.get(`/Profile`, ensureAuthenticated, async (req, res) => {
  const User = await prisma.users.findMany({
    include: {
      followedBy: true,
      following: true,
    },
    where: {
      Email: req.session.Email,
    },
  });
  let Avatar, Name;
  User.forEach(item => {
    Avatar = item.Avatar
    Name = item.Name
  })
  const Posts = await prisma.posts.findMany({
    where: {
      Email: req.session.Email,
    },
  });

  Posts.forEach((item) => {
    item.Created_at = moment(item.Created_at).fromNow();
  });

  const Profile = await prisma.profile.findMany({
    where: {
      Email: req.session.Email,
    },
  });
  console.log(Avatar);
  res.render("Profile", {
    data: Posts,
    Profile: Profile,
    Author: Name,
    FollowChange: "Follow",
    Avatar: Avatar,
    Followers: req.user.followedBy.length,
    Following: req.user.following.length,
  });
}); 


async function FollowAuthor(req, res) {
  const users = await prisma.users.findMany({
    where: {
       Email: req.session.Email
     }
  })
 
  const Profile = await prisma.profile.findMany({
    where: {
      Email: req.session.Email
    }
  })
  const Posts = await prisma.posts.findMany({
    where: {
      Email: req.session.Email
      
    }
  })
  Posts.forEach((item) => {
    item.Created_at = moment(item.Created_at).fromNow();
  });
   const user = await prisma.users.update({
    where: {
      Email: req.session.Email
    },
    data: {
      followedBy: {
        connect: [{
          Email: `${req.user.Email}`
        }]
      }
    }
   })
  let Avatar, Name;
  users.forEach((item) => {
    Avatar = item.Avatar;
    Name = item.Name;
  });

  console.log(req.session.Email)
  
  res.render("profile", {
    data: Posts,
    Profile: Profile,
    FollowChange: "UnFollow",
    Author: Name,
    Avatar: Avatar,
  });

}


router.get('/Follow/:Author', ensureAuthenticated, (req, res, user) => {
  FollowAuthor(req, res)
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.disconnect();
    });

})


async function UnFollowAuthor(req, res) {

  const users = await prisma.users.findMany({
    where: {
      Email: req.session.Email,
    },
  });
  const Profile = await prisma.profile.findMany({
    where: {
      Email: req.session.Email,
    },
  });
  const Posts = await prisma.posts.findMany({
    where: {
      Email: req.session.Email,
    },
  });
  Posts.forEach((item) => {
    item.Created_at = moment(item.Created_at).fromNow();
  });
  const user = await prisma.users.update({
    where: {
      Email: req.session.Email,
    },
    data: {
      followedBy: {
        disconnect: [
          {
            Email: `${req.user.Email}`,
          },
        ],
      },
    },
  });

  let Avatar, Name;
  users.forEach((item) => {
    Avatar = item.Avatar;
    Name = item.Name;
  });

  res.render("profile", {
    data: Posts,
    Profile: Profile,
    FollowChange: "Follow",
    Author: req.user.Name,
    Avatar: req.user.Avatar,
    Followers: req.user.followedBy.length,
    Following: req.user.following.length,
  });
}

router.get('/Unfollow/:Author', ensureAuthenticated, (req, res, user) => {
  UnFollowAuthor(req, res)
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.disconnect();
    });
})

module.exports = router;
