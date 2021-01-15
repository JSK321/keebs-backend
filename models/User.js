const bcrypt = require('bcrypt')

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        name: DataTypes.STRING,
        password: {
            type: DataTypes.STRING,
            required: true,
            validate: {
                len: [8]
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        profileImage: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });

    User.associate = function (models) {
        User.hasMany(models.Keebs);
        User.hasMany(models.Extras);
    };

    User.beforeCreate(function (user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    })

    User.beforeBulkUpdate(function (user) {
        if (user.attributes.password !== "" && user.attributes.password !== undefined && user.attributes.password !== null) {
            user.attributes.password = bcrypt.hashSync(user.attributes.password, bcrypt.genSaltSync(10), null);
        }
    })

    return User;
};