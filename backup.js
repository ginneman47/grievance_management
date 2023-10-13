const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect('mongodb://localhost:27017/grievance_management', {
  useNewUrlParser: true
});

const grievanceSchema = new mongoose.Schema({
  name: String,
  description: String,
  department: String
});


const grievance = mongoose.model("grievance", grievanceSchema);


const grievance1 = new grievance({
  name: "student1",
  description:"default",
  department:"default_dept"
});

grievance1.save();

app.get('/', async (req, res) => {
  // try {
  //   const grievances = await Grievance.find();
  //   res.json(grievances);
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }
});

app.post('/', async (req, res) => {
  // const { title, description, createdBy } = req.body;
  //
  // try {
  //   const newGrievance = new Grievance({ title, description, createdBy });
  //   await newGrievance.save();
  //   res.status(201).json(newGrievance);
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



//
const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('test_db_autocomplete');
    const movies = database.collection('item');

    // Query for a movie that has the title 'Back to the Future'
    const query = { text: 'Idea1',link:null };
    const movie = await movies.findOne(query);

    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
//
