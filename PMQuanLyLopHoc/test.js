const { User } = require("./models");
async function getUser(user="asd") {
     user =  await User.findAll();
     console.log(user);
   return ;
    
}

getUser();
