const fs = require("fs");
const path = require("path");

/**
 * CSR-Admin 文档自动生成脚本
 * 配合DeepWiki使用，自动提取API信息并生成文档
 */

const config = {
  projectRoot: path.resolve(__dirname, ".."),
  apiDocsPath: "API_DOCS.md",
  sourceDir: "src",
  outputDir: "docs/generated",
};

// 扫描代码中的API调用
function extractApiCalls(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const apiCalls = [];

  // 匹配 fetch 或 axios 调用
  const fetchRegex =
    /(?:fetch|axios\.(?:get|post|put|delete))\s*\(\s*['"``]([^'"``]+)['"``]/g;
  let match;

  while ((match = fetchRegex.exec(content)) !== null) {
    const url = match[1];
    if (url.startsWith("/api/") || url.includes("api")) {
      apiCalls.push({
        url: url,
        file: path.relative(config.projectRoot, filePath),
        line: content.substring(0, match.index).split("\n").length,
      });
    }
  }

  return apiCalls;
}

// 递归扫描源代码目录
function scanSourceFiles(dir) {
  const files = fs.readdirSync(dir);
  let allApiCalls = [];

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !file.startsWith(".") &&
      file !== "node_modules"
    ) {
      allApiCalls = allApiCalls.concat(scanSourceFiles(filePath));
    } else if (file.endsWith(".js") || file.endsWith(".jsx")) {
      const apiCalls = extractApiCalls(filePath);
      allApiCalls = allApiCalls.concat(apiCalls);
    }
  });

  return allApiCalls;
}

// 生成API使用报告
function generateApiReport() {
  console.log("🔍 扫描项目中的API调用...");

  const sourceDir = path.join(config.projectRoot, config.sourceDir);
  const apiCalls = scanSourceFiles(sourceDir);

  // 统计API使用情况
  const apiUsage = {};
  apiCalls.forEach((call) => {
    if (!apiUsage[call.url]) {
      apiUsage[call.url] = [];
    }
    apiUsage[call.url].push({
      file: call.file,
      line: call.line,
    });
  });

  // 生成报告
  const report = {
    generatedAt: new Date().toISOString(),
    totalApiCalls: apiCalls.length,
    uniqueApis: Object.keys(apiUsage).length,
    usage: apiUsage,
  };

  // 确保输出目录存在
  const outputDir = path.join(config.projectRoot, config.outputDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 写入报告文件
  const reportPath = path.join(outputDir, "api-usage-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`✅ API使用报告已生成: ${reportPath}`);
  console.log(
    `📊 发现 ${report.uniqueApis} 个不同的API，共 ${report.totalApiCalls} 次调用`
  );

  return report;
}

// 更新API文档状态
function updateApiDocumentation() {
  console.log("📝 更新API文档状态...");

  const apiDocsPath = path.join(config.projectRoot, config.apiDocsPath);
  if (!fs.existsSync(apiDocsPath)) {
    console.error("❌ API文档文件不存在:", apiDocsPath);
    return;
  }

  let content = fs.readFileSync(apiDocsPath, "utf-8");

  // 更新文档末尾的时间戳
  const timestamp = new Date().toLocaleString("zh-CN");
  content = content.replace(/> 最后更新：.*/, `> 最后更新：${timestamp}`);

  fs.writeFileSync(apiDocsPath, content);
  console.log("✅ API文档时间戳已更新");
}

// 主函数
async function main() {
  console.log("🚀 开始生成CSR-Admin API文档...\n");

  try {
    // 1. 生成API使用报告
    const report = generateApiReport();

    // 2. 更新API文档
    updateApiDocumentation();

    // 3. 输出DeepWiki集成指南
    console.log("\n📖 DeepWiki集成步骤:");
    console.log("1. 确保在Cursor中启用了DeepWiki MCP服务");
    console.log("2. 使用 @deepwiki 命令分析项目文档");
    console.log("3. 运行: @deepwiki generate --config deepwiki.config.json");
    console.log("4. 发布文档: @deepwiki publish --domain csr-admin-docs");

    console.log("\n✨ 文档生成完成！");
  } catch (error) {
    console.error("❌ 文档生成失败:", error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  generateApiReport,
  updateApiDocumentation,
  extractApiCalls,
};
