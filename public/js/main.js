const Main = {

    init: async function(){
        await this.updateTasks()
        this.cacheSelectors()
        this.bindEvents()
        this.overflowHub()
        
    },

    bindEvents: function(){

        this.$sendButton.onclick = () => Main.Events.sendButton_newTask()

        this.$deleteBTN.forEach(element => {
            element.onclick = (element) => this.Events.delete_ask(element)
        })

        this.$checkButton.forEach(element => {
            element.onclick = element => this.Events.checkButton_verific(element)
        })


    },

    cacheSelectors: function(){
        this.$checkButton = document.querySelectorAll('.checkBT')
        this.$hubTasks = document.querySelector('.hub-tasks')
        this.$sendButton = document.getElementById('sendButton')
        this.$inputTask = document.getElementById('inputTask')
        this.$deleteBTN = document.querySelectorAll('.deleteBT')
    },

    overflowHub: function(){
            const altHub = this.$hubTasks.clientHeight
            if(altHub === 638){
                this.$hubTasks.style.overflow = 'auto'
            }   
    },


    updateTasks: async function(){

        await fetch('http://192.168.0.103:8080/api/all')
            .then(res => res.json())
            .then(json => {
                let taskElements = ''
                let tasks = JSON.parse(json)
        
                tasks.forEach((task) => {

                    let doneClass = ''

                    if(task.done === true){
                        doneClass = 'done'
                    } else {
                        doneClass = ''
                    }

                    const checkID = task.id

                    let taskElement = `
                    <li>
                        <button onclick="Main.Events.check_done('${checkID}')" class="checkBT ${doneClass}" value="${task.id}" id="checkBT" data-done="${task.done}"></button>
                            <span>${task.task}</span>
                        <button name="deleteBT" class="deleteBT" value="${task.id}"></button>
                    </li>
                        `
        
                    taskElements += taskElement
                })

            document.getElementById('list').innerHTML = taskElements

            

            

        })    
    },

    Events: {
        checkButton_verific: function(element){
            
            const doneValue = element.target.dataset.done

            if(doneValue == 'false'){
                element.target.dataset.done = 'true'
            } else {
                element.target.dataset.done = 'false'
            }

            if(!element.target.classList.contains('done')){
                element.target.classList.add('done')
            } else {
                element.target.classList.remove('done')
            }

            const taskID = {taskID: element.target.value}
            const options = {
                method: "POST",
                headers: new Headers({'content-type': 'application/json'}),
                body: JSON.stringify(taskID)
            }
            fetch('http://192.168.0.103:8080/api/done', options)
           
        },

        sendButton_newTask: async () => {

            const task = {task: Main.$inputTask.value}
            const options = {
                method: "POST",
                headers: new Headers({'content-type': 'application/json'}),
                body: JSON.stringify(task)
            }
            await fetch('http://192.168.0.103:8080/api/new', options)
            Main.init()
            document.getElementById('inputTask').value = ''
        },

        delete_ask: async function(element){

            const taskID = {taskID: element.target.value}
            const options = {
                method: "POST",
                headers: new Headers({'content-type': 'application/json'}),
                body: JSON.stringify(taskID)
            }
            await fetch('http://192.168.0.103:8080/api/delete', options)
            Main.init()
        },
    }
}

Main.init()
