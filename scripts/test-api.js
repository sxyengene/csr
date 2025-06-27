const fetch = require("node-fetch");
const axios = require("axios");

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

// 测试登录功能
async function testLogin() {
  console.log("🔐 测试登录功能...");
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      username: "john_doe",
      password: "password123",
    });

    if (response.data.code === 200) {
      console.log("✅ 登录测试成功");
      console.log(
        `   Token: ${response.data.data.accessToken.slice(0, 20)}...`
      );
      return response.data.data.accessToken;
    } else {
      console.log("❌ 登录测试失败:", response.data.message);
      return null;
    }
  } catch (error) {
    console.log("❌ 登录测试出错:", error.message);
    return null;
  }
}

// 测试用户列表功能
async function testUserList(token) {
  console.log("\n👥 测试用户列表功能...");
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: 1,
        pageSize: 5,
      },
    });

    if (response.data.code === 200) {
      console.log("✅ 用户列表测试成功");
      console.log(`   总用户数: ${response.data.data.total}`);
      console.log(`   当前页: ${response.data.data.page}`);
      console.log(`   页大小: ${response.data.data.pageSize}`);
      console.log(`   用户列表:`);

      response.data.data.data.forEach((user, index) => {
        console.log(
          `     ${index + 1}. ${user.username} (${user.role}) - ${
            user.location
          }`
        );
        console.log(`        审核人: ${user.reviewerName || "未设置"}`);
        console.log(
          `        事件数: ${user.eventCount}, 活动数: ${user.activityCount}`
        );
      });

      return true;
    } else {
      console.log("❌ 用户列表测试失败:", response.data.message);
      return false;
    }
  } catch (error) {
    console.log("❌ 用户列表测试出错:", error.message);
    if (error.response) {
      console.log(`   状态码: ${error.response.status}`);
      console.log(`   响应: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return false;
  }
}

// 测试用户搜索功能
async function testUserSearch(token) {
  console.log("\n🔍 测试用户搜索功能...");
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: 1,
        pageSize: 10,
        username: "john", // 搜索包含"john"的用户
      },
    });

    if (response.data.code === 200) {
      console.log("✅ 用户搜索测试成功");
      console.log(`   搜索结果数: ${response.data.data.total}`);
      response.data.data.data.forEach((user) => {
        console.log(`     - ${user.username}`);
      });
      return true;
    } else {
      console.log("❌ 用户搜索测试失败:", response.data.message);
      return false;
    }
  } catch (error) {
    console.log("❌ 用户搜索测试出错:", error.message);
    return false;
  }
}

// 测试网络连接
async function testConnection() {
  console.log("🌐 测试网络连接...");
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users`, {
      timeout: 5000,
    });
    // 即使返回401也说明连接正常
    console.log("✅ 网络连接正常");
    return true;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("✅ 网络连接正常 (需要认证)");
      return true;
    }
    console.log("❌ 网络连接失败:", error.message);
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

  // 4. 测试登录功能
  const loginOk = await testLogin();
  results["登录功能"] = loginOk !== null;

  // 5. 测试用户列表功能
  const userListOk = await testUserList(loginOk);
  results["用户列表功能"] = userListOk;

  // 6. 测试用户搜索功能
  const userSearchOk = await testUserSearch(loginOk);
  results["用户搜索功能"] = userSearchOk;

  // 7. 测试网络连接
  const connectionOk = await testConnection();
  results["网络连接"] = connectionOk;

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
  testLogin,
  testUserList,
  testUserSearch,
  testConnection,
};
