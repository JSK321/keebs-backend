module.exports = function (sequelize, DataTypes) {
   var Extras = sequelize.define('Extras', {
        keyset: DataTypes.STRING,
        kits: DataTypes.STRING,
        material: DataTypes.STRING,
        type: DataTypes.STRING,
        profile: DataTypes.STRING,
        keysetImage: {
            type: DataTypes.STRING,
            allowNull:true,
        }
    });

    Extras.associate = function(models){
        Extras.belongsTo(models.User);
    };

    return Extras;
}
