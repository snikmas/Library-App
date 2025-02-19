// * =========
// IMPORTS
// ========= *
import express, { response } from 'express'
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

app.set('view engine', 'ejs')
app.use(express.json());

// * =========
// SERVER AND API
// ========= *
function createServer(books){

  // middleware
  app.use(express.urlencoded({extended: true}))
  app.use(express.static('public'));
  
    
  // ======== ROUTE MIDDLERS
  //read data
  app.get('/', async (req, res) => {
    try{
    const bookList = await books.find().toArray();
    console.log(bookList)

    // render ejs
    res.render('index.ejs', {bookInfo: bookList})
  } catch (err) {
    console.log(`Error retrieving list of books ${err}`);
  };
})
  
  // client sends data to the server
  // and the browser waits a response from it 
app.post('/addBook', async (request, response) => {
    try {
      const result = await books.insertOne({
        title: request.body.title,
        author:request.body.author,
        read: false
      });

      console.log(result);
      response.redirect('/');
    } catch(err) {
      console.error(`Could not add book: ${err}`);
     };
 });


 // TASK: DELETE BY USING ID
 app.delete('/deleteBook', async(req, res) => {
  try{
    const result = await books.deleteOne({
      title: req.body.title});
      res.json("Book deleted successfully");
    } catch(err) {
      console.error(`failed to delete book: ${err}`)
    };
  });
   
  app.listen(PORT, () => console.log("server is running"))
}

app.put('/markRead', async(req, res) => {
  await markBook(req, res, true, books)    
});

app.put('/markUnread', async(req, res) => {
  await markBook(req, res, false, books)
})

 
async function markBook(req, res, isRead) {
  try{
    const result = await books.updateOne({
      title: req.body.title
    }, {
      $set: {
        read: isRead
      }
    });
    res.json(`Marked ${isRead ? 'Read' : 'Unread'}`)
  } catch(err){
    console.log(`Failed to mark book`);
  }
  
};

// * =========
// CONNECT TO DB
// ========= *
async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(uri);
    console.log("Connected to db")
    
    const db = client.db('library')
    const books = db.collection('bookData')
    
    return {books};
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
    const { books } = await connectToDatabase();
    createServer(books);
  } catch(err) {
    console.error(`Failed to start your app: ${err}`)
  };
};


// RUN
main()
