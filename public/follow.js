const { ensureAuthenticated } = require("../config/auth")
const { prismaVersion } = require("@prisma/client")

let followbtn = document.getElementById("follow")

document.getElementById('follow').addEventListener('click', async (req, res) => {
    if (followbtn.innerText == 'Follow') {

        followbtn.innerText = 'Unfollow'
    }
    else {
        followbtn.innerText = 'Follow'
    }
    console.log('working')
   
    await fetch(`/Follow/${req.session.Author}`, ensureAuthenticated)
        .catch(err => console.log(err))
        .then( async user => {
            await prisma.Users.update({
                where: {
                    Email: req.user.Email
                }
            })
            
        });
})

   
