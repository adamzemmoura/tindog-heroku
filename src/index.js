const express = require('express')
const app = express()
const admin = require('firebase-admin')
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tindog-6dca7.firebaseio.com"
});

const db = admin.firestore()

const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/dogs/random', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  
    db.collection('dogs')
      .get()
      .then( (snapshot) => {
        var dogs = []
        snapshot.forEach((doc) => {
          dogs.push(doc.data())
        });
        res.json(dogs);
      })
      .catch((err) => {
        console.log('Error getting documents', err);
        res.status(500).json({ error: 'Error getting documents' });
      });
  
  });

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
