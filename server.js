const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const path = require("path");
const app = express();
let sql;
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use('/images', express.static(path.join(__dirname, 'assets')));
app.use(express.json());

// root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// tilkobling til database :D
const db = new sqlite3.Database("./ryddeApp", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});

// legg til oppgave
app.post("/addTask", (req, res) => {
  let { taskName, creatorName, taskDescription } = req.body;
  taskName = taskName.tostring().trim();
  creatorName = creatorName.tostring().trim();
  taskDescription = taskDescription.tostring().trim();

  console.log("Forbereder SQL query for /addTask :)");

  db.prepare(
    "INSERT INTO task (name, creatorname, description) VALUES (?, ?, ?)",
  ).run(taskName, creatorName, taskDescription);

  return res.sendStatus(201);
});

// hent oppgaver
app.get("/getTasks", (req, res) => {
  sql = "SELECT * FROM task";
  db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
    res.json(rows);
  });
});

// slett oppgave
app.delete("/deleteTask", (req, res) => {
  try {
    console.log(req.body);
    const { id } = req.body;
    db.prepare("DELETE FROM task WHERE id = ?").run(id);
    return res.sendStatus(200);
  } catch (err) {
    console.log("feil ved sletting av melding:", err);
    return res.status(500).json({ error: "kunne ikke slette melding" });
  }
});

// server listener på port 6767 (http://localhost:6767)
const port = "1488";
app.listen(1488);
console.log("yo, jeg kjører på http://localhost:" + port);
