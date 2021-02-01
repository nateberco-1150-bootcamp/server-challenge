let router = require("express").Router(); //here
let User = require("../db").import("../models/user"); //here
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


router.post('/create', function(req, res){
        const userName = req.body.username;
        const pw = req.body.password;
    User.create({
        username: userName,
        password: bcrypt.hashSync(pw, 13),
    }).then(
        function createSuccess(user) {
            const token = jwt.sign({id: user.id}, "secret", {expiresIn: 60 * 60 * 24 });
            
            res.json({ 
                user: user,
                message: "User successfully created",
                token: token
            });
        }).catch((err) => res.status(500).json({ error: err}));
    });
  

// Log In

router.post("/login", function(req, res) {
    const userName = req.body.username;
    const pw = req.body.password;
    User.findOne({
        where: {
        username: userName
        }
    }).then(
        function loginSuccess(user) {
            if (user) {
                bcrypt.compare(pw, user.password, function (err, matches){
                    if (matches) {
                    let token = jwt.sign({id: user.id}, "secret", {expiresIn: 60 * 60 * 24 })
                    res.status(200).json({ 
                    user: user,
                    message: "User successfully logged in!",
                    token: token 
                }) ;
            } else {
                res.status(502).json({ message: "password failed" });
                }
            });
        } else {
                res.status(500).json({ message: 'User not found.'})
            } 
        })        
        
    .catch(function (err) {
        res.status(500).json({ error: err });
    });
});

module.exports = router;
