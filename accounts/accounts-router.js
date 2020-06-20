const express = require("express");
const db = require("../data/dbConfig");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    //translates to 'SELECT * FROM "accounts";
    const names = await db.select("*").from("accounts");
    res.json(names);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  //translates to SELECT * FROM "name" WHERE "id" = ?;
  try {
    const nameByID = await db
      .select("*")
      .from("accounts")
      .where("id", req.params.id);
    res.json(nameByID);
  } catch (err) {
    next(err);
  }
});

router.post("/", (req, res, next) => {});

router.put("/", (req, res, next) => {});

router.delete("/", (req, res, next) => {});

module.exports = router;
