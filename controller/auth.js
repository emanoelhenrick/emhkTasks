const User = require('../model/User')
const bcrypt = require('bcryptjs')


const register = async (req, res) => {
    const { username, email, password } = req.body

    const emailVerify = await User.findOne({email: email})
    if(emailVerify){return res.status(400).send('email already exists')}


    const newUser = new User({
        username: username,
        email: email,
        password: bcrypt.hashSync(password)
    })

    newUser.save()
        .catch('houve um erro no registro')
    
    
    res.status(302).send({ redirect: '/login' });
}

const login = async (req, res) => {

    const { username, password } = req.body

    const user = await User.findOne({username: username})
    if(!user){return res.status(400).send('username doesnt exists')} 

    const pwdVerify = bcrypt.compareSync(password, user.password)

    if(!pwdVerify){return console.log('senha errada')}

    res.status(302).send({ redirect: '/app' });

}

module.exports = {
    register,
    login
}