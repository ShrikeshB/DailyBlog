const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");
const delFiles = (path) => {
  if (fs.existsSync(path)) {
    console.log("exists");
    fs.unlink(path, (er) => {
      if (!er) {
        console.log("media deleted");
        console.log(path);
      }
    });
  } else {
    console.log("dont exist- " + path);
  }
};
//! get All the posts from mongo..
const getAllPost = (db, req, cb) => {
  const col = db.collection("Posts");
  col
    .find()
    .toArray()
    .then((data) => {
      console.log(data);
      cb(data);
    });
};

//! get single post via ID..
const getSinglePost = (db, req, cb) => {
  const col = db.collection("Posts");
  const { PID } = req.params;
  col
    .find({ _id: new ObjectId(PID) })
    .toArray()
    .then((data) => {
      cb(data);
    });
};

//! get the post
const deletePost = (db, req, callback) => {
  const col = db.collection("Posts");
  // get the post id
  const postId = req.params.postId;
  console.log(postId);
  // delete the post via id
  col.deleteOne({ _id: new ObjectId(postId) });
};

const editPost = async (db, req, callback) => {
  const col = db.collection("Posts");
  // get the post id
  const postId = req.params.postId;
  let data1 = null;
  await col
    .find({ _id: new ObjectId(postId) })
    .toArray()
    .then((data) => {
      data1 = data;
    });

  const Title = req.body.Title;
  const SubTitle = req.body.SubTitle;
  const Description = req.body.Description;
  const Category = req.body.Category;
  const SubCategory = req.body.SubCategory;
  const Tags = req.body.Tags;
  var coverPage = null;

  try {
    coverPage = req.file.filename;
  } catch (e) {
    coverPage = null;
  }

  if (coverPage != null) {
    delFiles(
      "D:/WebD-journey/React/BlogDaily/server/uploads/Images/" +
        data1[0].CoverPage
    );
  }

  const data = {
    CoverPage: coverPage != null ? coverPage : data1[0].CoverPage,
    Title: Title != "null" ? Title : data1[0].Title,
    SubTitle: SubTitle != "null" ? SubTitle : data1[0].SubTitle,
    Description: Description != "null" ? Description : data1[0].Description,
    Category: Category != "null" ? Category : data1[0].Category,
    SubCategory: SubCategory != "null" ? SubCategory : data1[0].SubCategory,
    Tags: Tags != "null" ? Tags : data1[0].Tags,
    TimeStamp : data1[0].TimeStamp
  };
  console.log(data);

  //* update the data here..
  const result = await col.replaceOne({ _id: new ObjectId(postId) }, data);
  callback(result.modifiedCount)
};

module.exports = { getAllPost, getSinglePost, deletePost, editPost };
