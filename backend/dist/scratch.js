"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const user = await prisma.user.findFirst({
        where: { username: 'Manager KT' },
        include: { role: true, department: true }
    });
    console.log(JSON.stringify(user, null, 2));
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=scratch.js.map