const URL_FETCH = "http://localhost:10000"; // "https://emhk-tasks.onrender.com";

const Auth = {
	init: function(){
		this.cacheSelectors();
		this.bindEvents();
	},

	cacheSelectors: function(){
		this.$usernameInput = document.querySelector("#username");
		this.$emailInput = document.querySelector("#email");
		this.$passwordInput = document.querySelector("#password");
		this.$btnRegister = document.querySelector("#btn-register");
		this.$errorAlert = document.querySelector(".error");
		this.$loadingPanel = document.querySelector(".loading");
	},

	bindEvents: function(){

		this.$btnRegister.onclick = this.Events.sendToBackRegister;

		this.$passwordInput.onkeypress = (event) => {
			if(event.key === "Enter"){Auth.Events.sendToBackRegister();}
		};
	},

	Events: {

		sendToBackRegister: function(){
            
			const userData = {
				username: Auth.$usernameInput.value,
				email: Auth.$emailInput.value,
				password: Auth.$passwordInput.value
			};

			const options = {
				method: "POST",
				headers: new Headers({"content-type": "application/json"}),
				body: JSON.stringify(userData)
			};


			if(!userData.username || !userData.email || !userData.password){
				Auth.$errorAlert.classList.add("fail");
				return Auth.$errorAlert.innerHTML = "*Digite valores validos";
			} 

			Auth.$loadingPanel.classList.add("ok");

			fetch(URL_FETCH + "/newRegister", options)
				.then(async res => {
				
					if(res.status === 400){

						if(Auth.$loadingPanel.classList.contains("ok")){
							Auth.$loadingPanel.classList.remove("ok");
						}

						const json = await res.json();
						Auth.$errorAlert.classList.add("fail");
						Auth.$errorAlert.innerHTML = "*" + json.error;
						return Promise.reject();

					} else if(res.status === 302) {
						if(Auth.$errorAlert.classList.contains("fail")){
							Auth.$errorAlert.classList.remove("fail");
						}
						Auth.$usernameInput.value = "";
						Auth.$emailInput.value = "";
						Auth.$passwordInput.value = "";
						return await res.json();
					} else {
						throw new Error("Unexpected response");
					}
				})
				.then(data => {
					if (data.redirect) {
						window.location.assign(data.redirect);
					}
				});
		}
	}
};

const tk_auth = localStorage.getItem("tk_auth");

if(tk_auth){
	window.location.assign("/app");
} else {
	Auth.init();
}