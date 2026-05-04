import { test, expect } from '@playwright/test';
import path from 'path';

const pageA = 'file://' + path.resolve('pages/page-a.html');
const pageB = 'file://' + path.resolve('pages/page-b.html');

// =====================
// PAGE A 테스트
// =====================

test.describe('Page A - As-Is Bug Reproduction', () => {

  test('1. 둘 다 비어있을 때 에러 메시지', async ({ page }) => {
    await page.goto(pageA);
    await page.click('button.btn');
    await expect(page.locator('#all-error')).toBeVisible();
  });

  test('2. 방번호만 입력했을 때 에러 메시지', async ({ page }) => {
    await page.goto(pageA);
    await page.fill('#room', '204');
    await page.click('button.btn');
    await expect(page.locator('#lastname-error')).toBeVisible();
  });

  test('3. 라스트네임만 입력했을 때 에러 메시지', async ({ page }) => {
    await page.goto(pageA);
    await page.fill('#lastname', 'Smith');
    await page.click('button.btn');
    await expect(page.locator('#room-error')).toBeVisible();
  });

  test('4. 방번호에 숫자만 입력 가능', async ({ page }) => {
    await page.goto(pageA);
    await page.fill('#room', 'abc123');
    const value = await page.inputValue('#room');
    expect(value).toBe('123');
  });

  test('5. 라스트네임에 영어만 입력 가능', async ({ page }) => {
    await page.goto(pageA);
    await page.fill('#lastname', 'Smith123');
    const value = await page.inputValue('#lastname');
    expect(value).toBe('Smith');
  });

  test('6. 라스트네임 1자 입력 시 에러', async ({ page }) => {
    await page.goto(pageA);
    await page.fill('#room', '204');
    await page.fill('#lastname', 'A');
    await page.click('button.btn');
    await expect(page.locator('#lastname-error')).toBeVisible();
  });

  test('7. 방번호+라스트네임 입력 후 Connect → 팝업 뜨는지', async ({ page }) => {
    await page.goto(pageA);
    await page.fill('#room', '204');
    await page.fill('#lastname', 'Smith');
    await page.click('button.btn');
    await expect(page.locator('.overlay')).toHaveClass(/show/);
  });

  test('8. 팝업에서 Enter promotion code 클릭 → B 페이지 이동', async ({ page }) => {
    await page.goto(pageA);
    await page.fill('#room', '204');
    await page.fill('#lastname', 'Smith');
    await page.click('button.btn');
    await page.click('#popup-btn');
    await expect(page).toHaveURL(/page-b/);
  });

  test('9. I have a promotion code 클릭 → B 페이지 이동', async ({ page }) => {
    await page.goto(pageA);
    await page.click('.promo-link');
    await expect(page).toHaveURL(/page-b/);
  });

});

// =====================
// PAGE B 테스트
// =====================

test.describe('Page B - To-Be Happy Path & Edge Cases', () => {

  test('1. 유효한 코드 입력 → 성공 화면', async ({ page }) => {
    await page.goto(pageB);
    await page.fill('#promo-input', 'Welcomeguest');
    await page.click('button.connect-btn-sm');
    await expect(page.locator('#success-state')).toBeVisible();
  });

  test('2. 엔터키로 Connect → 성공 화면', async ({ page }) => {
    await page.goto(pageB);
    await page.fill('#promo-input', 'Welcomeguest');
    await page.press('#promo-input', 'Enter');
    await expect(page.locator('#success-state')).toBeVisible();
  });

  test('3. 잘못된 코드 입력 → 에러 메시지', async ({ page }) => {
    await page.goto(pageB);
    await page.fill('#promo-input', 'WRONGCODE');
    await page.click('button.connect-btn-sm');
    await expect(page.locator('#error-msg')).toBeVisible();
  });

  test('4. 빈 칸으로 Connect → 에러 메시지', async ({ page }) => {
    await page.goto(pageB);
    await page.click('button.connect-btn-sm');
    await expect(page.locator('#error-msg')).toBeVisible();
  });

  test('5. 소문자 입력 → 대문자로 자동변환', async ({ page }) => {
    await page.goto(pageB);
    await page.fill('#promo-input', 'welcomeguest');
    const value = await page.inputValue('#promo-input');
    expect(value).toBe('WELCOMEGUEST');
  });

  test('6. 앞뒤 공백 포함 코드 → 성공 화면', async ({ page }) => {
    await page.goto(pageB);
    await page.fill('#promo-input', '  Welcomeguest  ');
    await page.click('button.connect-btn-sm');
    await expect(page.locator('#success-state')).toBeVisible();
  });

  test('7. 틀린 코드 후 수정 → 에러 메시지 사라짐', async ({ page }) => {
    await page.goto(pageB);
    await page.fill('#promo-input', 'WRONGCODE');
    await page.click('button.connect-btn-sm');
    await expect(page.locator('#error-msg')).toBeVisible();
    await page.fill('#promo-input', 'fix');
    await expect(page.locator('#error-msg')).toBeHidden();
  });

});