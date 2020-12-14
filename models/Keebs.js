module.exports = function (sequelize, DataTypes) {
    var Keebs = sequelize.define('Keebs', {
        name: DataTypes.STRING,
        size: DataTypes.INTEGER,
        maker: DataTypes.STRING,
        case: DataTypes.STRING,
        color: DataTypes.STRING,
        plate: DataTypes.STRING,
        keebImage: {
            type: DataTypes.STRING,
            allowNull:true,
        }
    });

    Keebs.associate = function (models) {
        // add associations here
        Keebs.hasMany(models.Parts);
        Keebs.belongsTo(models.User);
    };

    return Keebs;
};