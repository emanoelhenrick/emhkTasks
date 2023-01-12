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
	},

	bindEvents: function(){

		this.$btnLogin.onclick = this.Events.sendToBackLogin;

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

			fetch("http://192.168.0.103:3000/loginAuth", options)
				.then(res => {
					if(res.status === 400){
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

Auth.init();