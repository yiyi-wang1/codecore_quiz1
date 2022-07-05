const express = require('express');
const app = express();
const knex = require('./db/client');

//Setup Middleware
//1.Morgan
const morgan = require('morgan');
app.use(morgan('dev'));

//2.Body-parser
app.use(express.urlencoded({ extended: true }));

//3.Cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());


//4.static assets
const path = require('path');
app.use(express.static(path.join(__dirname, "public")));


//Custom Middleware for cookies
app.use((req, res, next) => {
    const username = req.cookies.username || ""
    res.locals.username = username;
    next();
})


//Routes

//Show all clucks to index page
app.get('/', (req, res) => {
    knex('clucks').orderBy('created_at', 'desc').then(clucks => {
        let tag = {};
        clucks.forEach(cluck => {
            const time = (Date.now() - Date.parse(cluck.created_at)) / (1000 * 60); //converted to minutes
            let readTime = '';
            if (Math.floor(time / (60 * 24)) == 0) { //less than one day
                if (Math.floor(time / 60) == 0) { //less than one hour
                    minutes = Math.floor(time % 60);
                    if (minutes == 0) {
                        readTime = "Just now";
                    } else {
                        if (minutes > 1) {
                            readTime = minutes + " mins ago";
                        } else {
                            readTime = minutes + " min ago";
                        }
                    }
                } else {
                    hours = Math.floor(time / 60);
                    if (hours > 1) {
                        readTime = hours + " hours ago";
                    } else {
                        readTime = hours + " hour ago";
                    }
                }
            } else {
                days = Math.floor(time / (60 * 24));
                readTime = days + " days ago";
            }
            cluck.readTime = readTime;
            const words = cluck.content.split(" ");
            words.forEach(word => {
                if (word.startsWith('#')) {
                    tag[word] = tag[word] ? tag[word] + 1 : 1;
                }
            })
        })
        const sortedTag = Object.entries(tag)
            .sort(([, a], [, b]) => b - a)
            .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
        res.render('clucks/all', { clucks: clucks, tag: sortedTag });
    })
})

//This path will do same thing as the home page, so redirect to home page
app.get('/clucks', (req, res) => {
    res.redirect('/');
})

//Show login page
app.get('/log_in', (req, res) => {
    res.render('clucks/login');
})

//Login user
app.post('/log_in', (req, res) => {
    const username = req.body.username;
    const COOKIE_MAX_LENGTH = 60 * 60 * 24 * 1000;
    res.cookie('username', username, { maxAge: COOKIE_MAX_LENGTH });
    res.redirect('/');
})

//Logout user
app.post('/log_out', (req, res) => {
    res.clearCookie('username');
    res.redirect('/');
})

//Show create page
app.get('/clucks/new', (req, res) => {
    if (res.locals.username == "") {
        res.render('clucks/error');
    } else {
        res.render('clucks/new', { err: false })
    }
})

//Create a new cluck
app.post('/clucks', (req, res) => {
    const content = req.body.content;
    const image_url = req.body.image_url;
    console.log(content);
    console.log(image_url);
    if (!content && !image_url) {
        res.render('clucks/new', { err: "Please enter content or image url!" });
    } else {
        knex('clucks').insert({
            username: req.cookies.username,
            content: content,
            image_url: image_url
        }).then(() => {
            res.redirect('/clucks');
        })
    }
})

//Error Middleware
const createError = require('http-errors');
app.use((req, res, next) => {
    next(createError(404));
})

//Error Handler
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
})

//Setup View Engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//Setup Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`The application is running on http://localhost:${PORT}...`);
})