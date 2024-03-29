import {
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Response, Request } from "express";

@Catch()
export class GlobalExceptionHandler extends BaseExceptionFilter {

    catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const req: Request = ctx.getRequest();
        const res: Response = ctx.getResponse();

        let message: string | string[] = exception.message;
        const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        if (httpStatus === 400) {
            const ValidationRes = exception.getResponse() as {
                message: string[],
                error: string,
                statusCode: number
            };
            message = ValidationRes.message;
        };

        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: req.url,
            message
        };

        res.status(httpStatus).json(responseBody);
    };
}