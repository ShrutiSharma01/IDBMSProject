const db = require('./app/db/db.config');
const bcrypt = require('bcrypt');
const model = require('./app/models');
const {QueryTypes} = require("sequelize");

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash('123456', salt, (err, hash) => {
        db.sequelize.query(`INSERT INTO logins (username, password) VALUES ('admin', '${hash}')`, {
            type: QueryTypes.INSERT
        }).catch(err => console.log(err));
    });
});

// db.sequelize.query(`DELETE FROM logins WHERE userID=21`, {type: QueryTypes.DELETE}).then(res => console.log(res)).catch(err => console.log(err));
