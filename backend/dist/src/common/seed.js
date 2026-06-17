"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bycypt_hashed_module_1 = require("./bycypt-hashed/bycypt-hashed.module");
const prisma_module_1 = require("../prisma/prisma.module");
const prisma_service_1 = require("../prisma/prisma.service");
const seed_service_1 = require("./seed.service");
let SeedRunnerModule = class SeedRunnerModule {
};
SeedRunnerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            bycypt_hashed_module_1.BycyptHashedModule,
        ],
        providers: [seed_service_1.SeedService],
    })
], SeedRunnerModule);
async function bootstrap() {
    process.env.SKIP_AUTO_SEED = 'true';
    const app = await core_1.NestFactory.createApplicationContext(SeedRunnerModule);
    try {
        const seedService = app.get(seed_service_1.SeedService);
        await seedService.seedDemoData({ force: true });
    }
    finally {
        await app.get(prisma_service_1.PrismaService).$disconnect();
        await app.close();
    }
}
bootstrap().catch((error) => {
    console.error('[seed] Failed to seed demo data:', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map