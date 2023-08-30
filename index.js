const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = 3000;

const app = express();


//middleware

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API Working')
});



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ljxdfal.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const database = client.db('Management');
        const productsCollection = database.collection('Products');

        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            if (req.query.name) {
                const search = req.query.name;
                const result = products.filter(product => product.name.toLocaleLowerCase().includes(search));
                res.send(result);
            } else {
                res.send(products);
            }
        });

        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);




app.listen(port, (req, res) => {
    console.log(`started port ${port}`);
})