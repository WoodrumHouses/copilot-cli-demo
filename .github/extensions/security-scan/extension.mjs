import { execFile } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { joinSession } from "@github/copilot-sdk/extension";

const session = await joinSession({
    hooks: {
        onSessionStart: async () => {
            await session.log("🔒 Security scan tools loaded");
        },
    },
    tools: [
        {
            name: "scan_sql_injections",
            description:
                "Scans JavaScript source files for potential SQL injection vulnerabilities by detecting string concatenation or template literals inside SQL query strings. Returns a list of findings with file path, line number, and the offending code.",
            parameters: {
                type: "object",
                properties: {
                    directory: {
                        type: "string",
                        description:
                            "The directory to scan (relative to project root). Defaults to 'src' if not specified.",
                    },
                },
            },
            handler: async (args) => {
                const cwd = process.cwd();
                const scanDir = join(cwd, args.directory || "src");
                const findings = [];

                function scanFile(filePath) {
                    const content = readFileSync(filePath, "utf-8");
                    const lines = content.split("\n");
                    lines.forEach((line, index) => {
                        // Detect string concatenation in SQL-like patterns
                        if (
                            /\b(SELECT|INSERT|UPDATE|DELETE|WHERE|FROM)\b/i.test(line) &&
                            (/\$\{/.test(line) || /['"`]\s*\+\s*/.test(line))
                        ) {
                            findings.push({
                                file: relative(cwd, filePath),
                                line: index + 1,
                                severity: "CRITICAL",
                                code: line.trim(),
                                issue: "Possible SQL injection — user input concatenated into query string",
                                fix: "Use parameterized queries with ? placeholders instead",
                            });
                        }
                    });
                }

                function walkDir(dir) {
                    try {
                        const entries = readdirSync(dir);
                        for (const entry of entries) {
                            if (entry === "node_modules" || entry === ".git") continue;
                            const fullPath = join(dir, entry);
                            const stat = statSync(fullPath);
                            if (stat.isDirectory()) walkDir(fullPath);
                            else if (entry.endsWith(".js")) scanFile(fullPath);
                        }
                    } catch {
                        // skip inaccessible directories
                    }
                }

                walkDir(scanDir);

                if (findings.length === 0) {
                    return "✅ No SQL injection patterns detected.";
                }
                return JSON.stringify(
                    {
                        total: findings.length,
                        findings,
                    },
                    null,
                    2,
                );
            },
        },
        {
            name: "check_route_middleware",
            description:
                "Checks route files to verify they import and apply validation and authentication middleware. Reports which routes are missing middleware protection.",
            parameters: {
                type: "object",
                properties: {
                    routesDir: {
                        type: "string",
                        description:
                            "Path to the routes directory relative to project root. Defaults to 'src/routes'.",
                    },
                },
            },
            handler: async (args) => {
                const cwd = process.cwd();
                const routesDir = join(cwd, args.routesDir || "src/routes");
                const report = [];

                try {
                    const files = readdirSync(routesDir).filter((f) => f.endsWith(".js"));
                    for (const file of files) {
                        const filePath = join(routesDir, file);
                        const content = readFileSync(filePath, "utf-8");

                        const hasValidation = /require\(.*validate.*\)|import.*validate/i.test(content);
                        const hasAuth = /require\(.*auth.*\)|import.*auth/i.test(content);
                        const postRoutes = (content.match(/router\.(post|put|patch)\(/g) || []).length;
                        const getRoutes = (content.match(/router\.get\(/g) || []).length;

                        report.push({
                            file: relative(cwd, filePath),
                            validation: hasValidation ? "✅ imported" : "⚠️  NOT imported",
                            authentication: hasAuth ? "✅ imported" : "⚠️  NOT imported",
                            mutatingRoutes: postRoutes,
                            readRoutes: getRoutes,
                            recommendation: !hasValidation && postRoutes > 0
                                ? "NEEDS ATTENTION: Has mutating routes but no validation middleware"
                                : "OK",
                        });
                    }
                } catch (err) {
                    return `Error scanning routes: ${err.message}`;
                }

                return JSON.stringify(report, null, 2);
            },
        },
        {
            name: "run_tests_summary",
            description:
                "Runs the project test suite and returns a structured summary with pass/fail counts, failing test names, and overall status.",
            parameters: {
                type: "object",
                properties: {
                    testFile: {
                        type: "string",
                        description:
                            "Optional specific test file to run (e.g., 'tests/tasks.test.js'). Runs all tests if omitted.",
                    },
                },
            },
            handler: async (args) => {
                const cwd = process.cwd();
                const testArgs = ["test", "--", "--verbose", "--no-color"];
                if (args.testFile) testArgs.push(args.testFile);

                return new Promise((resolve) => {
                    execFile("npm", testArgs, { cwd, timeout: 30000 }, (err, stdout, stderr) => {
                        const output = stdout + stderr;

                        const passMatch = output.match(/Tests:\s+(\d+)\s+passed/);
                        const failMatch = output.match(/Tests:\s+(\d+)\s+failed/);
                        const totalMatch = output.match(/Tests:\s+.*?(\d+)\s+total/);

                        const passed = passMatch ? parseInt(passMatch[1]) : 0;
                        const failed = failMatch ? parseInt(failMatch[1]) : 0;
                        const total = totalMatch ? parseInt(totalMatch[1]) : passed + failed;

                        const failingTests = [];
                        const failRegex = /✕\s+(.+)/g;
                        let match;
                        while ((match = failRegex.exec(output)) !== null) {
                            failingTests.push(match[1].trim());
                        }

                        resolve(
                            JSON.stringify(
                                {
                                    status: failed > 0 ? "FAILING" : "PASSING",
                                    passed,
                                    failed,
                                    total,
                                    failingTests: failingTests.length > 0 ? failingTests : undefined,
                                },
                                null,
                                2,
                            ),
                        );
                    });
                });
            },
        },
    ],
});
