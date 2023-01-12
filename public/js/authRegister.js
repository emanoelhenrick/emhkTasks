const Auth = {
    init: function(){
        this.cacheSelectors()
        this.bindEvents()
    },

    cacheSelectors: function(){
        this.$usernameInput = document.querySelector('#username')
        this.$emailInput = document.querySelector('#email')
        this.$passwordInput = document.querySelector('#password')
        this.$btnRegister = document.querySelector('#btn-register')
        this.$errorAlert = document.querySelector('.error')
    },

    bindEvents: function(){

        this.$btnRegister.onclick = this.Events.sendToBackRegister
        

    },

    Events: {

        sendToBackRegister: function(){
            
            const userData = {
                username: Auth.$usernameInput.value,
                email: Auth.$emailInput.value,
                password: Auth.$passwordInput.value
            }

            const options = {
				method: "POST",
				headers: new Headers({"content-type": "application/json"}),
				body: JSON.stringify(userData)
			};


            if(!userData.username || !userData.email || !userData.password){
                Auth.$errorAlert.classList.add('fail');
                return Auth.$errorAlert.innerHTML = '*Digite valores validos'
            } 

			fetch("http://192.168.0.103:3000/newRegister", options)
                .then(async res => {
                    if(res.status === 400){
                        const json = await res.json();
                        Auth.$errorAlert.classList.add('fail');
                        Auth.$errorAlert.innerHTML = '*' + json.error
                        return Promise.reject();

                    } else if(res.status === 302) {
                        if(Auth.$errorAlert.classList.contains('fail')){
                            Auth.$errorAlert.classList.remove('fail');
                        }
                        Auth.$usernameInput.value = ''
                        Auth.$emailInput.value = ''
                        Auth.$passwordInput.value = ''
                        return await res.json();
                    } else {
                        throw new Error('Unexpected response');
                    }
                })
                .then(data => {
                    if (data.redirect) {
                    window.location.assign(data.redirect);
                    }
                })
        }
    }
}

Auth.init()