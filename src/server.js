const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const moment = require("moment");
const userDetails = require("./UserDetails.js");
const http = require("http");
const config = require("./config.js");

const app = express();

config.readQueryConfig();

setTimeout((function fun_StartServer() {
  //console.log(config.g_QueryList.lineWisePieQry, config.g_QueryList.lineWiseQry);
  const port = process.env.PORT || config.g_QueryList.portNumber;
  app.listen(port, () => console.log(`Listening on port ${port}`));
}), 100);


// const port = process.env.PORT || 5025;

app.use(express.static(path.join(__dirname + "/build")));

app.all("*", function (req, res, next) {
  if (!req.get("Origin")) return next();

  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET,POST");
  res.set("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");

  next();
});

app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

app.post("/api/checkUserDetails", (req, res) => {
  let userDet = req.body;
  userDetails.GetUserDetails(userDet.userName)
    .then((result) => {
      // console.log(result);
      // console.log(userDet.pwd, userDet.pwd);
      if (result.length > 0) {
        if (result[0].PASSWORD === userDet.pwd) {
          result.map((item) => {
            delete item.PASSWORD
          })
          res.send(JSON.stringify({ result: "success", prodUnit: result }));
        } else {
          console.log("Username or password incorrect...")
          res.send(JSON.stringify({ result: "failed" }));
        }
      } else {
        console.log("Username or password incorrect...")
        res.send(JSON.stringify({ result: "failed" }));
      }
    })
    .catch((e) => {
      console.log("api/checkUserDetails: " + e.message);
      res.send(JSON.stringify({ result: "failed" }));
    });
});

app.get("/api/getProdUnitDetails/:userName/:value", async (req, res) => {
  try {
    let result = await userDetails.GetProdUnitDetails(req.params.userName, req.params.value);
    if (result.length > 0) {
      res.send(JSON.stringify({ result: "success", prodUnit: result }));
    } else {
      res.send(JSON.stringify({ result: "failed" }));
    }
  } catch (e) {
    res.send(JSON.stringify({ result: "failed" }));
  }
});

app.get("/api/getLineProdStatus/:prodUnit", async (req, res) => {
  try {
    let result = await userDetails.GetLineProdStatus(req.params.prodUnit);
    if (result.prodStatus.length > 0) {
      res.send(JSON.stringify({ result: "success", prodStatus: result.prodStatus, dayStatus: result.dayStatus }));
    } else {
      res.send(JSON.stringify({ result: "failed" }));
    }
  } catch (e) {
    res.send(JSON.stringify({ result: "failed" }));
  }
});

app.get("/api/getOrderSummaryStatus/:iono/:combo/:style", async (req, res) => {
  let iono = req.params.iono.replace(/,/g, "/");
  try {
    let result = await userDetails.getOrderSummaryStatus(iono, req.params.combo, req.params.style);
    if (result.orderStatus.length > 0) {
      res.send(JSON.stringify({ result: "success", orderStatus: result.orderStatus }));
    } else {
      res.send(JSON.stringify({ result: "failed" }));
    }
  } catch (e) {
    console.log("getOrderSummaryStatus: ", e.message);
    res.send(JSON.stringify({ result: "failed" }));
  }
});

app.get("/api/getFloorDetails", async(req, res)=>{
  try{
    userDetails.getFloorDetails().then(result=>{
     console.log(result);
     res.send(JSON.stringify({ result: "sucesss", floor: result }));
    }).catch((e)=>{
     console.log(e.message);
     res.send(JSON.stringify({ result: "failed" }));
    })
  } catch(e){
    console.log("getFloorDetails Error : ", e.message);
    res.send(JSON.stringify({result : "failed"}));
  }
})

// app.listen(port, () => console.log(`Listening on port ${port}`));