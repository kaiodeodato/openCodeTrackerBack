// Allowing us to create a web application and define routes.
const express = require('express');
// imports the Mongoose library, which provides a simple ad flexible way to interact with
// MongoDB databases.
const mongoose = require('mongoose');
// imports body-parser middleware, which parses the incoming request bodies in a middleware
// before your handlers. It extracts the body portion of an incoming HTTP request
// and exposes it on the req.body property.
const bodyParser = require('body-parser');
// imports Node.js built-in module 'path', which provides utilities for working with
// file and directory paths. It is used to manupulate file paths and resolve relative paths.
const path = require('path');
// imports the Node.js built-in module 'fs' (file system), which provides functionality for 
// interacting with the file system. It allows reading, writing and manipulating filse and directories.
const fs = require('fs');
// imports the express-session middleware, which is used to manage user sessions in an Express application. It provides a way to store and access session data between requests.
const session = require('express-session');
// imports the CORS (Cross-Origin Resourse Sharing) middleware, which enables cross-origin resource
// sharing (CORS) for Express applications.
// It allows controlled access to resources from different domains or origins.
const cors = require('cors')

// this line load environment variables from a .env file using process.env.?
require('dotenv').config();
// this line assigns the value of the environment variable PORT to the 'port' variable.
// If its not set, it defaults to 5000.
const port = process.env.PORT || 5000;
// imports a custom module that allows us to use the functionality defined in tha module.
const Posts = require('./Posts.js')
// this line creates an instance of the Express application, which represents our web server
const app = express();

// this line establishes a connection to the MongoDB database using the URL specified
// in the environment variable URL_KEY
mongoose.connect(process.env.URL_KEY, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log('Connect to the Database')})
.catch((err)=>{console.log(err)})

// this line adds the CORS middleware to the Express application. It enables Cross-Origin 
// Resource Sharing, allowing requests from differents origins to access this server.
app.use(cors())
// this line adds the express-session middleware to the application.
// It configures session handling with a secret key and sets the maximum age of the session cookie
// to 6000000 milliseconds (100 minutes)
app.use(session({secret: 'sebsetbafveb', cookie: {maxAge: 6000000}}))
// these lines add the body-parser middleware to the app. The first line parses
// incoming requests with JSON payloads, and the second line parses incoming request 
// with URL-encoded payloads.
// this middleware makes the parsed data available  on the req.body object.
app.use( bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// this line sets the view engine for the app to 'html' using EJS (Embedded JavaScript)
// template engine. It tells Express how to render HTML files using EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine','html');
// this line server static located in the 'public' directory. It maps the '/public' URL path to the 'public' directory using the express.static middleware. This allows the files in the 'public' directory (such as CSS, JS or images) to be accessible to the client
app.use('/public', express.static(path.join(__dirname, 'public')));
// this line sets the directory where the application's views (templates) are located.
// It specifies that the 'views' directory is located in the 'pages' directory at the same level as the current script file.
app.set('views', path.join(__dirname, '/pages'));

// this code defines a route handler for the URL('/'). When a GET request is made to the root URL, it first finds
// all the posts in the database using the 'Posts'model, and then logs the retrieved data to the console.
// finally, it renders the 'home' view/template  and sends it as a response
app.get('/',(req,res)=>{
    if (req.query.search == null){
        Posts.find({})
        .sort({_id: -1})
        .then((posts)=>{
            res.render('home', {posts: posts})
        }).catch((err)=>{
            res.redirect('/')
            console.log(err)
        })
    }else{
        Posts.find({title: {$regex: req.query.search, $options: "i"}})
        .then(posts => {
            res.render('home',{posts: posts})
        })
    }
})
// going to the post page
app.get('/slug/:slug',(req,res)=>{
    Posts.findOneAndUpdate(
        {slug: req.params.slug},
        {$inc: {views: 1}},
        {new: true})
        .then((post)=>{
            // if the slug exists
            if(post){
                res.render('single', {post: post})
            }else{
                res.redirect('/')
            }
        })
        .catch((err)=>{
            console.log(err);
            res.redirect('/')
        });
})

var usuarios = [
    {
      login: process.env.LOGIN,
      password: process.env.SENHA
    }
  ]

// access to the admin-panel

app.get('/admin',(req,res)=>{

    if(req.session.login == null){
        res.render('admin-login', {msg:''})
    }else{
        Posts.find({})
        .sort({_id: -1})
        .then((posts)=>{
            res.render('admin-panel', {posts: posts})
        })
    }
})

// login session
app.post('/admin',(req,res)=>{
    let loggedIn = false;

    usuarios.map((item) => {
      console.log(req.body.login, req.body.password);
      if (item.login == req.body.login && item.password == req.body.password) {
        req.session.login = req.body.login;
        loggedIn = true;
      }
    });
  
    if (loggedIn) {
      res.redirect('/admin');
    } else {
      res.render('admin-login', { msg: 'Invalid login credentials' });
    }
})

app.post('/admin/post', (req,res)=>{
    const content1 = req.body.content1;
    const truncatedContent1 = content1.substring(0, 25) + '...';

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    Posts.create({
        title: req.body.title,
        image: req.body.image,
        tecnologies: req.body.tecnologies.split(',').map((tech) => tech.trim()),
        content1: content1,
        content2: req.body.content2,
        slug: truncatedContent1,
        date: formattedDate,
        views: 0
    })
    res.redirect('/admin')
})
// delet a post

app.get('/admin/delete/:id',(req,res)=>{
    Posts.deleteOne({_id:req.params.id})
    .then(()=>{
        res.redirect('/admin')
    }).catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      });
})
//logout
app.get('/logout', (req, res) => {
    // Destroy the session and redirect to the login page
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    });
  });

// this code defines a route handler that takes avery data in the database and returns it as a json 
app.get('/api',(req,res)=>{
    Posts.find({})
    .then((data)=> {
        res.json(data)
    }).catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      });
})

app.get('/api/:fragment',(req,res)=>{
    Posts.find({content1: {$regex: req.params.fragment, $options: "i"}})
    .then((posts)=>{
        res.json(posts)
    }).catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      });
})

app.get('/api/title/:fragment',(req,res)=>{
    Posts.findOneAndUpdate(
        {title: req.params.fragment},
        {$inc: {views: 1}},
        {new: true})
    .then((post)=>{
        res.json(post)
    }).catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      });
})

app.get('/api/views/trending',(req,res)=>{
    Posts.find({})
    .sort({ views: -1 })
    .then((post)=>{
        res.json(post)
    }).catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      });
})

app.get('/api/category/search/:name', (req, res) => {
    const technology = req.params.name;

    Posts.find({ tecnologies: { $regex: new RegExp(technology, 'i') } }) 
    .sort({ _id: -1 })
    .then((posts) => {
      res.json(posts);
    })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      });
  });



// this code starts the Express application and listen for incoming HTTP request on the specifiel port
// and logs a message saying that the server is running
app.listen(port,()=> {
    console.log('server is running on port 5000');
})

