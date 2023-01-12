const Auth = {
    init: function(){
        this.cacheSelectors()
        this.bindEvents()
    },

    cacheSelectors: function(){
        this.$usernameInput = document.querySelector('#username')
        this.$passwordInput = document.querySelector('#password')
        this.$btnLogin = document.querySelector('#btn-login')
    },

    bindEvents: function(){

        this.$btnLogin.onclick = this.Events.sendToBackLogin

    },


    Events: {

        sendToBackLogin: function(){

            const userData = {
                username: Auth.$usernameInput.value,
                password: Auth.$passwordInput.value
            }

            const options = {
				method: "POST",
				headers: new Headers({"content-type": "application/json"}),
				body: JSON.stringify(userData)
			};

			fetch("http://192.168.0.103:3000/loginAuth", options)
                .then(res => {
                    if (res.status === 302) {
                    return res.json();
                    }
                    throw new Error('Unexpected response');
                })
                .then(data => {
                    if (data.redirect) {
                    window.location.assign(data.redirect);
                    }
                });

        },

    }
}

Auth.init()