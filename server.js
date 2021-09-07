const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const app = require("./app");
// console.log(process.env)
const port = process.env.PORT || 3000;
//connecting to DB
const DB = process.env.DB_URL.replace("<DB_PASSWORD>", process.env.DB_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log(`Connected to DB!`);
  });
console.log(process.env.NODE_ENV);

app.listen(port, () => {
  console.log(`Server is Running on ${port}`);
});
