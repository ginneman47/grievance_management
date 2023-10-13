const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require("path");
const app = express();
const PORT = 3000;
const url = 'mongodb://127.0.0.1:27017';
//const dbName = 'grievance_management';
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const client = new MongoClient(url);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.post('/', async (req, res) => {
  var name = req.body.name;
  var description = req.body.description;
  var department = req.body.department;
  console.log(name +" "+description+" "+department);
  try {


    await client.connect();
    console.log(client);
    console.log("client success");
    const db = client.db('grievance_management');
    const collection = db.collection('grievances');

    const grievance = { name, description, department };
    const result = await collection.insertOne(grievance);

    res.status(201).json(result.ops[0]);
    console.log("Successfully addded the grievance");
  } catch (error) {
    console.log("Error while adding the data" +error);
    res.status(500).json({ message: error.message });
  } finally {
    client.close();
  }
});

app.get('/getGrievances', async (req, res) => {
  try {

    await client.connect();

    const db = client.db('grievance_management');
    const collection = db.collection('grievances');

    const grievances = await collection.find({}).toArray();

    // HTML to display grievances in a list
    let grievanceListHTML = '<ul>';
    grievances.forEach(grievance => {
      grievanceListHTML += `<li>Name: ${grievance.name}, Description: ${grievance.description}, Department: ${grievance.department}</li>`;
    });
    grievanceListHTML += '</ul>';

    res.status(200).send(grievanceListHTML);
    console.log("success");
  } catch (error) {
    console.log(error);
    res.status(500).send(`<p>Error: ${error.message}</p>`);
  } finally {
    client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
