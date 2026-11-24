import { Router, type Request, type Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { ApiResponse } from "../responses/api-response.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const router = Router();

router.get(["/", "/api/health-check"], (req: Request, res: Response): void => {
  const apiResponse = new ApiResponse();
  const response = apiResponse.setCode(StatusCodes.OK).setDescription(getReasonPhrase(StatusCodes.OK)).response();
  res.status(StatusCodes.OK).json(response);
});

export { router as healthRouter };
