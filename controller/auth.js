const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");


const register = async (req, res) => {

	const { username, email, password } = req.body;

	const schema = Joi.object({
		email: Joi.string()
			.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
        
		password: Joi.string()
			.min(8)
	});

	const valueEmail = schema.validate({email: email});
	if(valueEmail.error){return res.status(400).send({ error: "E-mail inválido"});}

	const valuePassword = schema.validate({password: password});
	if(valuePassword.error){return res.status(400).send({ error: "A senha deve ter pelo menos 8 caracteres"});}
	
	const userVerify = await User.findOne({username: username});
	if(userVerify){return res.status(400).send({ error: "username já existe" });}

	const emailVerify = await User.findOne({email: email});
	if(emailVerify){return res.status(400).send({ error: "email já existe" });}

	const newUser = new User({
		username: username,
		email: email,
		password: bcrypt.hashSync(password)
	});

	newUser.save()
		.catch("houve um erro no registro");
    
	res.status(302).send({ redirect: "/login" });
};

const login = async (req, res) => {
	const { username, password } = req.body;

	const user = await User.findOne({username: username});
	if(!user){return res.status(400).send({ error: "username doesnt exists"});} 

	const pwdVerify = bcrypt.compareSync(password, user.password);

	if(!pwdVerify){return res.status(400).send({ error: "password incorrect"});}

	const userToken = jwt.sign({_id: user._id}, process.env.TK_SEC);

	res.status(302).send({ redirect: "/app", tk_auth: userToken});
};

module.exports = {
	register,
	login
};