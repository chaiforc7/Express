const express = require("express");
const app = express();
const exhbs = require("express-handlebars");
let quotes = require("./quotes");
const bodyParser = require("body-parser");

app.engine("handlebars", exhbs());
app.set("view engine", "handlebars");

// when you are using a fetch api or just ajax you need to add the line below for it to work
app.use(bodyParser.json());
// assuming you are sending from a form you need to add the line below for it work.
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/api/quotes", (req, res) =>
  res.render("home", {
    Title: "Todo List",
    data: quotes,
  })
);


app.post("/api/quotes", (req, res) => {
  const newquote = {
    id: parseInt(req.body.id),
    Task: req.body.Task,
    Content: req.body.Content,
    status: "active",
    link: `/del/${req.body.id}`,
  };
 
    if (quotes.some((quote) => {return quote.id == newquote.id})) {
      quotes.forEach((quote, i) => {
        if(quote.id==newquote.id){
        quote.Task = req.body.Task ? req.body.Task : quote.Task;
        quote.Content = req.body.Content ? req.body.Content : quote.Content;
        }
      })
    }
  else{
      console.log('rat')
      quotes.push(newquote);
    }
    res.redirect("/api/quotes");
  })
     


// });
//prod.liveshare.vsengsaas.visualstudio.com/join?8C1EDF7363658C3EE06A9ACB993940E52925


app.get("/del/:id", (req, res) => {
  const found = quotes.some((quote) => quote.id == parseInt(req.params.id));

  if (!found) {
    return res
      .status(400)
      .json({ Msg: `Quote with id ${req.params.id} not found` });
  } else {
    quotes = quotes.filter((quote) => quote.id !== parseInt(req.params.id));
  }
  res.redirect("/api/quotes");
});

app.put("/api/quotes/:id", (req, res) => {
  const found = quotes.some((quote) => quote.id === parseInt(req.params.id));
  if (!found) {
    return res
      .status(400)
      .json({ Msg: `Quote with id ${req.params.id} not found` });
  } else {
    const upquote = req.body;
    quotes.forEach((quote) => {
      if (quote.id === parseInt(req.params.id)) {
        quote.Task = newquote.Task ? newquote.Task : req.body.Task;
        quote.Content = newquote.Content ? newquote.Content : req.body.Content;

        res.json({ Msg: "Member newdated", quote });
      }
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server connected at port ${PORT}`);
});
