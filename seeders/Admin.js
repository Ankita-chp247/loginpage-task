//const { faker } = require( "@faker-js/faker" ) ;

const UserModel = require("../models/UserModel");
const bcrypt = require ("bcryptjs");


const seedersAdmin = async () => {
  try {
    const adminEmail = "ankita21@gmail.com"
    const password = "Ankita@247";
    
    const hashedPassword = await bcrypt.hash(password, 10);

      const result = await UserModel.find();
          if (!result) {         
      
        console.log("Admin already added !");
    const role = await UserModel.findOne({ name: "superadminn" })       
      await UserModel.create({    
        firstName: "Super",        
        lastName: "adminn",   
        email: adminEmail,   
        password: hashedPassword,
        userRole: 'Admin'
      });               
      console.log("SuperAdmin Successfully Registered");
    } else {
      console.log("SuperAdmin Already Exists")       
    }
  } catch (error) {
    console.log(error);
  }
}
module.exports ={
  seedersAdmin,
}



// const seedersAdmin = async () => {
//     const existingUsers = await UserModel.find();
//     if (existingUsers.length) {         

//       console.log("Admin already added !");
//       return;
//     }
          
//     //Create admin login using faker

//       const adminUser = new Array(1).fill(0).map((_, index) => ({
//         firstName: faker.name.firstName(),
//         lastName: faker.name.lastName(),                                        
//         email: faker.internet.email(),
//         password: bcryptjs.hashSync("password", 10),
        
//     }))
//         //  create admin user

//     await admin.create(adminUser);
//     console.table(adminUser.map((admin) => ({ ...admin, password: "password" })));  
//   };


// module.exports ={
//   seedersAdmin,
// }
