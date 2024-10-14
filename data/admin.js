module.exports =(Sequelize,DataTypes)=>{
    const Admin=Sequelize.define("admin",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId:{
            type: DataTypes.INTEGER
        },
        // firstName:{
        //     type:DataTypes.STRING,
        // },
        // lastName:{
        //     type:DataTypes.STRING,
        // },
        title:{
            type:DataTypes.STRING,
        },
        category:{
            type:DataTypes.STRING,
        },
        description:{
            type:DataTypes.TEXT,
        },
        image:{
            type:DataTypes.STRING,
        }
    })
    return Admin
};