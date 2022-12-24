const Main = {
    init: function(){
        this.cacheSelectors()
        this.bindEvents()
        this.overflowHub()
        this.unTasks()
    },

    bindEvents: function(){
        window.onload = this.Events.checkButton_verific(this.$checkButton);
    },

    cacheSelectors: function(){
        this.$checkButton = document.querySelectorAll('.checkBT')
        this.$hubTasks = document.querySelector('.hub-tasks')

    },

    overflowHub: function(){
            const altHub = this.$hubTasks.clientHeight
            if(altHub === 638){
                this.$hubTasks.style.overflow = 'auto'
            }   
    },

    unTasks: function(){
            const li = this.$hubTasks.childNodes[1].childElementCount           
            if(li === 0){               
                this.$hubTasks.style.display = 'none'
            }
    },

    Events: {
        checkButton_verific: function(lista){
            lista.forEach((item) => {
                const doneValue = item.dataset.done

                if(doneValue === 'true'){
                    return item.classList.add('done')
                }
                item.classList.remove('done')
            })
        }, 
    }
}

Main.init()