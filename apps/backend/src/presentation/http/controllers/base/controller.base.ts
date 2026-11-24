import { ApiResponse } from "../../responses/api-response.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export abstract class Controller {
  apiResponse(): ApiResponse {
    return new ApiResponse();
  }
}
