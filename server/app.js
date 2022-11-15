import Express      from "express";
import BodyParser   from "body-parser";
import Session      from "express-session";
import MemoryStore  from "memorystore";
import Path         from "path";

/* Routes */
import UserRoutes from "../server/routes/user.routes";

const App = Express();
const memoryStore = MemoryStore(Session);

App.use(Session({
    secret: "session_secret",
    store: new memoryStore({ checkPeriod: 9999999 }),
    resave: true,
    name: "wall-assignment",
    saveUninitialized: true,
    cookie: {
        domain: "localhost",
        expires: new Date( Date.now() + 60 * 60 * 1000 * 24 ),
        secure: false,
        httpOnly: true,
        maxAge: 36000000
    }
}));

App.use(BodyParser.json({ limit: "50mb" }));
App.use(BodyParser.urlencoded({ limit: "50mb", extends: true }));
App.set("views", Path.join(__dirname, "..", "views"));
App.use("/assets", Express.static(Path.join(__dirname, "..", "assets")));
App.set("view engine", "ejs");

App.use("/", UserRoutes);

App.listen(8000, () => {
    console.log(`App listening to port ${ 8000 }`);
});