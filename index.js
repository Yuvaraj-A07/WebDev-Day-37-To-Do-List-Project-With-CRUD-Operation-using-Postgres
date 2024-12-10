import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "yuvaraj@2004",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];



app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items ORDER BY id");
  items = result.rows;
  console.log(items);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  const result = await db.query("INSERT INTO items (title) VALUES ($1) RETURNING *;", [item]);
  console.log(result.rows);
  items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;
  const update = await db.query("UPDATE items SET title = ($1) WHERE id = ($2) RETURNING *;", [title, id]);
  console.log(update.rows);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  const remove = await db.query("DELETE FROM items WHERE id = ($1) RETURNING *;", [id]);
  console.log(remove.rows);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
