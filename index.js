const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rd118yc.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const productsCollection = client.db('productsDB').collection('products');

        // Data read
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // Data create
        app.post('/products', async (req, res) => {
            const newProducts = req.body;
            const result = await productsCollection.insertOne(newProducts);
            res.send(result);
        })

        // Data delete
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId (id) }
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })

        // Read single data using id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId (id) }
            const result = await productsCollection.findOne(query);
            res.send(result);
        })

        // Update single data using id
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedProducts = req.body;

            const products = {
                $set: {
                    name: updatedProducts.name,
                    brand: updatedProducts.brand,
                    type: updatedProducts.type,
                    price: updatedProducts.price,
                    description: updatedProducts.description,
                    rating: updatedProducts.rating,
                    image: updatedProducts.image
                }
            }

            const result = await productsCollection.updateOne(filter, products, options);
            res.send(result);
        })

         // Cart data read
         app.get('/carts', async (req, res) => {
            const cursor = cartsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        const cartsCollection = client.db('cartsDB').collection('carts');

        // Cart data create
        app.post('/carts', async (req, res) => {
            const newCarts = req.body;
            console.log(newCarts);
            const result = await cartsCollection.insertOne(newCarts);
            console.log(result);
            res.send(result);
        })

         // Cart data delete
         app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id:  id }
            const result = await cartsCollection.deleteOne(query);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run( ).catch(console.dir);



app.get('/', (req, res) => {
    res.send('SERVER IS RUNNING');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});