//Import statements
let express = require("express");
let multer = require("multer");
let fs = require("fs");
//Define variables
let app = express();
let upload = multer({
  //Set destination to where images are up
  dest: __dirname + "/uploads/"
});
//Set endpoints for uploads
//Files in local folder uploads have endpoints as /images/x
app.use("/images", express.static("uploads"));
//Array to store path-title objects for uploads
let posts = [];
//Function that returns HTML with posts inserted
let makePage = () => {
  //Turn each post into img element
  let imgArr = posts.map(post => {
    return `
    <div class="tc">
    <p>${post.title}</p>
    <img src="${post.path}"height="100px"/>
    <p>${post.desc}</p>
    </div>
    `;
  });
  //Turn img element array into string separated by line breaks
  let imgStr = imgArr.join("\n");
  //Return HTML string with imgStr inserted
  return `
        <html>
        <head>
            <link rel="stylesheet" href="https://unpkg.com/tachyons@4.10.0/css/tachyons.min.css"/>
        </head>
        <body class='avenir bg-light-gray'>
            <h1 class="tc">Let's upload some images!</h1>
            <div class="mh7 tc ba mb4 pa3">From <u>local</u> directory:<br/>(select up to 3 files)
                <form class="pa3" action='/image' method="POST" enctype="multipart/form-data">
                    
                    <input style='cursor: pointer;' type='file' name='up-images' multiple></input>
                    <br/>
                    <input type='text' name='title1' placeholder='Image 1 Title'></input>
                    <input type='text' name='desc1' placeholder='Description'></input>
                    <br/>
                    <input type='text' name='title2' placeholder='Image 2 Title'></input>
                    <input type='text' name='desc2' placeholder='Description'></input>
                    <br/>
                    <input type='text' name='title3' placeholder='Image 3 Title'></input>
                    <input type='text' name='desc3' placeholder='Description'></input>
                    <br/>
                    <button style='cursor: pointer;' class="mt2" type='submit'>Upload</button>
                    
                </form>
            </div>
            <div class="mh7 tc ba mb4 pa3">or from <u>Internet</u> URLs:
                <form class="pa3" action='/url' method="POST" enctype="multipart/form-data">
                    1) <input class='w-third' type='text' name='path1' placeholder='Enter URL here'></input>
                    <input type='text' name='title1' placeholder='Image 1 Title'></input>
                    <input type='text' name='desc1' placeholder='Description'></input>
                    <br/>
                    2) <input class='w-third' type='text' name='path2' placeholder='Enter URL here'></input>
                    <input type='text' name='title2' placeholder='Image 2 Title'></input>
                    <input type='text' name='desc2' placeholder='Description'></input>
                    <br/>
                    3) <input class='w-third' type='text' name='path3' placeholder='Enter URL here'></input>
                    <input type='text' name='title3' placeholder='Image 3 Title'></input>
                    <input type='text' name='desc3' placeholder='Description'></input>
                    <br/>
                    <button style='cursor: pointer;' class="mt2" type='submit'>Upload</button>
                </form>
            </div>
            <br/>
            <div class="mh7 tc ba mb4 pa3">Uploads: 
                <div class="flex">
                    ${imgStr}
                </div>
            </div>
            <form class="tc" action='/clear' method="GET">
                <button style='cursor: pointer;' type='submit'>Delete all images</button>
            </form>
        </body>
        </html>
        `;
};
//When user sends request to main '/' endpoint
app.get("/", (req, res) => {
  res.send(makePage());
});

app.post("/url", upload.none(), (req, res) => {
  if (req.body.path1 !== "") {
    posts.push({
      path: req.body.path1,
      title: req.body.title1,
      desc: req.body.desc1
    });
  }

  if (req.body.path2 !== "") {
    posts.push({
      path: req.body.path2,
      title: req.body.title2,
      desc: req.body.desc2
    });
  }

  if (req.body.path3 !== "") {
    posts.push({
      path: req.body.path3,
      title: req.body.title3,
      desc: req.body.desc3
    });
  }

  res.send(makePage());
});

app.post("/image", upload.array("up-images", 1), (req, res) => {
  if (req.files[0] !== undefined) {
    //Create var for file1 of request
    let file1 = req.files[0];
    //Get the extension of the file
    let ext1 = file1.originalname.split(".").pop();
    //Create a new filename for the stored uploads
    let newFileName1 = `${file1.filename}.${ext1}`;
    //Rename file path
    fs.renameSync(file1.path, `${__dirname}/uploads/${newFileName1}`);
    //Create path for user to access file
    let frontendPath1 = `/images/${newFileName1}`;
    //Push the path+title object to the array of posts

    posts.push({
      path: frontendPath1,
      title: req.body.title1,
      desc: req.body.desc1
    });
  }

  if (req.files[1] !== undefined) {
    //Create var for file2 of request
    let file2 = req.files[1];
    //Get the extension of the file
    let ext2 = file2.originalname.split(".").pop();
    //Create a new filename for the stored uploads
    let newFileName2 = `${file2.filename}.${ext2}`;
    //Rename file path
    fs.renameSync(file2.path, `${__dirname}/uploads/${newFileName2}`);
    //Create path for user to access file
    let frontendPath2 = `/images/${newFileName2}`;
    //Push the path+title object to the array of posts

    posts.push({
      path: frontendPath2,
      title: req.body.title2,
      desc: req.body.desc2
    });
  }

  if (req.files[2] !== undefined) {
    //Create var for file3 of request
    let file3 = req.files[2];
    //Get the extension of the file
    let ext3 = file3.originalname.split(".").pop();
    //Create a new filename for the stored uploads
    let newFileName3 = `${file3.filename}.${ext3}`;
    //Rename file path
    fs.renameSync(file3.path, `${__dirname}/uploads/${newFileName3}`);
    //Create path for user to access file
    let frontendPath3 = `/images/${newFileName3}`;
    //Push the path+title object to the array of posts

    posts.push({
      path: frontendPath3,
      title: req.body.title3,
      desc: req.body.desc3
    });
  }

  //Reload the page
  res.send(makePage());
});

app.get("/clear", (req, res) => {
  posts = [];
  res.send(makePage());
});

//Listen for HTTP requests at
app.listen(4000);
