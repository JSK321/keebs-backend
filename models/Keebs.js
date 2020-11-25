module.exports = function (sequelize, DataTypes) {
    var Keebs = sequelize.define('Keebs', {
        name: DataTypes.STRING,
        size: DataTypes.STRING,
        maker: DataTypes.STRING,
        case: DataTypes.STRING,
        color: DataTypes.STRING,
        plate: DataTypes.STRING,
    });

    Keebs.associate = function (models) {
        // add associations here
        Keebs.hasMany(models.Parts);
        Keebs.belongsTo(models.User);
    };

    return Keebs;
};