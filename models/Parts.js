module.exports = function (sequelize, DataTypes) {
    var Parts = sequelize.define('Parts', {
        switches: DataTypes.STRING,
        springWeight: DataTypes.STRING,
        springLube: {
            type: DataTypes.STRING,
            allowNull:true,
        },
        switchLube: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        switchFilm: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        stabs: DataTypes.STRING,
        stabLube: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        keyset: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });
  
    Parts.associate = function(models){
        Parts.belongsTo(models.Keebs)
        Parts.belongsTo(models.User)
    };

    return Parts;
};