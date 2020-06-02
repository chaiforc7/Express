// sql post
// const newquote = {
//   id: parseInt(req.body.id),
//   Task: req.body.Task,
//   Content: req.body.Content,
//   status: "active",
//   link: `/del/${req.body.id}`,
// };

// MysqlConnection.query(
//   `INSERT INTO quotes(id, Task, Content, link) VALUES (${newquote.id}, '${newquote.Task}', '${newquote.Content}','${newquote.link}')`,
//   (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.redirect("/");
//     }
//   }
// );

//sql get
  // router.get("/", (req, res) =>
  //   MysqlConnection.query("SELECT * FROM quotes", (err, rows, field) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.render("home", {
  //         Title: "Todo List",
  //         data: rows,
  //       });
  //     }
  //   })
  // );


  //sql delete
// MysqlConnection.query(
  //   `DELETE FROM quotes WHERE id = ${req.params.id}`,
  //   (err, result) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.redirect("/");
  //     }
  //   }
  // );

// FOR REFERENCE PURPOSE ONLY

// / const express = require("express");
// const app = express();
// const Router = express.Router();
// let quotes = require("../quotes");
// const bodyParser = require("body-parser");

// app.use(bodyParser.urlencoded({ extended: false }));

// Router.get("/", (req, res) =>
//   res.render("home", {
//     Title: "Todo List",
//     data: quotes,
//   })
// );

// //POST AND UPDATE METHOD
// Router.post("/", (req, res) => {
//   const newquote = {
//     id: parseInt(req.body.id),
//     Task: req.body.Task,
//     Content: req.body.Content,
//     status: "active",
//     link: `/del/${req.body.id}`,
//   };

//   if (
//     quotes.some((quote) => {
//       return quote.id == newquote.id;
//     })
//   ) {
//     quotes.forEach((quote, i) => {
//       if (quote.id == newquote.id) {
//         quote.Task = req.body.Task ? req.body.Task : quote.Task;
//         quote.Content = req.body.Content ? req.body.Content : quote.Content;
//       }
//     });
//   } else {
//     quotes.push(newquote);
//   }
//   res.redirect("/api/quotes");
// });

// //DELETE METHOD
// Router.get("/del/:id", (req, res) => {
//   const found = quotes.some((quote) => quote.id == parseInt(req.params.id));

//   if (!found) {
//     return res
//       .status(400)
//       .json({ Msg: `Quote with id ${req.params.id} not found` });
//   } else {
//     quotes = quotes.filter((quote) => quote.id !== parseInt(req.params.id));
//   }
//   res.redirect("/api/quotes");
// });