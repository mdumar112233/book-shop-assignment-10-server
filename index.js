const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser  = require('body-parser');
const port =process.env.PORT || 5000;
require('dotenv').config()

// databse connection
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ij0ac.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());
app.use(bodyParser.json());

console.log(process.env.DB_USER);


app.get('/', (req, res) => {
  res.send('Hello World!')
})


client.connect(err => {
    console.log('databse connection error', err);
  const productCollection = client.db("bookshop").collection("products");
  const ordersCollection = client.db("bookshop").collection("orders");
  
  app.post('/addBook', (req, res) => {
    const book = req.body;
    productCollection.insertOne(book)
    .then(result => {
      console.log(result);
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/products', (req, res) => {
    productCollection.find({})
    .toArray((err, documents) => {
      console.log(documents);
      res.send(documents)
    })
  })

  app.get('/checkOutProduct/:id', (req, res) => {
    productCollection.find({_id: ObjectID(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

});


app.listen(port)