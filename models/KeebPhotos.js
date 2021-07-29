module.exports = function(sequelize, DataTypes) {
    var KeebPhotos = sequelize.define('KeebPhotos', {
        keebImage: DataTypes.STRING,
        userId: DataTypes.STRING,
    });

    KeebPhotos.associate = function(models) {
        KeebPhotos.belongsTo(models.Keebs);
    };
    
    return KeebPhotos;
};