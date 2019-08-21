// require all dependencies
var express = require('express');
var app = express();
const bodyParser = require("body-parser");
const menuFactory = require('./lib/menu_factory');
const MongoConnection = require('./lib/MongoConnection');
const MongoClient = require('mongodb').MongoClient
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '50mb'}));


// set up the template engine
app.set('views', './views');

app.set('view engine', 'pug');

let menuoptions = menuFactory.getMenuOptions();
let categories = menuFactory.getCategories();
var namesObj = [];


app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    res.render('index', { title: 'Recipes', message: '', menuoptions: menuoptions });
}).listen(app.get('port'), function() {
    res.render('index', { title: 'Recipes', message: '', menuoptions: menuoptions });
});

// GET response for '/'
app.get('/', function (req, res) {

    // render the 'index' template, and pass in a few variables
    res.render('index', { title: 'Recipes', message: '', menuoptions: menuoptions });


});

MongoClient.connect('link-to-mongodb', (err, database) => {
    // ... start the server
})



const uri = "mongodb+srv://cooladmin:welcome2RMS@cluster0-ctqyq.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
let conn = new MongoConnection("food");
let db;

let dbcon = MongoClient.connect(uri, function (err, client) {
    if (err) throw err

    var db = client.db('food')

    db.collection('recipes').find().toArray(function (err, result) {
        if (err) throw err

        //console.log(result)
    })
    return db;
})

app.get('/NewRecipe', async (req, res) => {
    res.render('NewRecipe', { title: 'New recipe', menuoptions: menuoptions , categories: categories});
});


app.get('/Home', async (req, res) => {
    res.render('index', { title: 'Recipes Home', menuoptions: menuoptions , categories: categories});
});



app.post('/findResults', async(req, res) => {


        //return res.status(200).send(req.body)
    var category = req.body.Category;

    let results = await getResultsForCategory(category)


    res.render('Results', { message: 'Results',title: 'Recipes', results: results ,menuoptions: menuoptions});


})


app.get('/getSummary', async(req, res) => {


    //return res.status(200).send(req.body)
    var id = req.query.id;
    console.log ('*********')

    console.log (id)

    let data = await getResultsById(id)

    res.render('Summary', { message: 'Results',title: 'Recipes' ,menuoptions: menuoptions, data});


})

app.post('/deleteRecord', async(req, res) => {

    //return res.status(200).send(req.body)
    var id = require('mongodb').ObjectID(req.body._id);
    console.log ('********* for delete')

    console.log (id)

    let connectedDb = await conn.connect();
    db = connectedDb;


    let query = {
        _id: id,
    };

    console.log (query)

    await conn.deleteData('recipes', query).then(function(){
        res.render('NewRecipe', { title: 'New recipe', menuoptions: menuoptions , categories: categories});

    })
   // return res.status(200).send(data)

})

app.post('/editRecord', async(req, res) => {

    var name = req.body.name;
    var by =req.body.by;
    //var category =req.body.Category;
    var story =req.body.story;
    var instructions =req.body.instructions;

    var data = {
        "name": name,
        "by": by,
        "story": story,
        "instructions": instructions
    }


    //console.log(data)


    res.render('edit', { title: 'edit', menuoptions: menuoptions , categories: categories, data});

})

// Queries artemis db for current pool entries
let getResultsForCategory = async function(category) {

    let connectedDb = await conn.connect();
    db = connectedDb;
    let query = {
        category: category,
    };
    console.log ('Results are ------')
    console.log(conn.findData('recipes', query));
    return conn.findData('recipes', query);
}

let getResultsById = async function(id) {

    let connectedDb = await conn.connect();
    db = connectedDb;
    var id = require('mongodb').ObjectID(id);

    let query = {
        _id: id,
    };

    return conn.findData('recipes', query);
}

var getNames = async function() {


    let connectedDb = await conn.connect();
    db = connectedDb;

    let query = {
        name: { $regex: /.*/ }
    };

    return conn.findData('recipes', query).then(function(results) {

        for (var key in results) {
            if(results[key].name)
                namesObj.push(results[key].name)

        }
        //console.log(namesObj)


    });


}
getNames();


app.get('/Search', async (req, res) => {
    res.render('Search', { title: 'Search recipe', menuoptions: menuoptions , categories: categories, names: namesObj});
});

app.post('/AddRecipe', async(req, res) => {

    let connectedDb = await conn.connect();
    db = connectedDb;

    var name = req.body.RecipeName;
    var by =req.body.ContributedBy;
    var category =req.body.Category;
    var story =req.body.Story;
    var instructions =req.body.Instructions;

    var data = {
        "name": name,
        "by": by,
        "category" : category,
        "story": story,
        "instructions": instructions
    }
    await db.collection('recipes').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");
        //Show loading icon
        //return res.status(200).send(req.body)
        res.render('details', { title: 'Recipes', message: 'Thanks for contributing a new recipe!!', menuoptions: menuoptions ,data});

    });

})

// start up the server
app.listen(3000, function () {
    console.log('Listening on http://localhost:3000');
});

