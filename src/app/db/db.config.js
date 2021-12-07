const dotenv = require('dotenv');
dotenv.config();

const {Sequelize, QueryTypes} = require("sequelize");
const bcrypt = require('bcrypt');

const sequelize = new Sequelize('BBMO', process.env.USER_NAME, process.env.PASSWORD, {
    host: 'localhost',
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    }
});

sequelize.query(`SELECT userID
                 FROM logins
                 WHERE username = 'admin'`, {
    type: QueryTypes.SELECT,
}).then(res => {
    if (res.length === 0) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(process.env.ADMIN_PASSWORD, salt, (err, hash) => {
                sequelize.query(`INSERT INTO logins (username, password)
                                 VALUES ('admin', '${hash}')`, {
                    type: QueryTypes.INSERT
                }).catch(err => console.log(err));
            });
        });
    }
}).catch(er => console.log(er));

module.exports = {
    sequelize,
};