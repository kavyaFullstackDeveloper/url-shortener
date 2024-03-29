const express = require('express');
const bodyParser = require('body-parser');
const route = require('./route');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://kavya:xLvSB2EPL3Th9y_@cluster0.ri0ljz1.mongodb.net/", {
useNewUrlParser: true
})
.then(() => console.log("MongoDb is connected"))
.catch(err => console.log(err))


app.use('/', route);

route.all("/*", function (req, res) {// USING THIS FUNCTION TO HANDLE INVALID ENDPOINTS BY USERS
res.status(400).send({
status: false,
msg: "The api you request is not available!"
})
})


app.listen(process.env.PORT || 3000, function () {
console.log('Express app running on port ' + (process.env.PORT || 3000))
});