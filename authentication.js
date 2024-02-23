const express = require('express')
const app = express()
const bcrypt = require('bcrypt')


app.use(express.json())
var users = []
app.get('/users',(req,res) => {
    res.json(users)
})

app.post('/users',async (req,res) => {
    try{
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        const user = { name: req.body.name, password: hashedPass};
        users.push(user)
        res.status(201).json(users)
    }
    catch{
        res.status(500).send()
    }
})

app.post('/users/login',async (req,res) => {
    const user = users.find(user => user.name === req.body.name)
    if(user == null){
        return res.status(400).send(`user ${req.body.name} doesn't exist`)
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send(`logged in`)
        }else{
            res.send(`wrong password`)
        }
    }catch{
        res.status(500).send()
    }
})

app.listen(3000,() => {
    console.log(`The authentication app is listening on port 3000`)
})