const addCategory = (req, db, callback) => {
  const NewCategory = req.body.NewCategory;
  const UID = req.body.UID;
  const col = db.collection("Categories");
  col.insertOne(req.body).then((res) => {
    console.log(res);
    callback(res);
  });
};

//! add sub category in mongo..
const addSubCategory = (req, db, callback) => {
  const col = db.collection("SubCategories");
  //get the category ID
  col.insertOne(req.body).then((res) => {
    callback(res);
  });
  //insert the subcategory
};

const getSubCategory = (req, db, callback) => {
  // get the category name
  const cat = req.params.category;
  console.log(cat);
  const col = db.collection("SubCategories");
  col
    .find({ Cat: cat })
    .toArray()
    .then((result) => {
      console.log(result);
      callback(result);
    });
  // return the subbcategoories of specific category
};

//! GET ALL THE CATEGORIES...
const getAllCategories = (db, callback) => {
  const col = db.collection("Categories");
  col
    .find()
    .toArray()
    .then((result) => {
      console.log(result);
      callback(result);
    });
};

module.exports = {
  addCategory,
  getAllCategories,
  addSubCategory,
  getSubCategory,
};
