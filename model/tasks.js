const fs = require('fs')

function generateID(){
    return Math.random().toString(36).substring(2, 9)
}

const taskFunctions = {

    //const randomID = () => Math.round(Math.random() * 10000)
    newID: () => {
        const data = fs.readFileSync('./store/tasks.json')
        const tasks = JSON.parse(data)
        let ID = 0
        function verificID(){
            ID = Math.round(Math.random() * 10000)
            const verific = tasks.some((item) => item.id == ID)
            if(verific){
                return verificID()
            } else {
                return ID
            }
        }
        return verificID()
    },
    
    
    updateTasks(){
        const tasksJSON = fs.readFileSync('./store/tasks.json')
        this.tasksObj = JSON.parse(tasksJSON)
        return this.tasksObj
    },

    saveTask(task){
        this.updateTasks()
        this.tasksObj.push({
            task: task,
            done: false,
            id: generateID()
        })
        const tasksJSON = JSON.stringify(this.tasksObj)
        fs.writeFileSync('./store/tasks.json', tasksJSON)
    },

    deleteTask(taskID){
        this.updateTasks()

        const newTasks = this.tasksObj.filter(element => element.id !== taskID)

        const tasksJSON = JSON.stringify(newTasks)
        fs.writeFileSync('./store/tasks.json', tasksJSON)

    },

    doneTask(taskID){
        this.updateTasks()

        const newTasks = this.tasksObj.map(element => {
            if(element.id !== taskID){
                return element
            } else {
                if (element.done == true){
                    element.done = false
                } else {
                    element.done = true
                }

                return element
            }
        })

        const tasksJSON = JSON.stringify(newTasks)
        fs.writeFileSync('./store/tasks.json', tasksJSON)
    }
}

module.exports = taskFunctions
