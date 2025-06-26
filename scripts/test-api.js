const fetch = require("node-fetch");

// API配置
const API_BASE_URL = "http://8.133.240.77:8080";

// 颜色输出工具
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 测试服务器连接
async function testServerConnection() {
  log("\n🔍 测试服务器连接...", "blue");

  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      timeout: 5000,
    });

    if (response.ok) {
      log("✅ 服务器连接正常", "green");
      return true;
    } else {
      log(`⚠️  服务器响应异常: ${response.status}`, "yellow");
      return false;
    }
  } catch (error) {
    log(`❌ 服务器连接失败: ${error.message}`, "red");
    return false;
  }
}

// 测试登录接口
async function testLoginAPI() {
  log("\n🔐 测试登录接口...", "blue");

  // 测试数据
  const testCredentials = [
    { username: "admin", password: "admin123", description: "管理员账号" },
    { username: "test", password: "test123", description: "测试账号" },
    {
      username: "john_doe",
      password: "password123",
      description: "API文档示例账号",
    },
  ];

  for (const cred of testCredentials) {
    log(`\n测试 ${cred.description}: ${cred.username}`, "yellow");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: cred.username,
          password: cred.password,
        }),
        timeout: 10000,
      });

      const data = await response.json();

      if (response.ok && data.code === 200) {
        log(`✅ 登录成功`, "green");
        log(`   Token类型: ${data.data.tokenType}`, "green");
        log(`   过期时间: ${data.data.expiresIn}秒`, "green");
        log(
          `   AccessToken: ${data.data.accessToken.substring(0, 50)}...`,
          "green"
        );
        return true;
      } else {
        log(`❌ 登录失败: ${data.message || "未知错误"}`, "red");
      }
    } catch (error) {
      log(`❌ 请求失败: ${error.message}`, "red");
    }
  }

  return false;
}

// 测试token验证（如果有验证接口）
async function testTokenValidation(token) {
  log("\n🔑 测试Token验证...", "blue");

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });

    if (response.ok) {
      const data = await response.json();
      log("✅ Token验证成功", "green");
      log(`   用户信息: ${JSON.stringify(data.data, null, 2)}`, "green");
      return true;
    } else {
      log(`⚠️  Token验证失败: ${response.status}`, "yellow");
      return false;
    }
  } catch (error) {
    log(`❌ Token验证请求失败: ${error.message}`, "red");
    return false;
  }
}

// 生成测试报告
function generateTestReport(results) {
  log("\n📊 测试报告", "blue");
  log("=".repeat(50), "blue");

  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(Boolean).length;
  const failed = total - passed;

  log(`总测试项: ${total}`, "yellow");
  log(`通过: ${passed}`, "green");
  log(`失败: ${failed}`, failed > 0 ? "red" : "green");
  log(
    `成功率: ${((passed / total) * 100).toFixed(1)}%`,
    failed > 0 ? "yellow" : "green"
  );

  log("\n详细结果:", "blue");
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? "✅" : "❌";
    const color = passed ? "green" : "red";
    log(`  ${status} ${test}`, color);
  });

  if (failed === 0) {
    log("\n🎉 所有测试都通过了！API接口工作正常。", "green");
  } else {
    log("\n⚠️  部分测试失败，请检查API服务器配置。", "yellow");
  }
}

// 主测试函数
async function runAPITests() {
  log("🚀 开始API接口测试", "blue");
  log(`目标服务器: ${API_BASE_URL}`, "blue");

  const results = {};

  // 1. 测试服务器连接
  results["服务器连接"] = await testServerConnection();

  // 2. 测试登录接口
  results["登录接口"] = await testLoginAPI();

  // 3. 如果有token，测试验证接口（可选）
  // results['Token验证'] = await testTokenValidation(someToken);

  // 生成报告
  generateTestReport(results);

  // 返回总体结果
  return Object.values(results).every(Boolean);
}

// 命令行提示
function showUsageHelp() {
  log("\n💡 使用提示:", "blue");
  log("1. 确保API服务器 http://8.133.240.77:8080 正在运行", "yellow");
  log("2. 检查网络连接是否正常", "yellow");
  log("3. 确认登录接口 /api/auth/login 已实现", "yellow");
  log("4. 验证用户名密码是否正确", "yellow");
  log("\n如果测试失败，请检查以上配置。", "yellow");
}

// 执行测试
if (require.main === module) {
  runAPITests()
    .then((success) => {
      if (success) {
        log("\n✨ 测试完成！您可以开始使用登录功能了。", "green");
        process.exit(0);
      } else {
        showUsageHelp();
        process.exit(1);
      }
    })
    .catch((error) => {
      log(`\n💥 测试过程中发生错误: ${error.message}`, "red");
      showUsageHelp();
      process.exit(1);
    });
}

module.exports = {
  runAPITests,
  testServerConnection,
  testLoginAPI,
  testTokenValidation,
};
