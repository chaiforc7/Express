const LocalStrategy = require('passport-local').Strategy;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
//which username and password should i use 
// in the login page create a new user in register and den try logging in

//ok if u have create tell me lemme check my datatbase
module.exports = function (passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            prisma.users.findOne({ where: { Email: email } })//or is the mistake from here
                .catch(err => console.log(err))
                .then(user => {
                    
                    if (!user) {
                        return done(null, false, {
                          message: "This email is not registered",
                        });
                        console.log("not user")
                    }

                    if (password != user.Password) {
                        return done(null, false, {message: "Incorrect Password" })
                        console.log("incorrect password")
                    }
                    else {
                        return done(null, user)
                        console.log("passed")
                    }
                })
        })
    )
    passport.serializeUser((user, done) => {
       
        done(null, user.Email)
    })
    passport.deserializeUser(async (Email, done) => {
        console.log(Email,'rat')
        try {
            let person = await prisma.users.findOne({
                where:{
                    Email:Email
                }
            })
    
            done(null,person)
        } catch (error) {
            done(error)
        }
        
        })
    }
