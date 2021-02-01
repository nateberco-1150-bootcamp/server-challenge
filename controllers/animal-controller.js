var express = require('express');
var router = express.Router();
var sequelize = require('../db');
const animal = require('../models/animal');
var Animal = sequelize.import('../models/animal');
let validateSession = require('../middleware/validate-session');

module.exports = router;

router.post('/create', validateSession, (req, res) => {
    const animalData = {
        name: req.body.name,
        legNumber: req.body.legNumber,
        predator: req.body.predator,
        userId: req.user.id
    }
    Animal.create(animalData)
        .then(animal => res.status(200).json({
            animal: animal,
            message: "Animal Created"
        }))
    .catch(err => res.status(500).json({ error: err, message: "There has been an error!"}))
});

router.get("/", validateSession, (req, res) => {
    Animal.findAll({
        where: {
            userId: req.user.id
        }
    })
    .then(animals => res.status(200).json(animals))
    .catch(err => res.status(500).json({ error: err }))
});

router.delete("/:id", validateSession, function (req, res) {
    Animal.destroy({
        where: {
            id: req.params.id,
            userId: req.user.id 
        }
    })
    .then(
        deleteSuccess = recordsChanged => {
            res.status(200).json({ message: `${recordsChanged} record(s) changes.` });
        },

        deleteFail = err => {
            res.status(500).json({ message: 'Failed to delete', error: err })
        }
    )
})

router.put('/update/:id', validateSession, function (req, res) {
    Animal.update(req.body, {
        where: {
            id: req.params.id,
            // * new
            userId: req.user.id
        }
    })
        .then(animal => res.status(200).json(animal))
        .catch(err => res.status(500).json({ error: err }))
})

module.exports = router;




/*
CHALLENGE DAY 2

BRONZE CHALLENGE:
    Make a new '/create' endpoint in the animal-controller file.  It should save all the data from the animal model to the database, including # of legs, boolean predator value, and its name.
    If the animal is correctly saved in the database, inform the user. Otherwise, alert the user if there's an error.
    Make another '/' endpoint that will return all the animals created in the database. Like the others, send appropriate statuses based on if the request succeeds or not.

    When testing in postman you must use the request

    { "name": "alligator", "legNumber": 4, "predator": true}

SILVER CHALLENGE: 
    Complete the bronze challenge, then make a new '/delete' endpoint that will delete an animal from the database.   However you complete this challenge, a request must be able to specify which animal needs to be deleted.  If the delete was successful, inform the user, otherwise alert the user to an error.

 GOLD CHALLENGE:
    Complete the silver challenge, but make a new '/update' endpoint that will let a request update animal data in the database.  
    Like with the silver challenge, the request must be able to specify which animal needs to be updated.  
    On success, inform the user, on failure, alert appropriately. 
    Postman Body should look like the following.
    { "name": "alligator", "legNumber": 4, "predator": true}
*/

//DAY 3

/*BRONZE CHALLENGE:
Implement a validate-session.js. 
Use the validateSession to protect every route in the animal-controller.js.
They should block any request that does not have an authorization header that bears a token.
This token should be one returned from the login or sign up methods.
*/

/*SILVER CHALLENGE:
  Add a new column named 'userId' to the animal model. This column should take integers, and rows in this column should not be null. Reset your database.
 
 Modify the '/create' endpoint to save the user from the request's id into the userId column.
 
 Make sure you sign up a new user and add your authorization header before you test.
 */

 /*
 Taking advantage of the new userId column that links the row of the animal table to the user that posted it from the Silver level challenge, modify the delete endpoint to only allow users to delete only their own animals from the database.
You will need to use an options object similar to one used in the Sequelize update() method.
 
 Similarly, modify the get to return only animals the requesting user has posted.
 */

 /*  GOLD CHALLENGE:
  Taking advantage of the new userId column that links the row of the animal table to the user that posted it from the Silver level challenge, modify the delete endpoint to only allow users to delete only their own animals from the database. You will need to use an options object similar to one used in the Sequelize update() method.

  Similarly, modify the get to return only animals the requesting user has posted.
*/

