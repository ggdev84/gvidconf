const express = require("express")
const mongo = require("mongodb").MongoClient
const url = "mongodb://localhost:27017"
const bcrypt = require("bcrypt")
const cors = require("cors")
const session = require("express-session")
const connect = require("connect-mongo")

const app = express()

app.use(session({
    store:connect.create({
        mongoUrl:url,
        dbName:"gvidconfsessions"
    }),
    secret:"1df85zed85ezd2f52e9dz5ed",
    resave:true,
    saveUninitialized:false,
    cookie:{
        secure:false
    }
}))

app.use(express.json())
app.use(cors())




var generatetoken = (length) => {
    return new Promise((resolve, reject)=>{
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        resolve(result);
    })    
}


app.get("/", (req, res)=>{
    res.status(200).send("Hello")
})

app.post("/register", (req, res)=>{
    let data = req.body
    console.log(data)
    if("name" in data && "email" in data && "password" in data && "confirmpassword" in data){
        let name = data.name
        let email  = data.email
        let password = data.password
        let confirmpassword = data.confirmpassword

        if(password === confirmpassword){
            mongo.connect(url, (err, result)=>{
                if(err){res.status(200).end("Server error. Please try later.")}
                else{
                    var db = result.db("gvidconf")
                    db.collection("users").findOne({email}, (err, user)=>{
                        if(err){res.status(200).end("Server error. Please try later.")}
                        else{
                            if(user===null){    
                                bcrypt.hash(password, 10, (err, hash)=>{
                                    if(err){res.status(200).end("Server error. Please try later.")}
                                    else{
                                        generatetoken(10)
                                        .then(data=>{
                                            db.collection("users").insertOne({
                                                name, 
                                                email, 
                                                password:hash, 
                                                token:data,
                                                friends:[]
                                            }, (err, ok)=>{
                                                if(err){res.status(200).end("Server error. Please try later.")}
                                                else{
                                                    res.status(200).end("You are now registered. You can log in.")
                                                }
                                            })
                                        })
                                    }
                                })
                            }
                            else{
                                res.status(200).end("Email already used.")
                            }
                        }
                    })
                }
            })
        }
        else{
            res.status(200).end("Passwords do not match.")
        }


    }
    else{
        res.status(200).end("Please fill all the fields.")
    }
})

app.post("/login", (req,res)=>{
    let data = req.body
    if("email" in data && "password" in data){
        let email = data.email
        let password = data.password

        mongo.connect(url, (err, result)=>{
            if(err){res.status(200).end("Server error. Please try later.")}
            else{
                var db = result.db("gvidconf")
                db.collection("users").findOne({email}, (err, user)=>{
                    if(err){res.status(200).end("Server error. Please try later.")}
                    else{
                        if(user!==null){
                            bcrypt.compare(password, user.password, (err, same)=>{
                                if(err){res.status(200).end("Server error. Please try later.")}
                                else{
                                    if(same){
                                        req.session.loggedin = true
                                        req.session.email = user.email
                                        req.session.friends = user.friends
                                        req.session.name = user.name
                                        req.session.token = user.token

                                        console.log(req.session)

                                        res.status(200).end("logged in")
                                    }
                                    else{
                                        res.status(200).end("Password is incorrect")
                                    }
                                }
                            })
                        }
                        else{
                            res.status(200).end("User does not exist")
                        }
                    }
                })
            }
        })
    }
    else{
        res.status(200).end("Please fill all the fields")
    }
})

app.get("/getdata", (req,res)=>{
    console.log(req.session)
    if(req.session.loggedin === true){
        let data={
            email : req.session.email,
            friends : req.session.friends, 
            name : req.session.name,
            token : req.session.token 
        }
        res.status(200).end(JSON.stringify(data))
    }
    else{
        res.status(200).end("You are not logged in.")
    }
})


app.get("/logout", (req,res)=>{
    req.session.destroy()
    res.status(200).end("logged out")
})


app.listen(8080)