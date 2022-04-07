const UserModel = require("../models/UserModel");
const { faker } = require( "@faker-js/faker" ) ;
const bcryptjs = require ("bcryptjs");


const seedersAdmin = async () => {
    const existingUsers = await UserModel.find();
    if (existingUsers.length) {         

      console.log("Admin already added !");
      return;
    }

    //Create admin login using faker

      const adminUser = new Array(5).fill(0).map((_, index) => ({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),                                        
        email: faker.internet.email(),
        password: bcryptjs.hashSync("password", 10),
        
    }))
        //  create admin user

    await admin.create(adminUser);
    console.table(adminUser.map((admin) => ({ ...admin, password: "password" })));  
  };


module.exports ={
  seedersAdmin,
}