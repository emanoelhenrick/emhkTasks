// REQUIRE DE MODULOS NODE
require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const routesApi = require("./routes/api");


// CONNECTION TO MONGO DB
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL, err => {
	if(err){
		console.log("Failed to connect to Mongo DB:", err);
	} else {
		console.log("Success to connect to Mongo DB");
	}
});


// APP SETTINGS
const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", routesApi);

app.get("/", async (req, res) => {
	res.render("index");
});


// SERVER LISTENING
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
