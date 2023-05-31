// ES6 style
import express from "express";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import routes from "./routes.js";
import redis from 'redis';

const app = express();
const port = process.env.PORT;
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

console.log(`Redis Host is ${redisHost}:${redisPort}`);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.redirect("/swagger");
});

// Create a redis client and ensure connection
const redisClient = redis.createClient({
    url: `redis://${redisHost}:${redisPort}`,
});

redisClient
    .on('connect', () => {
        console.info('Redis connected!');
    })
    .on('ready', () => {
        console.info('Redis ready to use!');
    })
    .on('end', () => {
        console.info('Redis disconnected!');
    })
    .on('error', (err) => {
        redisClient.quit();
        console.error('Redis not available!');
        process.exit(1);
    });

await redisClient.connect();

// Set up the routes
routes(app, redisClient);

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