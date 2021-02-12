const app = require('./server.js');
const dbConnect = require('./db');

var port = (process.env.PORT || 5000); //CAMBIADO PARA HEROKU

console.log("Starting API server at "+port);

dbConnect().then(
    () => {
        app.listen(port);
        console.log("Server ready!");
    },
    err => {
        console.log("Connection error: "+err);
    }
)