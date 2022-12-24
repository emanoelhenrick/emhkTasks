// REQUIRE DE MODULOS NODE
const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))

//OUTRAS FUNCOES
const randomID = () => Math.round(Math.random() * 10000)
const newID = () => {
    const data = fs.readFileSync('./store/tasks.json')
    const tasks = JSON.parse(data)
    let ID = 0
    function verificID(){
        ID = randomID()
        const verific = tasks.some((item) => item.id == ID)
        if(verific){
            return verificID()
        } else {
            return ID
        }
    }
    return verificID()
}



// ROTAS
app.get('/', (req, res) => {
    const data = fs.readFileSync('./store/tasks.json')
    const tasks = JSON.parse(data)
    res.render('index', {
        tasks: tasks
    })
})

app.post('/save-task', (req, res) => {
    const { task } = req.body 
    const data = fs.readFileSync('./store/tasks.json') 
    const tasks = JSON.parse(data) 
    tasks.push({
        task,
        done: false,
        id: newID()
    })
    console.log(tasks);
    const tasksString = JSON.stringify(tasks)
    fs.writeFileSync('./store/tasks.json', tasksString)
    res.redirect('/')
})

app.post('/delete', (req, res) => {
    const { deleteBT } = req.body
        const data = fs.readFileSync('./store/tasks.json')
        const tasks = JSON.parse(data)
        const newTasks = tasks.filter(item => {
            if(item.id !== parseInt(deleteBT)){
                return item
            }
        })
        console.log(newTasks);  
        const tasksString = JSON.stringify(newTasks)
        fs.writeFileSync('./store/tasks.json', tasksString)
    res.redirect('/')
})

app.post('/done', (req, res) => {
    const { doneBT } = req.body
    if(doneBT){
        const data = fs.readFileSync('./store/tasks.json') // le o arquivo json e coloca os dados numa constante
        const tasks = JSON.parse(data) //transfroma os dados da constante em array/lista
        console.log(tasks);
        const newTasks = tasks.map((element) => {           
            if (doneBT == element.id){
                if(element.done == true){
                    element.done = false
                } else {
                    element.done = true
                } 
                return element

            } else {
                return element
            }
        })
        const tasksString = JSON.stringify(newTasks)
        fs.writeFileSync('./store/tasks.json', tasksString) 
    }
    res.redirect('/')
})



//LISTENING
const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))