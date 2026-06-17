"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const response_envelope_interceptor_1 = require("./common/interceptors/response-envelope.interceptor");
const system_log_interceptor_1 = require("./common/interceptors/system-log.interceptor");
const prisma_service_1 = require("./prisma/prisma.service");
const realtime_service_1 = require("./realtime/realtime.service");
function parseCorsOrigins(value) {
    return (value || 'http://localhost:5173')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'), {
        prefix: '/',
    });
    const configService = app.get(config_1.ConfigService);
    const reflector = app.get(core_1.Reflector);
    app.enableCors({
        origin: parseCorsOrigins(configService.get('CORS_ORIGIN')),
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Timesheet Pro API')
        .setDescription('API contract for attendance, timesheet, leave, HR, notification, warning and payroll workflows.')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        jsonDocumentUrl: 'api/docs-json',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const httpServer = app
        .getHttpAdapter()
        .getInstance();
    httpServer.set('trust proxy', true);
    const prismaService = app.get(prisma_service_1.PrismaService);
    const realtimeService = app.get(realtime_service_1.RealtimeService);
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(reflector), new response_envelope_interceptor_1.ResponseEnvelopeInterceptor(), new system_log_interceptor_1.SystemLogInterceptor(prismaService, realtimeService));
    const port = configService.get('PORT') || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Swagger docs at http://localhost:${port}/api/docs`);
    console.log(`OpenAPI JSON at http://localhost:${port}/api/docs-json`);
}
void bootstrap();
//# sourceMappingURL=main.js.map