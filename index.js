const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.98xvyli.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
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
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const cookedItem = client.db('homeCookedFood').collection('itemCategories');
        const comments = client.db('homeCookedFood').collection('comments');
        const users = client.db('homeCookedFood').collection('user');

        app.get('/users', async (req, res) => {
            const query = {};
            const user = await users.find(query).toArray();
            res.send(user);
            // console.log(user)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await users.insertOne(user);
            res.send(result);
        })

        app.get('/allItem', async (req, res) => {
            const query = {};
            const items = await cookedItem.find(query).toArray();
            res.send(items);
            // console.log(items)
        })

        app.get('/allCatItems', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const dashItems = await cookedItem.find(query).toArray();
            res.send(dashItems);
        })

        app.post('/allItem', async (req, res) => {
            const dish = req.body;
            console.log(dish);
            const result = await cookedItem.insertOne(dish);
            res.send(result);
        })
        app.delete('/allItem/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) };
            const result = await cookedItem.deleteOne(filter);
            res.send(result);
        });


        app.get('/comments', async (req, res) => {
            const query = {};
            const comment = await comments.find(query).toArray();
            res.send(comment);
        })

        app.post('/comments', async (req, res) => {
            const comment = req.body;
            console.log(comment);
            const result = await comments.insertOne(comment);
            res.send(result);
        })

        app.delete('/comments/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) };
            const result = await comments.deleteOne(filter);
            res.send(result);
        });

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
// server connection end


app.get('/', async (req, res) => {
    res.send('Home cooked food server is running');
})

app.listen(port, () => console.log(`server running on ${port}`));