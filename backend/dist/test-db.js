"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(__dirname, '.env') });
const dbUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;
async function testConnection(url, name) {
    if (!url) {
        console.error(`❌ ${name} is not defined in .env`);
        return;
    }
    console.log(`\nTesting ${name}...`);
    console.log(`URL: ${url.replace(/:[^:]+@/, ':****@')}`);
    const client = new pg_1.Client({
        connectionString: url,
        connectionTimeoutMillis: 5000,
    });
    try {
        await client.connect();
        const res = await client.query('SELECT NOW()');
        console.log(`✅ ${name} connected successfully!`);
        console.log(`Server time: ${res.rows[0].now}`);
    }
    catch (err) {
        console.error(`❌ ${name} connection failed:`, err.message);
        if (err.message.includes('P1001') || err.message.includes('ECONNREFUSED')) {
            console.error('Hint: Check if the port and host are correct and the DB is accessible.');
        }
    }
    finally {
        await client.end();
    }
}
async function runTests() {
    console.log('--- Database Connection Test ---');
    await testConnection(dbUrl, 'DATABASE_URL (Transaction Pooler - Port 6543)');
    await testConnection(directUrl, 'DIRECT_URL (Direct Connection - Port 5432)');
    console.log('\n--- Test Completed ---');
}
runTests();
//# sourceMappingURL=test-db.js.map