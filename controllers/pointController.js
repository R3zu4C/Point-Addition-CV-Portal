const fs = require("fs");
const {
  addPointToDatabase,
  addRequestToDatabase,
  addPointNotifsToDatabase,
} = require("./helpers/pointHelper");

module.exports = {
  addPoint: async (req, res) => {
    try {
      const point = await addPointToDatabase(req.body);
      await addRequestToDatabase(point);
      await addPointNotifsToDatabase(point);
      res.send({ redirect: "/" });
    } catch (error) {
      console.error("Error:" + error.message);
      res.status(400).send("Error in inserting new record");
    }
  },

  uploadProof: async (req, res) => {
    const fileName = req.headers["file-name"];
    const user_id = req.headers["user_id"];
    const dir = `./uploads/${user_id}`;

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    req.on("data", (chunk) => fs.appendFileSync(`${dir}/${fileName}`, chunk));

    res.end("Proof uploaded!");
  },
};
