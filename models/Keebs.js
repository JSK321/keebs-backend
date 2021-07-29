module.exports = function (sequelize, DataTypes) {
    var Keebs = sequelize.define('Keebs', {
        name: DataTypes.STRING,
        maker: DataTypes.STRING,
        case: DataTypes.STRING,
        color: DataTypes.STRING,
        angle: DataTypes.STRING,
        plate: DataTypes.STRING,
        keebSoundTest: DataTypes.STRING,
        keebImage: {
            type: DataTypes.STRING,
            allowNull:true,
        }
    });

    Keebs.associate = function (models) {
        // add associations here
        Keebs.hasMany(models.Parts);
        Keebs.hasMany(models.KeebPhotos);
        Keebs.belongsTo(models.User);
    };

    return Keebs;
};