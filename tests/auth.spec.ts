import { test, expect } from '@playwright/test';
import { MongoClient } from 'mongodb';
import { randomBytes } from 'crypto';

const MONGO_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING || 'MongoDB connection string not set';
const DB_NAME = 'orchids';
const USERS_COLLECTION = 'users';

function generateTestUser() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return {
    name: `testUser-${timestamp}`,
    email: `testuser-${timestamp}@example.com`,
    password: randomBytes(12).toString('hex'),
  };
}

async function deleteTestUser(email: string) {
  const client = new MongoClient(MONGO_CONNECTION_STRING);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    await db.collection(USERS_COLLECTION).deleteOne({ email });
  } finally {
    await client.close();
  }
}

test.describe.serial('Authentication flow', () => {
  const testUser = generateTestUser();

  test.afterAll(async () => {
    await deleteTestUser(testUser.email);
  });

  test('should register a new user', async ({ page }) => {
    await page.goto('/register');
    
    // Fill the registration form
    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for success message or error
    const errorElement = await page.waitForSelector('[data-testid="register-error"]', { timeout: 2000 }).catch(() => null);
    if (errorElement) {
      const errorText = await errorElement.textContent();
      throw new Error(`Registration failed with error: ${errorText}`);
    }

    const successMessage = await page.waitForSelector('[data-testid="register-success"]');
    expect(await successMessage.isVisible()).toBeTruthy();
    
    // Wait for redirect to login page
    await page.waitForURL('/login');
  });

  test('should login with registered user', async ({ page }) => {
    await page.goto('/login');
    
    // Fill the login form
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Check for any error messages first
    const errorElement = await page.waitForSelector('[data-testid="login-error"]', { timeout: 2000 }).catch(() => null);
    if (errorElement) {
      const errorText = await errorElement.textContent();
      throw new Error(`Login failed with error: ${errorText}`);
    }
    
    // If no error, wait for successful login by checking for user menu
    const userMenu = await page.waitForSelector('data-testid=user-menu');
    expect(await userMenu.isVisible()).toBeTruthy();
  });
});
