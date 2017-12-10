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
var toDo = sequelize.define('toDo', {
    name: Sequelize.STRING,
    description: Sequelize.STRING
})

var meet = sequelize.define('meeting', {
    name: Sequelize.STRING,
    meeting_id: Sequelize.INTEGER,
    description: Sequelize.STRING,
	
})

meeting.belongsTo(toDo, {foreignKey: 'meeting_id', targetKey: 'id'})
//toDo.hasMany(meeting)

var app = express()

app.use('/nodeamin', nodeadmin(app))

//access static files
app.use(express.static('public'))
app.use('/admin', express.static('admin'))

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// get a list of toDo
app.get('/toDo', function(request, response) {
    toDo.findAll().then(function(toDo){
        response.status(200).send(toDo)
    })
        
})

// get one category by id
app.get('/toDo/:id', function(request, response) {
    toDo.findOne({where: {id:request.params.id}}).then(function(category) {
        if() {
            response.status(200).send(category)
        } else {
            response.status(404).send()
        }
    })
})

//create a new meeting
app.post('/toDo', function(request, response) {
    toDo.create(request.body).then(function(meet) {
        response.status(201).send(meet)
    })
})

app.put('/toDo/:id', function(request, response) {
    toDo.findById(request.params.id).then(function(meet) {
        if(meet) {
            meet.update(request.body).then(function(meet){
                response.status(201).send(meet)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.delete('/toDo/:id', function(request, response) {
    toDo.findById(request.params.id).then(function(meet) {
        if(meet) {
            meet.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.get('/meeting', function(request, response) {
    meeting.findAll(
        {
            include: [{
                model: toDo,
                where: { id: Sequelize.col('meet.meeting_id') }
            }]
        }
        
        ).then(
            function(meet) {
                response.status(200).send(meet)
            }
        )
})

app.get('/meeting/:id', function(request, response) {
    meeting.findById(request.params.id).then(
            function(meet) {
                response.status(200).send(meet)
            }
        )
})

app.post('/meeting', function(request, response) {
    meeting.create(request.body).then(function(meet) {
        response.status(201).send(meet)
    })
})

app.put('/meeting/:id', function(request, response) {
    meeting.findById(request.params.id).then(function(meet) {
        if(meet) {
            meeting.update(request.body).then(function(meet){
                response.status(201).send(meet)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.delete('/meeting/:id', function(request, response) {
    meeting.findById(request.params.id).then(function(meet) {
        if(meet) {
            meeting.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.get('/toDo/:id/meeting', function(request, response) {
    meeting.findAll({where:{id: request.params.id}}).then(
            function(meet) {
                response.status(200).send(meet)
            }
        )
})

app.listen(8080)
