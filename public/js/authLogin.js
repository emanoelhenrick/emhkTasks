const URL_FETCH = "http://localhost:10000"; //"https://emhk-tasks-v2.onrender.com";

const Auth = {
	init: function(){
		this.cacheSelectors();
		this.bindEvents();
	},

	cacheSelectors: function(){
		this.$usernameInput = document.querySelector("#username");
		this.$passwordInput = document.querySelector("#password");
		this.$btnLogin = document.querySelector("#btn-login");
		this.$errorAlert = document.querySelector(".error");
		this.$loadingPanel = document.querySelector(".loading");
	},

	bindEvents: function(){

		this.$btnLogin.onclick = this.Events.sendToBackLogin;

		this.$passwordInput.onkeypress = (event) => {
			if(event.key === "Enter"){Auth.Events.sendToBackLogin();}
		};

	},


	Events: {

		sendToBackLogin: function(){

			const userData = {
				username: Auth.$usernameInput.value,
				password: Auth.$passwordInput.value
			};

			const options = {
				method: "POST",
				headers: new Headers({"content-type": "application/json"}),
				body: JSON.stringify(userData)
			};

			Auth.$loadingPanel.classList.add("ok");

			fetch(URL_FETCH + "/loginAuth", options)
				.then(res => {
					if(res.status === 400){

						if(Auth.$loadingPanel.classList.contains("ok")){
							Auth.$loadingPanel.classList.remove("ok");
						}

						Auth.$errorAlert.classList.add("fail");
						return Promise.reject();
					} else if(res.status === 302) {
						if(Auth.$errorAlert.classList.contains("fail")){
							Auth.$errorAlert.classList.remove("fail");
						}
						Auth.$usernameInput.value = "";
						Auth.$passwordInput.value = "";
						return res.json();
					} else {
						throw new Error("Unexpected response");
					}
                    
				})
				.then(data => {
					localStorage.setItem("tk_auth", data.tk_auth);
					if (data.redirect) {
						window.location.assign(data.redirect);
					}
				});
		},
	}
};

const tk_auth = localStorage.getItem("tk_auth");

if(tk_auth){
	window.location.assign("/app");
} else {
	Auth.init();
}