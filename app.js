const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require("path");
const app = express();
const session = require('express-session');
const axios = require("axios");
const PORT = 3000;
const url = 'mongodb://127.0.0.1:27017';
//const dbName = 'grievance_management';
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  session({
    secret: 'your-secret-key', // Change this to a secure secret key
    resave: false,
    saveUninitialized: true,
  })
);

const authenticateAdmin = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    return next();
  } else {
    res.status(403).send('Access forbidden');
  }
};
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
    res.json(grievances);

    // HTML to display grievances in a list
    // let grievanceListHTML = '<ul>';
    // grievances.forEach(grievance => {
    //   grievanceListHTML += `<li>Name: ${grievance.name}, Description: ${grievance.description}, Department: ${grievance.department}</li>`;
    // });
    // grievanceListHTML += '</ul>';

    console.log("success");
  } catch (error) {
    console.log(error);
    res.status(500).send(`<p>Error: ${error.message}</p>`);
  } finally {
    client.close();
  }
});

app.get("/login", (req, res)=>{
res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  // Placeholder authentication logic (replace with your actual authentication logic)
  if (username === 'admin' && password === 'adminpassword' && role === 'admin') {
      const response = await axios.get("http://localhost:3000/getGrievances");
      const grievances = response.data;
      res.render('list_griveances', { grievances });
  } else if (username === 'student' && password === 'studentpassword' && role === 'student') {
    res.json({ message: 'Student login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout successful' });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
