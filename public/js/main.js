const Main = {

	init: async function(){
		await this.updateTasks();
		this.cacheSelectors();
		this.bindEvents();
		this.overflowHub();
        
	},

	bindEvents: function(){

		this.$sendButton.onclick = () => Main.Events.sendButton_newTask();

		this.$deleteBTN.forEach(element => {
			element.onclick = (element) => this.Events.delete_ask(element);
		});

		this.$checkButton.forEach(element => {
			element.onclick = element => this.Events.checkButton_verific(element);
		});

		this.$logoutBTN.onclick = this.Events.logout


	},

	cacheSelectors: function(){
		this.$checkButton = document.querySelectorAll(".checkBT");
		this.$hubTasks = document.querySelector(".hub-tasks");
		this.$sendButton = document.getElementById("sendButton");
		this.$inputTask = document.getElementById("inputTask");
		this.$deleteBTN = document.querySelectorAll(".deleteBT");
		this.$logoutBTN = document.querySelector(".logout-btn");

	},

	overflowHub: function(){
		const altHub = this.$hubTasks.clientHeight;
		if(altHub === 638){
			this.$hubTasks.style.overflow = "auto";
		}   
	},


	updateTasks: async function(){

		const options = {
			method: "GET",
			headers: new Headers({"tk_auth": tk_auth}),
		};

		await fetch("http://192.168.0.103:3000/api/all", options)
			.then(res => res.json())
			.then(json => {

				document.querySelector(".usernameBox").innerHTML = json.username

				let taskElements = "";
				let tasks = json.taskList;
        
				tasks.forEach((task) => {

					let doneClass = "";

					if(task.done === true){
						doneClass = "done";
					} else {
						doneClass = "";
					}

					const taskID = task._id;

					let taskElement = `
                    <li>
                        <button onclick="Main.Events.check_done('${taskID}')" class="checkBT ${doneClass}" value="${taskID}" id="checkBT" data-done="${task.done}"></button>
                            <span>${task.task}</span>
                        <button name="deleteBT" class="deleteBT" value="${taskID}"></button>
                    </li>
                        `;
        
					taskElements += taskElement;
				});

				document.getElementById("list").innerHTML = taskElements;
			});
	},

	Events: {
		checkButton_verific: function(element){
            
			const doneValue = element.target.dataset.done;

			if(doneValue == "false"){
				element.target.dataset.done = "true";
			} else {
				element.target.dataset.done = "false";
			}

			if(!element.target.classList.contains("done")){
				element.target.classList.add("done");
			} else {
				element.target.classList.remove("done");
			}

			const taskID = {taskID: element.target.value};
			const options = {
				method: "POST",
				headers: new Headers({"content-type": "application/json"}),
				body: JSON.stringify(taskID)
			};
			fetch("http://192.168.0.103:3000/api/done", options);
           
		},

		sendButton_newTask: async () => {

			const task = {task: Main.$inputTask.value, tk: tk_auth};
			const options = {
				method: "POST",
				headers: new Headers({"content-type": "application/json"}),
				body: JSON.stringify(task)
			};
			await fetch("http://192.168.0.103:3000/api/new", options);
			Main.init();
			document.getElementById("inputTask").value = "";
		},

		delete_ask: async function(element){

			const taskID = {taskID: element.target.value};
			const options = {
				method: "POST",
				headers: new Headers({"content-type": "application/json"}),
				body: JSON.stringify(taskID)
			};
			await fetch("http://192.168.0.103:3000/api/delete", options);
			Main.init();
		},

		logout: function(){
			localStorage.removeItem('tk_auth')
			window.location.assign('/login')
		}
	}
};

const tk_auth = localStorage.getItem('tk_auth')

if(!tk_auth){
	window.location.assign('/login')
} else {
	Main.init();
}


