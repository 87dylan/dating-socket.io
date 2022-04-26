const { Socket } = require('dgram')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, { cors: { origin: "*" } })

const mongoose = require('mongoose');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname +"/public"));

app.set('view engine', 'ejs')



mongoose.connect('mongodb+srv://gdylan:helloworld@cluster0.7vc46.mongodb.net/singleSquad?retryWrites=true&w=majority', { useNewUrlParser: true });
const UsersSchema = {
    name: Number,
    gender: String,
    finding:Boolean
}
const User = mongoose.model("User", UsersSchema);

// const user1 = new User({
//     name: 1,
//     gender: 'm',
//     finding:false
// })

// const user2 = new User({
//     name: 2,
//     gender: 'm',
//     finding:false

// })

// const user3 = new User({
//     name: 3,
//     gender: 'm',
//     finding:false

// })

// const user4 = new User({
//     name: 4,
//     gender: 'm',
//     finding:false

// })

// const user5 = new User({
//     name: 5,
//     gender: 'm',
//     finding:false

// })

// const user6 = new User({
//     name: 6,
//     gender: 'f',
//     finding:false

// })

// const user7 = new User({
//     name: 7,
//     gender: 'f',
//     finding:false

// })

// const user8 = new User({
//     name: 8,
//     gender: 'f',
//     finding:false

// })

// const user9 = new User({
//     name: 9,
//     gender: 'f',
//     finding:false

// })

// const user10 = new User({
//     name: 10,
//     gender: 'f',
//     finding:false

// })


// const currentUsers = [user1, user2, user3, user4, user5, user6, user7, user8, user9, user10];


// User.insertMany(currentUsers, (err) => {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log("successful saved to database");
//     }
// });


var userobject;
var matchedUser;
console.log("before"+matchedUser)

app.get('/user/:userId', (req, res) => {
    let userid = req.params.userId;
    User.findOne({name:userid},(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            userobject=result
            res.render('home',{userobject:result});
        }
    })
    


    }

);


const port = process.env.port || 3001;


server.listen(port, () => console.log(`Server running on port ${port}`));

io.on("connection", (socket) => {


    


socket.on("update", (data)=>{

    User.findOneAndUpdate({name:userobject.name},{$set:{finding:true}},{new:true},(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("updated");
        }
    });

    

        User.find({} , (err, users) => {
            if(err) {
             console.log("shit");  
            }
            users.map(user => {
                if(user.finding===true&&user.name!=userobject.name){
                    if(user.gender!=userobject.gender){
                        matchedUser=user.name;
                    console.log(matchedUser+"new user");
                        data="matched with"+matchedUser;
                        
                            socket.broadcast.emit("updated",data);
                        
                    }
                    
                
                   
        
                }
        
            }) 
        })

    
    



});

})


