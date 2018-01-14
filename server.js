var express = require("express")
var Sequelize = require("sequelize")
var nodeadmin = require("nodeadmin")

//connect to mysql database
var sequelize = new Sequelize('manager', 'root', '', {
    dialect: 'mysql',
    define: {
        timestamps: false
    }
})


sequelize.authenticate().then(function () {
    console.log('Success')
})


//define a new Model
var meet = sequelize.define('meeting', {
    name: Sequelize.STRING,
    description: Sequelize.STRING
}, {
    underscored: true
})

var unirest = require('unirest')

var todos = sequelize.define('todo', {
    name: Sequelize.STRING,
    meeting_id: Sequelize.INTEGER,
    description: Sequelize.STRING,
    price: Sequelize.INTEGER,
    image: Sequelize.STRING
}, {
    underscored: true
})

todos.belongsTo(meet)//oricum aia facea implicit
//meet.hasMany(todos)
//sequelize.sync({force : true})
var app = express()

app.use('/nodeamin', nodeadmin(app))

//access static files


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies


// get a list of meetings
app.get('/meetings', function (request, response) {
    meet.findAll().then(function (meetings) {
        response.status(200).send(meetings);

    });
});
// get one category by id
app.get('/meetings/:id', function (request, response) {
    meet.findOne({where: {id: request.params.id}}).then(function (category) {
        if (category) {
            response.status(200).send(category);
        } else {
            response.status(404).send();
        }
    });
});

//create a new category
app.post('/meetings', function (request, response) {
    meet.create(request.body).then(function (category) {
        response.status(201).send(category);
    });
});

app.put('/meetings/:id', function (request, response) {
    meet.findById(request.params.id).then(function (category) {
        if (category) {
            category.update(request.body).then(function (category) {
                response.status(201).send(category);
            }).catch(function (error) {
                response.status(200).send(error);
            });
        } else {
            response.status(404).send('Not found');
        }
    });
});

app.delete('/meetings/:id', function (request, response) {
    meet.findById(request.params.id).then(function (category) {
        if (category) {
            category.destroy().then(function () {
                response.status(204).send('Item deleted');
            });
        } else {
            response.status(404).send('Not found');
        }
    });
});

app.get('/toDo', function (request, response) {
    todos.findAll(
        {
            include: [{
                model: meet,
                where: {id: Sequelize.col('toDo.meeting_id')}
            }]
        }
    ).then(
        function (toDo) {
            response.status(200).send(toDo);
        }
    );
});

app.get('/toDo/:id', function (request, response) {
    todos.findById(request.params.id).then(
        function (product) {
            response.status(200).send(product);
        }
    );
});

app.post('/toDo', function (request, response) {
    todos.create(request.body).then(function (product) {
        response.status(201).send(product);
    });
});

app.put('/toDo/:id', function (request, response) {
    todos.findById(request.params.id).then(function (product) {
        if (product) {
            product.update(request.body).then(function (product) {
                response.status(201).send(product);
            }).catch(function (error) {
                response.status(200).send(error);
            });
        } else {
            response.status(404).send('Not found');
        }
    });
});

app.delete('/toDo/:id', function (request, response) {
    todos.findById(request.params.id).then(function (product) {
        if (product) {
            product.destroy().then(function () {
                response.status(204).send('Item deleted');
            });
        } else {
            response.status(404).send('Not found');
        }
    });
});

app.get('/meetings/:id/toDo', function (request, response) {
    todos.findAll({where: {meeting_id: request.params.id}}).then(
        function (toDo) {
            response.status(200).send(toDo);
        }
    );
});


app.get('/meetings', (req, res) => {
    var category = req.query.category;
    unirest.get("https://maps.googleapis.com/maps/api/timezone/json?location=39.6034810%2C-119.6822510&timestamp=1331766000&key=YOUR_API_KEY")
        .header("API key", "AIzaSyD8C4O1riKMmWQ0gXNfk5RXcSsuHaF-R-Q")
        .end(function (result) {
            if (result) {
                console.log(result.status, result.headers, result.body);
                res.status(200).json(result);
            } else {
                res.status(500).send('error');
            }
        });
});

app.use('/', express.static('admin'));

app.use((err, req, res, next) => {
    console.warn(err)
    res.status(500).send(err)
});

app.listen(8080);

