/* import dependencies */
const   express = require('express'),
        bodyParser = require('express'),
        mongo = require('mongodb'),
        expressValidator = require('express-validator'),
        ObjectId = require('mongodb').ObjectId;

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

/* POST (create) */

app.post('/api', function(req, res){

    let data = req.body;

    req.assert('title', 'Title is required').notEmpty();
    req.assert('url_image', 'Url Image is required').notEmpty();

    let errors = req.validationErrors();
    if(errors){
        res.status(400).json({status: 2});
        return;
    }


    db.open(function(err, mongoclient){
        mongoclient.collection('posts', function(err, collection){
            collection.insert(data, function(err, records){
                if(err){
                    res.status(500).json({status: 4});
                }else{
                    res.status(200).json({status: 1});
                }
                mongoclient.close();
            });
        });
    });

});

/* GET (read) */

app.get('/api', function(req, res){
    db.open(function(err, mongoclient){
        mongoclient.collection('posts', function(err, collection){
            collection.find().toArray(function(err, results){
                if(err){
                    res.status(500).json({status: 3});
                }if(JSON.stringify(results) === '[]'){
                    res.status(404).json({status: 2});
                }else{
                    res.status(200).json({status: 1});
                }
                mongoclient.close();
            });
        });
    });
});

/* GET by ID (read) */
app.get('/api/:id', function(req, res){
    db.open(function(err, mongoclient){
        mongoclient.collection('posts', function(err, collection){
            collection.find(ObjectId(req.params.id)).toArray(function(err, results){
                if(err){
                    res.status(500).json({status: 3});
                }if(JSON.stringify(results) === '[]'){
                    res.status(404).json({status: 2});
                }else{
                    res.status(200).json({status: 1});
                }
                mongoclient.close();
            });
        });
    });
});

/* PUT by ID (update) */
app.put('/api/:id', function(req, res){
    db.open(function(err, mongoclient){
        mongoclient.collection('posts', function(err, collection){
            collection.update(

                { _id : ObjectId(req.params.id)},
                { $set: { title: req.body.title}},
                {},
                function(err, records){
                    if(err){
                        res.status(500).json({status: 4});
                    }else{
                        res.status(200).json({status: 1});
                    }
                    mongoclient.close();
                }
            );
        });
    });
});

/* DELETE by ID (remove) */
app.delete('/api/:id', function(req, res){
    db.open(function(err, mongoclient){
        mongoclient.collection('posts', function(err, collection){
            collection.remove(
                {_id: ObjectId(req.params.id)},
                function(err, records){
                    if(err){
                        res.status(500).json({status: 3});
                    }else{
                        res.status(200).json({status: 200});
                    }
                    mongoclient.close();
                }
            );
        });
    });
});

