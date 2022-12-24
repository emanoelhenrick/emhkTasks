// REQUIRE DE MODULOS NODE
const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()

app.set('view engine', 'ejs')

// PARA HABILITAR O SERVIDOR A RECEBER DADOS DE UM FORMULARIO
app.use(express.urlencoded({ extended: true }))

// FACILITANDO A LOCALIZACAO DA PASTA PUBLIC
app.use(express.static(path.join(__dirname, 'public')))


// funcoes
// {
//     task: 'sei oq sei oque la',
//     done: false,
//     id: 4567
// }

// OUTRAS FUNCOES

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


// ROTA INDEX
app.get('/', (req, res) => {
    const data = fs.readFileSync('./store/tasks.json')
    const tasks = JSON.parse(data)

    res.render('index', {
        tasks: tasks
    })
})

app.post('/save-task', (req, res) => {
    const { task } = req.body // coloca os valores atribuidos no formulario de acordo com o NAME do elemento em cada constante
    const data = fs.readFileSync('./store/tasks.json') // le o arquivo json e coloca os dados numa constante
    const tasks = JSON.parse(data) //transfroma os dados da constante em array/lista

    tasks.push({ //coloca os valores resgatados dentro da array como objeto e adiciona um ID
        task,
        done: false,
        id: newID()
    })

    console.log(tasks);

    const tasksString = JSON.stringify(tasks) // transforma o objeto em JSON de novo
    fs.writeFileSync('./store/tasks.json', tasksString) // aloca os valores de postsString para um arquivo json

    
    res.redirect('/')
})

app.post('/delete', (req, res) => {

    const { deleteBT } = req.body

    //PARA DELETAR
        const data = fs.readFileSync('./store/tasks.json') // le o arquivo json e coloca os dados numa constante
        const tasks = JSON.parse(data) //transfroma os dados da constante em array/lista

        const newTasks = tasks.filter(item => {
            if(item.id !== parseInt(deleteBT)){
                return item
            }
        })

        console.log(newTasks);
    
        const tasksString = JSON.stringify(newTasks) // transforma o objeto em JSON de novo
        fs.writeFileSync('./store/tasks.json', tasksString) // aloca os valores de tasksString para um arquivo json


    res.redirect('/')

})

app.post('/done', (req, res) => {

    const { doneBT } = req.body

    //PARA MARCAR COMO FEITO
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

        const tasksString = JSON.stringify(newTasks) // transforma o objeto em JSON de novo
        fs.writeFileSync('./store/tasks.json', tasksString) // aloca os valores de tasksString para um arquivo json
        

    }


    res.redirect('/')
})

// LISTENING SERVER
const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))