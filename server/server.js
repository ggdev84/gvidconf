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
                                        .then(token=>{
                                            db.collection("users").insertOne({
                                                name, 
                                                email, 
                                                password:hash, 
                                                token,
                                                friends:[],
                                                sentFriendsRequests:[],
                                                receivedFriendsRequests:[],
                                                messages:[]
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
                                        req.session.sentFriendsRequests = user.sentFriendsRequests
                                        req.session.receivedFriendsRequests = user.receivedFriendsRequests
                                        req.session.messages = user.messages

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
        // Get all data
        mongo.connect(url, (err, result)=>{
            if(err){res.status(200).end("Server error. Please try later.")}
            else{
                var db = result.db("gvidconf")
                db.collection("users").findOne({token:req.session.token}, (err, user)=>{
                    if(err){res.status(200).end("Server error. Please try later.")}
                    else{
                        let obj={...user}
                        delete obj._id
                        delete obj.password
                        res.status(200).end(JSON.stringify(obj))
                    }
                })
            }
        })
    }
    else{
        res.status(200).end("You are not logged in.")
    }
})

app.get("/amiloggedin", (req,res)=>{
    if(req.session.loggedin)
        res.status(200).end("logged in")
    else
        res.status(200).end("You are not connected.")
})

app.get("/logout", (req,res)=>{
    req.session.destroy()
    res.status(200).end("logged out")
})

app.post("/addfriend", (req,res)=>{
    if(req.session.loggedin===true){
        if("token" in req.body){
            let token = req.body.token
            mongo.connect(url, (err, result)=>{
                if(err){res.status(200).end("Server error. Please try later.")}
                else{
                    var db = result.db("gvidconf")
                    console.log("Token "+req.session.token)
                    let obj={
                        name:req.session.name,
                        token:req.session.token
                    }
                    db.collection("users").updateOne({token}, {$push:{receivedFriendsRequests:obj}}, (err, ok)=>{
                        if(err){res.status(200).end("Server error. Please try later.")}
                        else{
                            db.collection("users").updateOne({token:req.session.token}, {$push:{sentFriendsRequests:token}}, (err,ok)=>{
                                if(err){res.status(200).end("Server error. Please try later.")}
                                else{
                                    res.status(200).end("Friend request sent. ")
                                }
                            })
                        }
                    })
                }
            })
        }
        else{
            res.status(200).end("Please enter a name / token.")
        }
    }
    else{
        res.status(200).end("You are not logged in.")
    }
})

app.post("/acceptfriend", (req,res)=>{
    if(req.session.loggedin===true){
        if("token" in req.body && "name" in req.body){
            let token = req.body.token
            let name = req.body.name
            mongo.connect(url, (err, result)=>{
                if(err){res.status(200).end("Server error. Please try later.")}
                else{
                    var db = result.db("gvidconf")
                    db.collection("users").findOne({token:req.session.token}, (err, user)=>{
                        if(err){res.status(200).end("Server error. Please try later.")}
                        else{
                            if(user.receivedFriendsRequests.some(i=>i.token ===  token)){
                                db.collection("users").updateOne({token:req.session.token}, {$push:{friends:{token, name}}}, (err, pushed)=>{
                                    if(err){res.status(200).end("Server error. Please try later.")}
                                    else{
                                        db.collection("users").updateOne({token},{$pull:{"sentFriendsRequests":req.session.token}}, (err, removed)=>{
                                            if(err){res.status(200).end("Server error. Please try later.")}
                                            else{
                                                db.collection("users").updateOne({token:req.session.token}, {$pull:{receivedFriendsRequests:{token}}}, (err, removed2)=>{
                                                    if(err){res.status(200).end("Server error. Please try later.")}
                                                    else{
                                                        db.collection("users").updateOne({token:token}, {$push:{friends:{token:req.session.token, name:req.session.name}}}, (err, pushed2)=>{
                                                            if(err){res.status(200).end("Server error. Please try later.")}
                                                            else{
                                                                res.status(200).end("Friend request accepted.")
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                            else{
                                res.status(200).end("Friend request not found.")
                            }
                        }
                    })
                }
            })
        }
    }
    else{
        res.status(200).end("You are not logged in.")
    }
})

app.post("/getallcontacts", (req,res)=>{
    if(req.session.loggedin===true){
        if("search" in req.body){
            let search = req.body.search
            console.log(search)
            mongo.connect(url,(err, result)=>{
                if(err){res.status(200).end("Server error. Please try later.")}
                else{
                    var db = result.db("gvidconf")
                    //{$or:[{name:/.*search.*/i}, {token:/.*search.*/i}]}
                    db.collection("users").find({
                        $or:[
                            {name:{$regex:search, $options:"i"}},
                            {token:{$regex:search, $options:"i"}}
                        ]
                        }, {projection:{_id:0,name:1, token:1}}).toArray((err, list)=>{
                        if(err){res.status(200).end("Server error. Please try later.")}
                        else{
                            console.log(list)
                            res.status(200).end(JSON.stringify({userslist:list}))
                        }
                    })
                }
            })
        }
        else{
            res.status(200).end("Please enter a name or token.")
        }

    }
    else{
        res.status(200).end("You are not logged in.")
    }
})

app.post("/deletefriend", (req,res)=>{
    if(req.session.loggedin ===true){
        if("token" in req.body){
            let token = req.body.token
            mongo.connect(url, (err, result)=>{
                if(err){res.status(200).end("Server error. Please try later.")}
                else{
                    var db = result.db("gvidconf")
                    db.collection("users").updateOne({token:req.session.token}, {$pull:{friends:{token}}}, (err, deleted)=>{
                        if(err){res.status(200).end("Server error. Please try later.")}
                        else{
                            db.collection("users").updateOne({token}, {$pull:{friends:{token:req.session.token}}}, (err, deleted2)=>{
                                if(err){res.status(200).end("Server error. Please try later.")}
                                else{
                                    res.status(200).end("Friend deleted.")
                                }
                            })
                        }
                    })
                }
            })
        }
        else{
            res.status(200).end("Please enter a token.")
        }
    }
    else{
        res.status(200).end("You are not logged in.")
    }
})

app.post("/rejectfriend", (req,res)=>{
    if(req.session.loggedin ===true){
        if("token" in req.body){
            let token = req.body.token
            mongo.connect(url, (err, result)=>{
                if(err){res.status(200).end("Server error. Please try later.")}
                else{
                    var db = result.db("gvidconf")
                    db.collection("users").updateOne({token:req.session.token}, {$pull:{receivedFriendsRequests:{token}}}, (err, deleted)=>{
                        if(err){res.status(200).end("Server error. Please try later.")}
                        else{
                            db.collection("users").updateOne({token}, {$pull:{sentFriendsRequests:req.session.token}}, (err, deleted2)=>{
                                if(err){res.status(200).end("Server error. Please try later.")}
                                else{
                                    res.status(200).end("Friend request rejected.")
                                }
                            })
                        }
                    })
                }
            })
        }
        else{
            res.status(200).end("Please enter a token.")
        }
    }
    else{
        res.status(200).end("You are not logged in.")
    }
})




app.listen(8080)