import compression from "compression";
import cors from "cors";
import express from "express";
import httpContext from "express-http-context";
import helmet from "helmet";
import "reflect-metadata";
import requestIp from "request-ip";
import { errorLogger, requestLogger } from "./infrastructure/logging/http-logger.ts";
import { ErrorMiddleware } from "./presentation/http/middlewares/error.middleware.ts";
import { globalLimiter } from "./presentation/http/middlewares/rate-limiters/global.limiter.ts";
import { RequestMiddleware } from "./presentation/http/middlewares/request.middleware.ts";
import { router } from "./presentation/http/routes/router.route.ts";
import { CompressionUtil } from "./presentation/http/utils/compression.util.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const requestHandler = new RequestMiddleware();
const errorHandler = new ErrorMiddleware();

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.set("query parser", "extended");
app.use(cors({ credentials: true, origin: true }));
app.use(helmet());
app.use(requestIp.mw());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression({ threshold: 0, filter: CompressionUtil.customCompressionFilter }));
app.use(requestLogger);
app.use(httpContext.middleware);
app.use(globalLimiter);
app.use(requestHandler.handle.bind(requestHandler));
app.use(router);
app.use(errorHandler.handle.bind(errorHandler));
app.use(errorLogger);

export { app };
