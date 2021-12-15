const express = require("express")
const mongo = require("mongodb").MongoClient
const url = "mongodb://localhost:27017"
const bcrypt = require("bcrypt")

const app = express()

app.use(express.json())


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
                                        res.status(200).end("You are connected !")
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

app.listen(8080)