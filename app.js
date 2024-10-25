//Requirements
const express=require('express')
const app=express()
const mongoose=require('mongoose')
app.use(express.json())
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//MongoDb Connecting
mongoose.connect('mongodb://localhost:27017/')
.then(()=>{
    console.log("DB connected successfully")
})
.catch((err)=>{
    console.log(err)
})

//MongoDB Schema Creating
const userSchema=new mongoose.Schema({
    username: String,
    email: String,
    phone: String,
    password: String
})

// MongoDB model Creating
const userModel=new mongoose.model('User',userSchema);

//Users detail getting
app.get('/',(req,res)=>{
   res.sendFile(__dirname+"/"+"app.html")
})
app.post('/submit',async (req,res)=>{
    const{username,email,phone,password}=req.body;
    try{
        const newUsers= new userModel({username,email,phone,password});
        await newUsers.save()
        res.status(200)
        res.redirect('/?success=true');
       console.log("user data was added success fully")
         
    }
    catch(err){
        console.log("user not add")
        res.status(500);
    }   
})

//All Users details Display
app.get('/usersdetails', async (req, res) => {
    try {
        const users = await userModel.find(); 
        let tableHTML = `
        <style>
        
        table {
            width: 80%;
            border-collapse: collapse;
            margin: 100px ;
            font-size: 18px;
            text-align: left;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        }
        th, td {
            padding: 12px 15px;
            border: 1px solid #ddd;
        }
        th {
            background-color: #009879;
            color: #ffffff;
            text-align: center;
        }
        tr:nth-child(even) {
            background-color: #f3f3f3;
        }
        tr:nth-child(odd) {
            background-color: #ffffff;
        }
        tr:hover {
            background-color: #f1f1f1;
        }
        td {
            text-align: center;
        }
        </style>
        <table>
            <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Password</th>
            </tr>`;

        users.forEach(user => {
            tableHTML += `
            <tr>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.password}</td>
            </tr>`;
        });

        tableHTML += `</table>`;
        
        res.send(tableHTML);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving user data.");
    }
});


// Already Users LogIn
app.get('/login',(req,res)=>{
     res.sendFile(__dirname+"/"+"login.html")   
})
app.post('/loginuser',async (req,res)=>{
    const {username,password}=req.body
    const neUsers= new userModel({username,password});
    await neUsers.save()
    console.log("welcome back!!!" + username )
    res.status(200)
    res.redirect('/login?success=true')
})

//Running Port SetUp
const port=3000;
app.listen(port,()=>{
    console.log("server is listening succesfully "+port)
})  