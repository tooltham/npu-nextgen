import puppeteer from "puppeteer";

async function testLogin(email, password, role) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log(`\nTesting login for ${role} (${email})...`);

    // Go to login page
    await page.goto("http://localhost:3000/admin/login");

    // Fill credentials
    await page.type("#email", email);
    await page.type("#password", password);

    // Click submit
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click('button[type="submit"]'),
    ]);

    console.log("Logged in successfully. Current URL:", page.url());

    // Attempt to access classroom
    console.log("Navigating to classroom...");
    await page.goto("http://localhost:3000/portal/classroom", {
      waitUntil: "networkidle0",
    });

    console.log("Resulting URL after classroom access:", page.url());

    // Verify content if applicable
    const content = await page.content();
    if (content.includes("ไม่พบสิทธิ์เข้าเรียน")) {
      console.log('Result: ❌ BLOCKED (Shown "ไม่พบสิทธิ์เข้าเรียน" page)');
    } else if (page.url().includes("login")) {
      console.log("Result: ❌ REDIRECTED to login");
    } else {
      console.log("Result: ✅ SUCCESS (Accessed classroom)");
      const title = await page.title();
      console.log("Page Title:", title);
    }
  } catch (err) {
    console.error("Error during test:", err.message);
  } finally {
    await browser.close();
  }
}

async function main() {
  await testLogin("apirak@npu.ac.th", "password123", "ADMIN");
  await testLogin("user19@example.com", "password123", "STUDENT");
}

main();
