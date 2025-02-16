// * =========
// IMPORTS
// ========= *
import express from 'express'
import { MongoClient } from 'mongodb'

// * =========
// VARIABLES
// ========= *
const dirname = import.meta.dirname // get a full path-name
const app = express()
const uri = process.env.MONGODB_URI
const user = process.env.MONGODB_USER
const pwd = process.env.MONGODB_PWD
const PORT = process.env.PORT || 3000;


// * =========
// SERVER AND API
// ========= *
function createServer(books){

  // middleware
  app.use(express.urlencoded({extended: true}))
  
    
  // ======== ROUTE MIDDLERS
  //read data
  app.get('/', (req, res) => {
    // res.send("this is response from the server")
    res.sendFile(dirname + '/index.html')
  })
  
  // client sends data to the server
  // and the browser waits a response from it 
  app.post('/addBook', async (req, res) => {
    try {
      const result = await books.insertOne({
        title: req.body.title,
        author: req.body.author,
        read: false
      }
      );
    console.log(result);
    res.redirect('/')

  } catch(err) {
    console.error(`Could not add book: ${err}`);
  };
})
   
  app.listen(PORT, () => console.log("server is running"))
}

// * =========
// CONNECT TO DB
// ========= *
async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(uri);
    console.log("Connected to db")
    
    const db = client.db('library')
    const books = db.collection('bookData')
    
    return {client, books};
  } catch (err) {
    console.error(err)
  }
}

// * =========
// MAIN FUNCTION TO START APPLICATION
// ========= *
async function main() {
  try {
    // const {client, books} = await connectToDatabase();
    const books = await connectToDatabase();
    createServer(books);
  } catch(err) {
    console.error(`Failed to start your app: ${err}`)
  };
};


// RUN
main()
