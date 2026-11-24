import { Router, type Request, type Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { ApiResponse } from "../responses/api-response.ts";
import { apiRouter } from "./api.route.ts";
import { healthRouter } from "./health.route.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const router = Router();

router.use(healthRouter);
router.use("/api", apiRouter);
router.all("/*path", (req: Request, res: Response): void => {
  const apiResponse = new ApiResponse();
  const response = apiResponse.setCode(StatusCodes.NOT_FOUND).setDescription(getReasonPhrase(StatusCodes.NOT_FOUND)).response();
  res.status(StatusCodes.NOT_FOUND).json(response);
});

export { router };
