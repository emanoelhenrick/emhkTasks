const URL_FETCH = "http://localhost:10000"; //"https://emhk-tasks.onrender.com";


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

		this.$logoutBTN.onclick = this.Events.logout;

		this.$inputTask.onkeypress = (event) => 
		{if(event.key === "Enter"){Main.Events.sendButton_newTask();}};

	},

	cacheSelectors: function(){
		this.$checkButton = document.querySelectorAll(".checkBT");
		this.$hubTasks = document.querySelector(".hub-tasks");
		this.$sendButton = document.getElementById("sendButton");
		this.$inputTask = document.getElementById("inputTask");
		this.$deleteBTN = document.querySelectorAll(".deleteBT");
		this.$logoutBTN = document.querySelector(".logout-btn");
		this.$loadingTask = document.querySelectorAll(".loadingTask");
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

		await fetch(URL_FETCH + "/api/all", options)
			.then(res => res.json())
			.then(json => {

				document.querySelector(".usernameBox").innerHTML = json.username;
				tasksOnFront = json.taskList;
				Main.renderTaskList();
        
			});
	},

	renderTaskList: () => {

		let taskElements = "";

		tasksOnFront.forEach((task) => {

			let doneClass = "";
			if(task.done === true){
				doneClass = "done";
			} else {
				doneClass = "";
			}

			const taskID = task._id;
			let taskElement = `
					<li>
						<div id="loadTask" class="${task.load}"></div>
						<button onclick="Main.Events.check_done('${taskID}')" class="checkBT ${doneClass}" value="${taskID}" id="checkBT" data-done="${task.done}"></button>
							<span>${task.task}</span>
						<button name="deleteBT" class="deleteBT" value="${taskID}"></button>
					</li>
						`;
		
			taskElements += taskElement;
		});

		document.getElementById("list").innerHTML = taskElements;
	},

	Events: {
		checkButton_verific: async function(element){

			const taskID = {taskID: element.target.value};
			const doneValue = element.target.dataset.done;

			if(doneValue === "false"){
				element.target.dataset.done = "true";

				for (let task of tasksOnFront){
					if(task._id === taskID.taskID){
						task.done = true;
					}
				}
				
			} else {
				element.target.dataset.done = "false";
				
				for (let task of tasksOnFront){
					if(task._id === taskID.taskID){
						task.done = false;
					}
				}

			}

			if(!element.target.classList.contains("done")){
				element.target.classList.add("done");
			} else {
				element.target.classList.remove("done");
			}
			
			const options = {
				method: "POST",
				headers: new Headers({"content-type": "application/json"}),
				body: JSON.stringify(taskID)
			};
			await fetch(URL_FETCH + "/api/done", options);
           
		},

		sendButton_newTask: async () => {

			const task = {task: Main.$inputTask.value, tk: tk_auth};

			tasksOnFront.push({task: Main.$inputTask.value, done: false, tmp: true, _id: "", load: "loadingTask"});

			Main.renderTaskList();
			
			const options = {
				method: "POST",
				headers: new Headers({"content-type": "application/json"}),
				body: JSON.stringify(task)
			};

			document.getElementById("inputTask").value = "";

			setTimeout(async () => {
				await fetch(URL_FETCH + "/api/new", options)
					.then(() => {
						const tasksUp = tasksOnFront.filter(task => {
							if(!task.tmp){
								return task;
							}
						});
	
						tasksOnFront = tasksUp;
					});
				Main.init();
				
			}, 1000);

			
		},

		delete_ask: async function(element){

			const taskID = {taskID: element.target.value};

			const tasksUp = tasksOnFront.filter(task => {
				if(task._id !== taskID.taskID){
					return task;
				}
			});

			tasksOnFront = tasksUp;

			Main.renderTaskList();

			const options = {
				method: "POST",
				headers: new Headers({"content-type": "application/json"}),
				body: JSON.stringify(taskID)
			};
			await fetch(URL_FETCH + "/api/delete", options);
			
			Main.cacheSelectors();
			Main.bindEvents();
		},

		logout: function(){
			localStorage.removeItem("tk_auth");
			window.location.assign("/login");
		}
	}
};

const tk_auth = localStorage.getItem("tk_auth");

let tasksOnFront = [];

if(!tk_auth){
	window.location.assign("/login");
} else {
	Main.init();
}