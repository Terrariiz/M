/*eslint no-console: ["error", { allow: ["warn", "error", "info", "log"] }] */
const express     = require("express");
const bodyparser  = require("body-parser");
const fileupload  = require("express-fileupload");
const cors        = require("cors");
const bearertoken = require("express-bearer-token");
const path        = require("path");
const mkdirp      = require("mkdirp");
//const ejs         = require("ejs");
//const axois       = require("axios");

const server = express();
//const client = express();

const server_port = process.env.PORT || 5000;
// const client_port = process.env.PORT || 80; // or 443 for https

/* ------------------------ Initialize directories ------------------------*/

mkdirp(path.join(__dirname, "assets/files"), (err) => {
    if(err) console.error(`Error occur when creating necessary directories(Error: ${err})`);
    //else console.info(`${path.join(__dirname, "assets/files")} directory created.`);
});
mkdirp(path.join(__dirname, "assets/logs"), (err) => {
    if(err) console.error(`Error occur when creating necessary directories(Error: ${err})`);
    //else console.info(`${path.join(__dirname, "assets/logs")} directory created.`);
});
mkdirp(path.join(__dirname, "assets/tmp"), (err) => {
    if(err) console.error(`Error occur when creating necessary directories(Error: ${err})`);
    //else console.info(`${path.join(__dirname, "assets/tmp")} directory created.`);
});
mkdirp(path.join(__dirname, "assets/pics"), (err) => {
    if(err) console.error(`Error occur when creating necessary directories(Error: ${err})`);
    //else console.info(`${path.join(__dirname, "assets/pics")} directory created.`);
});

/* ------------------------ SERVER CONFIGURATION ------------------------*/

// Routes import
const search     = require("./routes/search");
const users      = require("./routes/users");
const staffs     = require("./routes/staffs");
const documents  = require("./routes/documents");
const keywords   = require("./routes/keywords");
const lecturer   = require("./routes/lecturer");
const curriculum = require("./routes/curriculum");
const course     = require("./routes/course");

// Middleware
server.use(bodyparser.urlencoded({ limit: '10mb', extended: true}));
server.use(bodyparser.json({ limit: '10mb', extended: true}));
server.use(bearertoken());
server.use(cors());
server.use(
    fileupload({
        limits: { fileSize: 10 * 1024 * 1024 /* 10MB */ },
        abortOnLimit: true,
        limitHandler: (res) => {
            return res.json({ status: "File size limit has been reached."});
        },
        useTempFiles: true,
        tempFileDir: __dirname + "/assets/tmp/",
        // debug: true
    })
);

// Routes
server.use("/staffs", staffs);
server.use("/document", documents);
server.use("/keyword", keywords)
server.use("/lecturer", lecturer);
server.use("/curriculum", curriculum);
server.use("/course", course);
server.use("/users", users);
server.use("/search", search);
server.use(
    "/docs",
    express.static(path.join(__dirname, "/assets/files"))
);
server.use(
    "/pics",
    express.static(path.join(__dirname, "/assets/pics"))
);

// return 405 for other routes
server.get("*", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.sendStatus(405);
});


/* ------------------------ CLIENT CONFIGURATION ------------------------*/
// Middleware
// client.use(bodyparser.urlencoded({ limit: '10mb', extended: true}));
// client.use(bodyparser.json({ limit: '10mb', extended: true}));
// client.use(bearertoken());
// client.use(cors());
// client.use(
//     fileupload({
//         limits: { fileSize: 10 * 1024 * 1024 /* 10MB */ },
//         abortOnLimit: true,
//         limitHandler: (res) => {
//             return res.json({ status: "File size limit has been reached."});
//         },
//         useTempFiles: true,
//         tempFileDir: __dirname + "/assets/tmp/"
//     })
// );
// // Routes import
// const defaultClient = require("../client/routes/index");
// const User_path     = require("../client/routes/user");

// //ejs
// client.set('view engine','ejs');
// client.set('views', path.join(__dirname, '../client/views'))
// client.use(express.static(path.join(__dirname, '../client/public')))

// // Routes
// client.use("/", defaultClient);
// client.use("/user", User_path)

// return 404 for other routes
// client.get("*", (req, res) => {
//     res.setHeader("Content-Type", "text/html");
//     res.sendStatus(404);
// });

/* ------------------------ RUN SERVER & CLIENT ------------------------- */

server.listen(server_port, () => console.info(`Server started on port : ${server_port}`));
// client.listen(client_port, () => console.info(`Client started on port : ${client_port}`));
