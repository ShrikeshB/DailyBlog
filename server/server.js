const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const multer = require("multer");
const {
  getAllPost,
  getSinglePost,
  deletePost,
  editPost,
} = require("./Functionality/Posts");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const client = new MongoClient("mongodb://localhost:27017");
// mongoose.connect("mongodb://localhost:27017/MyDBTest");

client
  .connect()
  .then(() => console.log("Connected Successfully"))
  .catch((error) => console.log("Failed to connect", error));
const db = client.db("BlogDaily");

let newPathNews = null;
const NewsIMgConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(file);
    callback(null, "./uploads/Images");
  },
  filename: (req, file, callback) => {
    newPathNews = `${Date.now()}.${file.originalname}`;
    callback(null, `${Date.now()}.${file.originalname}`);
  },
});

const uploadNews = multer({
  storage: NewsIMgConfig,
});

//! =================== new post ===========================
app.post("/NewPost", uploadNews.single("coverpage"), (req, res) => {
  const Title = req.body.Title;
  const SubTitle = req.body.SubTitle;
  const Description = req.body.Description;
  const Category = req.body.Category;
  const SubCategory = req.body.SubCategory;
  const TimeStamp = req.body.timeStamp;
  const Tags = req.body.Tags;
  const coverPage = req.file.filename;
  console.log(coverPage);
  console.log(req.file.filename);
  const col = db.collection("Posts");
  const data = {
    CoverPage: coverPage,
    Title: Title,
    SubTitle: SubTitle,
    Description: Description,
    Category: Category,
    SubCategory: SubCategory,
    Tags: Tags,
    TimeStamp: TimeStamp,
  };
  col.insertOne(data);
  res.send(Title);
});

//! ================== new category =================
const {
  addCategory,
  getAllCategories,
  addSubCategory,
  getSubCategory,
} = require("./Functionality/Categories");

//! ============= ADD NEW CATEGORY =============
app.post("/newCategory", (req, res) => {
  addCategory(req, db, (result) => {
    res.send(result);
  });
});

//! ============== GET ALL CATEGORIES ============
app.get("/getAllCategory", (req, res) => {
  getAllCategories(db, (result) => {
    res.send(result);
  });
});

//! ============= ADD NEW SUB CATEGORY =============
app.post("/newSubCategory", (req, res) => {
  addSubCategory(req, db, (result) => {
    res.send(result);
  });
});

//! ============ GET SUB CAT VIA CAT NAME ============
app.get("/getSubCategory/:category", (req, res) => {
  getSubCategory(req, db, (result) => {
    res.send(result);
  });
});

//! ======== GET ALL THE POSTS ==========
app.get("/getAllPost", (req, res) => {
  getAllPost(db, req, (data) => {
    res.send(data);
  });
});

//! ========== GET SINGLE POST ============
app.get("/getSinglePost/:PID", (req, res) => {
  getSinglePost(db, req, (data) => {
    console.log(data);
    res.send(data);
  });
});

//! =============== DELETE POST VIA POST ID =========
app.post("/deletePost/:postId", (req, res) => {
  deletePost(db, req, (result) => {
    console.log(result);
    res.send(result);
  });
});


const NewsIMgConfig1 = multer.diskStorage({
  destination: (req, file, callback) => {
    // console.log(file);
    callback(null, "./uploads/Images");
  },
  filename: (req, file, callback) => {
    newPathNews = `${Date.now()}.${file.originalname}`;
    callback(null, `${Date.now()}.${file.originalname}`);
  },
});

const uploadNews1 = multer({
  storage: NewsIMgConfig1,
});

//! =============== EDIT THE POST ============
app.post("/editPost/:postId", uploadNews1.single("coverpage"), (req, res) => {
  editPost(db, req, (result) => {
    console.log(result);
    res.send(result)
  });
});

app.use("/uploads/Images", express.static("./uploads/Images"));

app.listen(3002, () => {
  console.log("running 3002");
});
