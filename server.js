/* import dependencies */
const   express = require('express'),
        bodyParser = require('express'),
        mongo = require('mongodb'),
        expressValidator = require('express-validator');

const app = express();

/* config middleware body-parser */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/* config middleware express-validator */
app.use(expressValidator());

/* listen port 8080 */
const PORT = 8080;
app.listen(PORT, function(){
    console.log(`server listening to the port ${PORT}`);
});

let db = new mongo.Db(
    'instagram',
    new mongo.Server('localhost', 27017, {}),
    {}
);

app.post('/api', function(req, res){

    let data = req.body;

    req.assert('title', 'Title is required').notEmpty();
    req.assert('url_image', 'Url Image is required').notEmpty();

    let errors = req.validationErrors();
    if(errors){
        res.json(errors);
        return;
    }

    db.open(function(err, mongoclient){
        mongoclient.collection('posts', function(err, collection){
            collection.insert(data, function(err, records){
                if(err){
                    res.json(err);
                }else{
                    res.json(records);
                }
                mongoclient.close();
            });
        })
    })

})


