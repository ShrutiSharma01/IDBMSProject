const users = require('./app/routes/UserRoutes');
const bloodBank = require('./app/routes/BloodRoutes');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.set("Allow-Control-Allow-Origin", "*");
    res.header("Allow-Control-Allow-Origin", "Origin, X-Requested-With, Content_Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
        return res.json(200).json({});
    }
    next();
});


app.get('/', (req, res) => {
	res.send("Hello from express!");
});

app.use('/api/bloodBank', bloodBank);
app.use('/api/users', users);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static("client/build"));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}. `);
});