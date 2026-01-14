const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const path = require("path");
const app = express();
let sql;
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use('/images', express.static(path.join(__dirname, 'assets')));
app.use(express.json());

function logger(req, res, next) {
    console.log("Hei! Dette er skrevet av logger :D  --- " + req.method + " " + req.url);
    next();
}
app.use(logger);

// root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// tilkobling til database :D
const db = new sqlite3.Database("./ryddeapp.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});

app.post("/completeTask", (req, res) => {
    const { id, username } = req.body;
    const currentTime = new Date().toLocaleString();
    console.log(currentTime);

    db.prepare("UPDATE task SET completed = ?, completerUser = ? WHERE id = ?").run(currentTime, username, id);
    console.log("hei, jeg heter /completeTask og jeg fikk", currentTime, id, username);
    return res.sendStatus(200);
})

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
  sql = "SELECT * FROM task ORDER BY completed";
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

app.get("/getLeaderboard", (req, res) => {
    const sql = `
      SELECT completerUser, SUM(difficulty) as score
      FROM task
      WHERE completerUser IS NOT NULL AND completerUser != ''
      GROUP BY completerUser
      ORDER BY score DESC
    `;
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "kunne ikke hente noe data fra leaderboardet :(" });
        return;
      }
      res.json(rows);
    });
  });

app.post("/login", (req, res) => {
    let username = req.body.username;
    var password = req.body.password;
    res.sendFile(path.join(__dirname, "public", "index.html"));
/*
    if (!username || !password) {
        return res.status(400).send("du mangler visst username eller password")
    }

    const user = data.getUser(username)
    if (!user) {
        return res.redirect("/login.html?error=invalid");
    }

    var ok = bcrypt.compareSync(password, user.passwordHash);
    if (!ok) {
        return res.redirect("/login.html?error=invalid")
    }

    req.session.user = { id= user.id, username: user.username, role: user.role };

    if (user.role === "admin") {
        console.log("oisann, du var admin, det er kult! nesten like kult som ord på nett!");
        return res.redirect("/admin.html");
    } else {
        console.log("du var ikke en kul admin...")
        return res.redirect("/index.html");
    }
*/
})

// server listener på port 1488 (http://localhost:1488)
const port = "1488";
app.listen(port);
console.log("yo, jeg kjører på http://localhost:" + port);