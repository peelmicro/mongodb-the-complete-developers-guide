const Router = require('express').Router;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require('../db');

const router = Router();

const createToken = () => {
  return jwt.sign({}, 'secret', { expiresIn: '1h' });
};

router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  // Check if user login is valid
  db.getDb()
  .db()
  .collection("users")
  .findOne({email: email})
  .then(userDoc => {
    console.log(userDoc)
    return bcrypt.compare(pw, userDoc.password)
  })
  .then(result => {
    if (!result) {
      throw Error();       
    } 
    const token = createToken();
    res.json({ message: 'Authentication succedded.', token: token });
  })
  .catch(err => {
    console.log(err);
    res.status(401).json({ message: 'An error ocurred.' });  
  });   

});

router.post('/signup', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  // Hash password before storing it in database => Encryption at Rest
  bcrypt
    .hash(pw, 12)
    .then(hashedPW => {
      // Store hashedPW in database
      db.getDb()
      .db()
      .collection("users").insertOne({
        email: email,
        password: hashedPW
      })
      .then(result => {
        console.log(result);
        const token = createToken();
        res.json({ token: token, user: { email: email } });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'An error ocurred.' });  
      });      
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Creating the user failed.' });
    });
});

module.exports = router;
