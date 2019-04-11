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
            <div class="mh7 tc ba mb4 pa3">From <u>local</u> directory:
                <form class="pa3" action='/image' method="POST" enctype="multipart/form-data">
                    
                    <input style='cursor: pointer;' type='file' name='funny-image'></input>
                    <input type='text' name='title' placeholder='Title'></input>
                    <input type='text' name='desc' placeholder='Description'></input>
                    <br/>
                    <button style='cursor: pointer;' class="mt2" type='submit'>Upload</button>
                    
                </form>
            </div>
            <div class="mh7 tc ba mb4 pa3">or from <u>Internet</u> URLs:
                <form class="pa3" action='/url' method="POST" enctype="multipart/form-data">
                    1) <input class='w-third' type='text' name='path1' placeholder='Enter URL here'></input>
                    <input type='text' name='title1' placeholder='Title'></input>
                    <input type='text' name='desc1' placeholder='Description'></input>
                    <br/>
                    2) <input class='w-third' type='text' name='path2' placeholder='Enter URL here'></input>
                    <input type='text' name='title2' placeholder='Title'></input>
                    <input type='text' name='desc2' placeholder='Description'></input>
                    <br/>
                    3) <input class='w-third' type='text' name='path3' placeholder='Enter URL here'></input>
                    <input type='text' name='title3' placeholder='Title'></input>
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
  posts.push({
    path: req.body.path1,
    title: req.body.title1,
    desc: req.body.desc1
  });

  posts.push({
    path: req.body.path2,
    title: req.body.title2,
    desc: req.body.desc2
  });

  posts.push({
    path: req.body.path3,
    title: req.body.title3,
    desc: req.body.desc3
  });

  res.send(makePage());
});

app.post("/image", upload.single("funny-image"), (req, res) => {
  //
  if (req.file === undefined) return;

  //Create var for file in the body
  let file = req.file;
  //Get the extension of the file
  let ext = file.originalname.split(".").pop();
  //Create a new filename for the stored uploads
  let newFileName = `${file.filename}.${ext}`;
  //Rename file path
  fs.renameSync(file.path, `${__dirname}/uploads/${newFileName}`);
  //Create path for user to access file
  let frontendPath = `/images/${newFileName}`;
  //Push the path+title object to the array of posts

  posts.push({
    path: frontendPath,
    title: req.body.title,
    desc: req.body.desc
  });

  //Reload the page
  res.send(makePage());
});

app.get("/clear", (req, res) => {
  posts = [];
  res.send(makePage());
});

//Listen for HTTP requests at
app.listen(4000);
