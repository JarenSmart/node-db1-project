const express = require("express");
const db = require("../data/dbConfig");

const router = express.Router();

router.get("/accounts", async (req, res, next) => {
  try {
    //translates to 'SELECT * FROM "accounts";
    const allAccounts = await db.select("*").from("accounts");
    res.json(allAccounts);
  } catch (err) {
    next(err);
  }
});

router.get("/accounts/:id", async (req, res, next) => {
  try {
    // translates to SELECT * FROM "accounts" WHERE "id" = ? LIMIT 1;
    // destructure the variable below "[nameByID]", since we only want the first index of the array.
    const [nameByID] = await db
      .select("*")
      .from("accounts")
      .where("id", req.params.id)
      // The '.limit' allows us to make sure we're only getting a single result, since we're destructuring the array above.
      .limit(1);

    res.json(nameByID);
  } catch (err) {
    next(err);
  }
});

router.post("/accounts", async (req, res, next) => {
  try {
    const payload = {
      // the database will auto generate ID
      name: req.body.name,
      budget: req.body.budget,
    };

    // translates to INSERT INTO "accounts" ("name", "budget") VALUES (?, ?);
    const [addAccountID] = await db.insert(payload).into("accounts");
    const addAccount = await db
      .first("*")
      .from("accounts")
      .where("id", addAccountID);
    //calling ".first()" is doing the same thing as ".limit(1)" and destructuring the result
    res.status(201).json(addAccount);
  } catch (err) {
    next(err);
  }
});

router.put("/accounts/:id", async (req, res, next) => {
  try {
    const payload = {
      // the database will auto generate ID
      name: req.body.name,
      budget: req.body.budget,
    };

    // translates to 'UPDATE "accounts" SET ? = ? WHERE "id" = ?';
    await db("accounts").update(payload).where("id", req.params.id);
    const updateAccount = await db
      .first("*")
      .from("accounts")
      .where("id", req.params.id);
    //calling ".first()" is doing the same thing as ".limit(1)" and destructuring the result
    res.json(updateAccount);
  } catch (err) {
    next(err);
  }
});

router.delete("/accounts/:id", async (req, res, next) => {
  try {
    // translates to 'DELETE FROM "accounts" WHERE "id" = ?;'
    await db("accounts").where("id", req.params.id).del();
    // since we no longer have a resource to return,
    // just send a status 204 which means "success, but no response data is being sent back"
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
