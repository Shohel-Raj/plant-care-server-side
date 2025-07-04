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
    const blogDataCollection = database.collection('blogData')
    const questionsCollection = database.collection('questions');


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

    app.get('/latestPlant', async (req, res) => {

      const result = await userColletion.aggregate([
        {
          $sort: { _id: -1 },
        }, { $limit: 8 }
      ]).toArray()

      res.send(result)
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



    //-------------------- blog data -------------------


    app.get('/blogs', async (req, res) => {

      const result = await blogDataCollection.find().toArray();
      res.send(result)
    })

    app.get('/blogsHome', async (req, res) => {

      const result = await blogDataCollection.find().limit(8).toArray();
      res.send(result)
    })

    app.get('/blog/:id', async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) }

      const result = await blogDataCollection.findOne(quary);

      res.send(result)
    })



    // ---------------- questions --------------

    app.get('/questions', async (req, res) => {
      const result = await questionsCollection.find().sort({ createdAt: -1 }).toArray();
      res.send(result);
    });


    app.post('/questions', async (req, res) => {
      const question = {
        ...req.body,
        createdAt: new Date(),
        answers: [],
      };
      const result = await questionsCollection.insertOne(question);
      res.send(result);
    });

    app.post('/questions/:id/answer', async (req, res) => {
      const questionId = req.params.id;
      const answer = { ...req.body, createdAt: new Date() };

      const result = await questionsCollection.updateOne(
        { _id: new ObjectId(questionId) },
        { $push: { answers: answer } }
      );
      res.send(result);
    });



    app.get('/stats', async (req, res) => {
      try {
        const { email } = req.query;

        const filter = email ? { userEmail: email } : {};

        const totalPlants = await userColletion.countDocuments(filter);
        const totalQuestions = await questionsCollection.countDocuments(filter);
        const totalBlogs = await blogDataCollection.countDocuments(filter);

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const newPlants = await userColletion.countDocuments({
          ...filter,
          createdAt: { $gte: oneWeekAgo },
        });

        const newQuestions = await questionsCollection.countDocuments({
          ...filter,
          createdAt: { $gte: oneWeekAgo },
        });

        const newBlogs = await blogDataCollection.countDocuments({
          ...filter,
          createdAt: { $gte: oneWeekAgo },
        });

        const calcGrowth = (newCount, totalCount) => {
          if (totalCount === 0) return "0%";
          return ((newCount / totalCount) * 100).toFixed(1) + "%";
        };

        res.json({
          plants: totalPlants,
          questions: totalQuestions,
          blogs: totalBlogs,
          growth: {
            plants: calcGrowth(newPlants, totalPlants),
            questions: calcGrowth(newQuestions, totalQuestions),
            blogs: calcGrowth(newBlogs, totalBlogs),
          },
        });
      } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Could not fetch user stats' });
      }
    });



    app.get('/category-count', async (req, res) => {
      try {
        const result = await userColletion.aggregate([
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 0,
              category: '$_id',
              count: 1
            }
          }
        ]).toArray();

        res.send(result);
      } catch (err) {
        console.error('Error fetching category count:', err);
        res.status(500).json({ error: 'Failed to fetch category count' });
      }
    });
    app.get('/blog-category-count', async (req, res) => {
      try {
        const result = await blogDataCollection.aggregate([
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 0,
              category: '$_id',
              count: 1
            }
          }
        ]).toArray();

        res.send(result);
      } catch (err) {
        console.error('Error fetching blog category count:', err);
        res.status(500).json({ error: 'Failed to fetch blog category count' });
      }
    });

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