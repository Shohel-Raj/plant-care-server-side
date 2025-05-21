const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())


// const uri = "mongodb+srv://msalamgiir:lNDcFOVbunFYpml1@plantscare.lw2w2h7.mongodb.net/?retryWrites=true&w=majority&appName=PlantsCare";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@plantscare.lw2w2h7.mongodb.net/?retryWrites=true&w=majority&appName=PlantsCare`;


app.get('/', (req, res) => {
  res.send('crud server is runing')
})


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
    const database = client.db('PlantsDB')
    const userColletion = database.collection('Plants')


    app.post('/addPlant', async (req, res) => {
      const newPlant = req.body
      const result = await userColletion.insertOne(newPlant);
      res.send(result)
    })



    app.get('/plant', async (req, res) => {
      const { emailParams } = req.query;
      let quary = {}


      if (emailParams) {
        quary = { userEmail: { $regex: `^${emailParams}$`, } }
      }
      const result = await userColletion.find(quary).toArray();
      res.send(result)
    })


    app.get('/allPlant', async (req, res) => {

      

      const sortOrder = req.query.order === 'desc' ? -1 : 1;

    const result = await userColletion.aggregate([
      {
        $addFields: {
          careLevelWeight: {
            $switch: {
              branches: [
                { case: { $eq: ["$careLevel", "easy"] }, then: 1 },
                { case: { $eq: ["$careLevel", "moderate"] }, then: 2 },
                { case: { $eq: ["$careLevel", "difficult"] }, then: 3 }
              ],
              default: 4
            }
          }
        }
      },
      {
        $sort: {
          careLevelWeight: sortOrder
        }
      },
      {
        $project: {
          careLevelWeight: 0
        }
      }
    ]).toArray();

    res.send(result);


    })





    app.get('/plant/:id', async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) }

      const result = await userColletion.findOne(quary);

      res.send(result)
    })




    app.put('/plant/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const UpdatePlant = req.body;

      const updateDoc = {
        $set: UpdatePlant
      }
      const result = await userColletion.updateOne(filter, updateDoc);

      res.send(result)

    });


    app.delete('/plant/:id', async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };

      const result = await userColletion.deleteOne(quary)


      res.send(result)


    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);



app.listen(port, () => {
  console.log('server runing on port ', port);
})