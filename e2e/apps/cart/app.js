// ES6 style
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import routes from "./routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5075;

app.use(cors());
// app.use(bodyParser.json()); // To support JSON-encoded bodies
app.use(express.json());
app.use(express.urlencoded());
// app.use(
//     bodyParser.urlencoded({
//         // To support URL-encoded bodies
//         extended: true,
//     })
// );

app.get("/", (req, res) => {
    res.redirect("/swagger");
});

// Set up the routes
routes(app);

const options = {
    failOnErrors: true,
    definition: {
        swagger: "2.0",
        info: {
            title: "Packt Store Cart API",
            version: "1.0",
            description: "The Pack Store Shopping Cart API",
        },
    },
    apis: ["./routes*.js"],
};

const specs = swaggerJsDoc(options);
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(specs));

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});