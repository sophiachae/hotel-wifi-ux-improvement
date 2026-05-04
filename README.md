# Hotel Wi-Fi UX Improvement

A UX improvement project based on real hospitality experience, focusing on streamlining the hotel Wi-Fi connection flow for guests.

---

## Background

During my time working at a hotel in the UK, I noticed that guests frequently struggled with the Wi-Fi connection process. The existing flow required unnecessary steps that caused confusion and led to repeated complaints at the front desk.

---

## Problem (As-Is)

The current Wi-Fi connection flow requires guests to go through an unnecessary intermediate page (Page A) before reaching the actual connection page (Page B).

**Current flow:**
1. Guest selects Wi-Fi network manually on their device
2. Captive portal opens → **Page A** appears (room number + last name input)
3. Guest must find and click "I have a promotion code" link
4. **Page B** appears → guest enters promotion code
5. Wi-Fi connected

**Issues identified:**
- Page A serves no functional purpose — entering room number and last name does NOT connect the guest to Wi-Fi
- The promotion code link on Page A is not prominent enough
- Guests were unaware they needed a promotion code, leading to confusion and front desk complaints

---

## Solution (To-Be)

By placing a QR code on the key wallet card that links directly to Page B, guests can skip Page A entirely.

**Improved flow:**
1. Guest scans QR code on key wallet card
2. **Page B** appears directly → guest enters promotion code
3. Wi-Fi connected

---

## Test Scenarios

### Page A (As-Is — Bug Reproduction)

| # | Scenario | Expected Result |
|---|----------|----------------|
| 1 | Enter room number + last name → click Connect | Popup appears: promotion code required |
| 2 | Leave both fields empty → click Connect | Error: "Please fill in all fields" |
| 3 | Enter room number only | Error: last name required |
| 4 | Enter last name only | Error: room number required |
| 5 | Enter letters in room number field | Input rejected — numbers only |
| 6 | Enter numbers in last name field | Input rejected — letters only |
| 7 | Enter last name with 1 character | Error: minimum 2 characters |
| 8 | Click "I have a promotion code" | Navigate to Page B |
| 9 | Click "Enter promotion code" in popup | Navigate to Page B |

### Page B (To-Be — Happy Path & Edge Cases)

| # | Scenario | Expected Result |
|---|----------|----------------|
| 1 | Enter valid promotion code → click Connect | Success screen with Wi-Fi details |
| 2 | Press Enter key with valid code | Success screen with Wi-Fi details |
| 3 | Enter invalid code → click Connect | Error: "Invalid code" |
| 4 | Leave field empty → click Connect | Error: "Please enter your promo code" |
| 5 | Enter code with leading/trailing spaces | Auto-trimmed, treated as valid |
| 6 | Enter code in lowercase | Auto-converted to uppercase |
| 7 | Enter invalid code → correct it → Connect | Error disappears, success screen |

---

## Tech Stack

- HTML / CSS / JavaScript
- Playwright (E2E test automation) — in progress

---

## Project Structure

```
hotel-wifi-ux-improvement/
├── pages/
│   ├── page-a.html    # As-is: unnecessary intermediate page
│   └── page-b.html    # To-be: promotion code input page
└── tests/
    └── wifi.spec.ts   # Playwright test scenarios
```

---

*This project is based on a real UX issue observed during hotel work experience in the UK (2024–2026).*
