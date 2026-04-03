const express = require("express");
const path = require("node:path");
require("@dotenvx/dotenvx").config();
const indexRouter = require("./routes/indexRouter");
const editRouter = require("./routes/editRouter");
const newRouter = require("./routes/newRouter");
const app = express();
const PORT = process.env.PORT || 3000;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/edit", editRouter);
app.use("/new", newRouter);

app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`Live on port ${PORT}`);
});