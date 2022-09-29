const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
//since we are going to work with server

/////////////////////////////////
//--------------File--------------
/////////////

// //in order to read file and do such sorts of things we use node modules
// //all kinds of additional functionalities are stored in this modules
// //for reading file there is ****fs****** modules
// //So to use this modules we require them in our code

//*****Blocking way*************/
// // const hello = 'Hello World';
// // console.log(hello);
// //To run the file in terminal we need to run 'node index.js'

// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// // console.log(textIn);

// const textOut = `This is the text about the avocado: ${textIn}.\n Created on ${Date.now()}`;

// fs.writeFileSync('./txt/output.txt',textOut);
// console.log('Text written');

//*****Non-Blocking way*************/
// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         console.log(data2);
//         fs.readFile('./txt/append.txt','utf-8',(err,data3)=>{
//             console.log(data3);
//             fs.writeFile('./txt/final.txt',`${data2} \n ${data3}`,'utf-8',err=>{
//                 console.log('Your file has been written');
//             });
//         })
//     })
// });

// console.log('File is in process...');

/////////////////////////////////
//--------------Server

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

//////////////
//1.Create  a Server
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //gives an url object that have many key values pair where the whole url is in seggregated form
  //now we need to activate route based on pathname and activate the product section based on the id so we need query
  // so destructing the url object

  //OVERVIEW
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    // console.log(output);
    res.end(output);

    //PRODUCT
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    res.writeHead(200, { "content-type": "text/html" });
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
    });
    res.end("<h1>Page not found</h1>");
  }
});

//2.Start Server
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on the port 8000");
});
