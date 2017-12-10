var express = require("express")
var Sequelize = require("sequelize")
var nodeadmin = require("nodeadmin")

//connect to mysql database
var sequelize = new Sequelize('manager', 'root', '', {
    dialect:'mysql',
    host:'localhost'
})

sequelize.authenticate().then(function(){
    console.log('Success')
})

//define a new Model
var meet = sequelize.define('meetings', {
    name: Sequelize.STRING,
    description: Sequelize.STRING
})

var todos = sequelize.define('toDo', {
    name: Sequelize.STRING,
    meeting_id: Sequelize.INTEGER,
    description: Sequelize.STRING,
    price: Sequelize.INTEGER,
    image: Sequelize.STRING
})

todos.belongsTo(meet, {foreignKey: 'category_id', targetKey: 'id'})
//meet.hasMany(todos)

var app = express()

app.use('/nodeamin', nodeadmin(app))

//access static files
app.use(express.static('public'))
app.use('/admin', express.static('admin'))

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// get a list of meetings
app.get('/meetings', function(request, response) {
    meet.findAll().then(function(meetings){
        response.status(200).send(meetings)
    })
        
})

// get one category by id
app.get('/meetings/:id', function(request, response) {
    meet.findOne({where: {id:request.params.id}}).then(function(category) {
        if(category) {
            response.status(200).send(category)
        } else {
            response.status(404).send()
        }
    })
})

//create a new category
app.post('/meetings', function(request, response) {
    meet.create(request.body).then(function(category) {
        response.status(201).send(category)
    })
})

app.put('/meetings/:id', function(request, response) {
    meet.findById(request.params.id).then(function(category) {
        if(category) {
            category.update(request.body).then(function(category){
                response.status(201).send(category)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.delete('/meetings/:id', function(request, response) {
    meet.findById(request.params.id).then(function(category) {
        if(category) {
            category.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.get('/toDo', function(request, response) {
    todos.findAll(
        {
            include: [{
                model: meet,
                where: { id: Sequelize.col('toDo.category_id') }
            }]
        }
        
        ).then(
            function(toDo) {
                response.status(200).send(toDo)
            }
        )
})

app.get('/toDo/:id', function(request, response) {
    todos.findById(request.params.id).then(
            function(product) {
                response.status(200).send(product)
            }
        )
})

app.post('/toDo', function(request, response) {
    todos.create(request.body).then(function(product) {
        response.status(201).send(product)
    })
})

app.put('/toDo/:id', function(request, response) {
    todos.findById(request.params.id).then(function(product) {
        if(product) {
            product.update(request.body).then(function(product){
                response.status(201).send(product)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.delete('/toDo/:id', function(request, response) {
    todos.findById(request.params.id).then(function(product) {
        if(product) {
            product.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.get('/meetings/:id/toDo', function(request, response) {
    todos.findAll({where:{category_id: request.params.id}}).then(
            function(toDo) {
                response.status(200).send(toDo)
            }
        )
})

app.listen(8080)
