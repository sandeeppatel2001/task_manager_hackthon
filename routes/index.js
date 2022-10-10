var express = require("express");
var router = express.Router();
const path = require("path");
const app = express();
var User = require("../models/user");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/n1");
var db = mongoose.connection;
// const ll = bodyParser.urlencoded({ extended: true });
// app.use(ll);
app.use(express.static(path.join(__dirname, "../views")));
console.log(path.join(__dirname, "../views"));
const hbs = require("hbs");
const { join } = require("path");
const temppath = path.join(__dirname, "../views");
const partpath = path.join(__dirname, "../partials");

app.set("view engine", "hbs");
app.set("views", temppath);
hbs.registerPartials(partpath);
router.get("/", function (req, res, next) {
  return res.render("index.ejs");
});

const people = [
  { name: "Name", dept: "Department", stat: "Status", b: 1, c: "bg-green-200" },
];
let san = function () {
  db.collection("collection-A")
    .find()
    .toArray((err, req) => {
      if (err) throw err;
      req.forEach((value) => {
        var name = value.name;
        var email = value.email;
        var pass = value.password;
        var phone = value.phone;
        var department = value.department;
        var data2 = {
          name: name,
          dept: department,
          stat: "break",
        };
        people.push(data2);
      });
    });
};
router.post("/", function (req, res, next) {
  console.log(req.body);
  var personInfo = req.body;

  if (
    !personInfo.email ||
    !personInfo.username ||
    !personInfo.password ||
    !personInfo.passwordConf
  ) {
    res.send();
  } else {
    if (personInfo.password == personInfo.passwordConf) {
      User.findOne({ email: personInfo.email }, function (err, data) {
        if (!data) {
          var c;
          User.findOne({}, function (err, data) {
            if (data) {
              console.log("if");
              c = data.unique_id + 1;
            } else {
              c = 1;
            }

            var newPerson = new User({
              email: personInfo.email,
              username: personInfo.username,
              password: personInfo.password,
            });

            newPerson.save(function (err, Person) {
              if (err) console.log(err);
              else console.log("Success");
            });
          })
            .sort({ _id: -1 })
            .limit(1);
          res.send({ Success: "You are regestered,You can login now." });
        } else {
          res.send({ Success: "Email is already used." });
        }
      });
    } else {
      res.send({ Success: "password is not matched" });
    }
  }
});

router.get("/login", function (req, res, next) {
  return res.render("login.ejs");
});

router.post("/login", function (req, res, next) {
  //console.log(req.body);

  User.findOne({ email: req.body.email }, function (err, data) {
    if (data) {
      if (data.password == req.body.password) {
        //console.log("Done Login");
        req.session.userId = data.unique_id;
        // console.log(llllll);
        // router.render("admin.hbs", {
        //   people: people,
        // });
        //console.log(req.session.userId);
        res.send({ Success: "Success!" });
      } else {
        res.send({ Success: "Wrong password!" });
      }
    } else {
      res.send({ Success: "This Email Is not regestered!" });
    }
  });
});
router.get("/admin/add", (req, res) => {
  res.render("addemp.hbs");
});

// 	let joindate = res.body.res.render("admin.hbs");
router.post("/admin/add", function (req, res, next) {
  //console.log(req.body);

  var name = req.body.Name;
  console.log(name);
  var email = req.body.Email;
  var pass = req.body.Password;
  var phone = req.body.Phone;
  var department = req.body.Department;
  var data = {
    name: name,
    email: email,
    password: pass,
    phone: phone,
    department: department,
  };
  //   newPerson.save(function (err, Person) {
  //     if (err) console.log(err);
  //     else console.log("Success");
  //   });
  db.collection("collection-A").insertOne(data, function (err, collection) {
    if (err) throw err;
    console.log("Record inserted Successfully");
  });

  san();

  return res.render("admin.hbs", { people: people });
});
//   if (4) {
//     var newPerson = new User({
//       unique_id: c,
//       email: personInfo.email,
//       username: personInfo.username,
//       password: personInfo.password,
//       passwordConf: personInfo.passwordConf,
//     });
//     newPerson.save(function (err, Person) {
//       if (err) console.log(err);
//       else console.log("Success");
//     });
//   }
// });
router.get("/profile", function (req, res, next) {
  console.log("profile");
  User.findOne({ unique_id: req.session.userId }, function (err, data) {
    console.log("data");
    console.log(data);
    if (!data) {
      res.redirect("/");
    } else {
      people.splice(1, people.length);
      let san = function () {
        db.collection("collection-A")
          .find()
          .toArray((err, req) => {
            if (err) throw err;
            req.forEach((value) => {
              var name = value.name;
              var email = value.email;
              var pass = value.password;
              var phone = value.phone;
              var department = value.department;
              var data2 = {
                name: name,
                dept: department,
                stat: "break",
              };
              people.push(data2);
            });
          });
      };
      san();
      //console.log("found");
      return res.render("admin.hbs", {
        people: people,
      });
    }
  });
});
router.get("/profile", function (req, res, next) {
  console.log("profile");
  User.findOne({ unique_id: req.session.userId }, function (err, data) {
    console.log("data");
    console.log(data);
    if (!data) {
      res.redirect("/");
    } else {
      //console.log("found");
      return res.render("admin.hbs", () => {});
    }
  });
});

router.get("/logout", function (req, res, next) {
  console.log("logout");
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
});

router.get("/forgetpass", function (req, res, next) {
  res.render("forget.ejs");
});

router.post("/forgetpass", function (req, res, next) {
  //console.log('req.body');
  //console.log(req.body);
  User.findOne({ email: req.body.email }, function (err, data) {
    console.log(data);
    if (!data) {
      res.send({ Success: "This Email Is not regestered!" });
    } else {
      // res.send({"Success":"Success!"});
      if (req.body.password == req.body.passwordConf) {
        data.password = req.body.password;
        data.passwordConf = req.body.passwordConf;

        data.save(function (err, Person) {
          if (err) console.log(err);
          else console.log("Success");
          res.send({ Success: "Password changed!" });
        });
      } else {
        res.send({
          Success: "Password does not matched! Both Password should be same.",
        });
      }
    }
  });
});

module.exports = router;
