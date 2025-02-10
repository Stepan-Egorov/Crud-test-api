const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
});

const db = admin.firestore();

// Get all people
app.get("/people", async (req, res) => {
  try {
    const snapshot = await db.collection("people").get();
    const people = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(people);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Add a person
app.post("/people", async (req, res) => {
  try {
    const { firstName, lastName, age } = req.body;
    const docRef = await db.collection("people").add({ firstName, lastName, age });
    res.json({ id: docRef.id, firstName, lastName, age });
  } catch (error) {
    res.status(500).json({ error: "Error adding data" });
  }
});

// Update a person
app.put("/people/:id", async (req, res) => {
  try {
    const { firstName, lastName, age } = req.body;
    await db.collection("people").doc(req.params.id).update({ firstName, lastName, age });
    res.json({ message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating data" });
  }
});

// Delete a person
app.delete("/people/:id", async (req, res) => {
  try {
    await db.collection("people").doc(req.params.id).delete();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));