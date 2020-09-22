const express = require("express");
const app = express();
const Post = require("./api/models/posts");
const path = require('path');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${getExt(file.mimetype)}`)
    }
  })
   
const getExt = (mimeType) => {
    switch(mimeType){
        case "image/png":
            return ".png";
        case "image/jpeg":
            return ".jpeg";
    }
}

  var upload = multer({ storage: storage });
// var upload = multer({ dest: 'uploads' });

const postsData = new Post();

app.use(express.json());

app.use((req, res, next) =>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
})


app.use('/uploads', express.static('uploads'));
// const posts = [{
//     "id": "1581461442206",
//     "title": "This is a New Blog Post",
//     "content": "This is the content! ",
//     "post_image": "uploads/post-image-1581461442199.jpg",
//     "added_date": "1581461442206"
// }]

app.get("/api/posts", (req, res) => {
    res.status(200).send(postsData.get())
});

app.get("/api/posts/:post_id", (req, res) => {
    const postId = req.params.post_id;
    const foundPost = postsData.getIndividualBlog(postId);
    if(foundPost) {
        res.status(200).send(foundPost);
    } else {
        res.status(404).send("Not Found");
    }
});

app.post("/api/posts", upload.single("post-image"), (req, res)=>{
    // console.log(req.body);
    // console.log(req.file.path);
    const path1 = req.file.path;
    const path2 = path1.replace("\\", "/", 1);
    const newPost = {
        "id": `${Date.now()}`,
        "title": req.body.title,
        "content": req.body.content,
        "post_image": path2,
        "added_date": `${Date.now()}`
    }
    postsData.add(newPost);
    // res.status(200).send(newPost);
    res.status(201).send(newPost);   
})

app.listen(3000, () => 
console.log("Listening on port 3000"));