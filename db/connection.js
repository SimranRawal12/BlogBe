const {Sequelize,DataTypes}= require("sequelize")

const sequelize=new Sequelize("blog","root","",{
    host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
  const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Admin=require("../data/admin")(sequelize, DataTypes);
db.User=require("../data/users")(sequelize,DataTypes);

db.User.hasMany(db.Admin, {foreignKey: 'userId', as: 'userBlogs'});

db.sequelize.sync({ alter: true }).then(() => {
  console.log("Re-sync has been done");
});

module.exports=db;