const express = require("express");
const app = express();
const path = require("path");

const { Pool } = require("pg");

const url_bancoDeDados =
  "postgresql://aulaweb_owner:DG4dehLYQka3@ep-yellow-smoke-a5rug8y3.us-east-2.aws.neon.tech/aulaweb?sslmode=require";

const conexao = new Pool({
  connectionString: url_bancoDeDados,
  ssl: {
    rejectUnauthorized: true,
  },
});

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.engine("html", require("ejs").renderFile);

app.use(express.static(path.join(__dirname, "paginas")));

app.get("/", async function (req, res) {
  try {
    const id = 1;
    var cliente = await conexao.connect();

    const pessoaResul = await conexao.query(
      "select * from pessoa Where id = $1",
      [id]
    );

    const pessoa = pessoaResul.rows[0];

    const conhecimentoResult = await conexao.query(
      "SELECT * FROM conhecimento where pessoa_id = $1",
      [id]
    );

    const conhecimentos = conhecimentoResult.rows;

    res.render(__dirname + "/paginas/principal.html", {
      pessoa,
      conhecimentos,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.listen(3000, function () {
  console.log("Rodando na porta 3000");
});
