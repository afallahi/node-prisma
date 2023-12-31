import express, { Request, Response } from 'express';
import logging from './config/logging';
import bodyParser from 'body-parser';
import config from './config/config';
import healthcheckRoutes from './routes/healthcheck';
import userRoutes from './routes/user';
import equipmentRoutes from './routes/equipment';


const NAMESPACE = 'Index';

/** middleware setup */

const app = express();

/** Log the request */
app.use((req, res, next) => {
    /** Log the req */
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        /** Log the res */
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    })

    next();
});

/** Parse the body of the request */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


/** Rules of our API */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');     // NOT for PROD!!!
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    next();
});

/** Routes go here */
app.use('/healthcheck', healthcheckRoutes);
app.use('/users', userRoutes);
app.use('/equipments', equipmentRoutes);



/** Error handling */
app.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});



app.get('/', async (req: Request, res: Response) => {

    res.send(`Server is running on http://localhost:${config.server.port}`);
    //res.send("hello")

});

//app.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));

export default app;