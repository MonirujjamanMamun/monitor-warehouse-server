const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
// const axios = require('axios');

// middleware 
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jom4k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("monitor-warehouse").collection("products");

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray(cursor)
            res.send(products);
        })
        app.get('/sixproducts', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query);
            const products = await cursor.limit(6).toArray();
            res.send(products)
        })
        app.get('/inventoris/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const products = await productCollection.findOne(query);
            res.send(products);
        })

        app.put('/inventoris/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(req.params)
            const updateQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateProduct = {
                $set: {
                   ...updateQuantity
                }
            }
            const products = await productCollection.updateOne(filter, updateProduct, options)
            res.send(products)
        }) 
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello world')
});

app.listen(port, () => {
    console.log(`example port is runing. ${port}`)
})