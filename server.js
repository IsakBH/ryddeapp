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
const db = new sqlite3.Database("./ryddeapp.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});

// legg til oppgave
app.post("/createTask", (req, res) => {
    const { task_name, task_description, task_creator, task_difficulty } = req.body;

    const sql = "INSERT INTO task (name, description, creatorUser, difficulty) VALUES (?, ?, ?, ?)";

    // hvorfor FANKEN funker dette ikke :( kanskje jeg må legge til ordentlig error handling hahaha
    // senere isak: det var error handling
    db.run(sql, [task_name, task_description, task_creator, task_difficulty], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Could not create task" });
        }
        res.sendStatus(201);
    });
});


// hent oppgaver
app.get("/getTasks", (req, res) => {
  sql = "SELECT * FROM task";
  db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
    res.json(rows);
  });
});

app.get("/getTask", (req, res) => {
    db.get("select * from task where id = ?", [req.query.id], (err, row) => {
        if (err) {
            console.error("tror lowkey det skjedde noe feil for å være helt ærlig", err.message)
            return res.sendStatus(500).json({ error: "kunne ikke hente oppgave, bro :(" });
        }
        if (row) {
            res.json(row);
        }
        else {
            return res.sendStatus(404).json({ error: "bro, det var jo ingenting her?" });
        }
    })

    db.prepare("select * from task where id = ?").run(req.query.id)
    console.log(req.query.id)
})

// slett oppgave
app.delete("/deleteTask", (req, res) => {
  try {
    const { id } = req.body;
    console.log(id)
    db.prepare("DELETE FROM task WHERE id = ?").run(id);
    return res.sendStatus(200);
  } catch (err) {
    console.log("feil ved sletting av oppgave:", err);
    return res.status(500).json({ error: "kunne ikke slette oppgave" });
  }
});

// server listener på port 1488 (http://localhost:1488)
const port = "1488";
app.listen(port);
console.log("yo, jeg kjører på http://localhost:" + port);