/* import dependencies */
const   express = require('express'),
        bodyParser = require('express'),
        mongo = require('mongodb');

const app = express();

/* config middleware body-parser */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/* listen port 8080 */
const PORT = 8080;
app.listen(PORT, function(){
    console.log(`server listening to the port ${PORT}`);
});
