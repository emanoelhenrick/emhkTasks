// REQUIRE DE MODULOS NODE
const express = require('express')
const app = express()
const path = require('path')
const routesApi = require('./routes/api')
const tf = require('./model/tasks')

app.set('view engine', 'ejs')

app.use('/api', routesApi)
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', (req, res) => {
    res.render('index', {
        tasks: tf.updateTasks()
    })
})


const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
