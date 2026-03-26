const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

// app.get("/hello-api", (req, res) => {
//     res.send("Hello, world! Here is an introduction to JavaScript backend programming.")
// });

// app.get("/hello-api-json", (req, res) => {
//     res.send({greeting: "A hello world from the backend!"})
// });

// app.listen(PORT, () => {
//     console.log(`Hello world: server is running on Port ${PORT}.`);
// })

let errorMsg = {}
let status = {}
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const kittySchema = new mongoose.Schema({ name: String });
const Kitten = mongoose.model('Kitten', kittySchema);

app.get("/api/server/status", async(req, res) => {
    const body = req.body;
    console.log(`Received form data:\n${body}`);
    status = {
        statusCode: 201,
        msg: "Cat form submission successful!",
        data: body
    }
    res.status(201).json(status);
});

app.post("/api/submit-form/login", async(req, res) =>{
    const responseBody = {
        status: 200,
        msg: "Login successful!"
    }
    res.status(200).json(responseBody);
})

app.post("/api/kittens", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ status: 400, msg: "Kitten name is required." });
        }
        const kitten = new Kitten({ name });
        await kitten.save();
        res.status(201).json({ status: 201, msg: "Kitten created!", data: kitten });
    } catch (err) {
        res.status(500).json({ status: 500, msg: "Failed to create kitten.", error: err.message });
    }
});

app.get("/api/kittens", async (req, res) => {
    try {
        const kittens = await Kitten.find();
        res.status(200).json({ status: 200, msg: "Kittens retrieved!", data: kittens });
    } catch (err) {
        res.status(500).json({ status: 500, msg: "Failed to fetch kittens.", error: err.message });
    }
});

app.get("/api/kittens/:id", async (req, res) => {
    try {
        const kitten = await Kitten.findById(req.params.id);
        if (!kitten) {
            return res.status(404).json({ status: 404, msg: "Kitten not found." });
        }
        res.status(200).json({ status: 200, msg: "Kitten retrieved!", data: kitten });
    } catch (err) {
        res.status(500).json({ status: 500, msg: "Failed to fetch kitten.", error: err.message });
    }
});

app.put("/api/kittens/:id", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ status: 400, msg: "Kitten name is required." });
        }
        const kitten = await Kitten.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true, runValidators: true }
        );
        if (!kitten) {
            return res.status(404).json({ status: 404, msg: "Kitten not found." });
        }
        res.status(200).json({ status: 200, msg: "Kitten updated!", data: kitten });
    } catch (err) {
        res.status(500).json({ status: 500, msg: "Failed to update kitten.", error: err.message });
    }
});

app.delete("/api/kittens/:id", async (req, res) => {
    try {
        const kitten = await Kitten.findByIdAndDelete(req.params.id);
        if (!kitten) {
            return res.status(404).json({ status: 404, msg: "Kitten not found." });
        }
        res.status(200).json({ status: 200, msg: "Kitten deleted!", data: kitten });
    } catch (err) {
        res.status(500).json({ status: 500, msg: "Failed to delete kitten.", error: err.message });
    }
});

async function meow(kittenName){
    await mongoose.connect("mongodb+srv://memecu440_db_user:Sample-dample@ism-project.wyrfril.mongodb.net/?appName=ISM-project");
    const kitty1 = new Kitten({ name: kittenName })
    await kitty1.save()
    console.log(kitty1.name)
}

app.listen(PORT, () => {
    console.log(`Hello world: server is running on Port ${PORT}.`);
    meow()
})

async function postData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data)
    });
    return response.json();
}
postData("http://localhost:3000/api/submit-form/login",
    {username: "AfamO", password: "mew!£qwe12"}).then((data) => {
        console.log(data);
    });