# API Documentation

This document outlines the API endpoints, request/response formats, and data flows for the application, derived from the UI components.

## Modules

This section will detail the different modules of the application and their respective API interactions.

### 1. Currency Settings

*   **UI Component Source:** `src/pages/settings/SettingsPage.tsx` (within `CurrencySettings` component)
*   **Primary Hook:** `src/hooks/useCurrencySettings.ts`
*   **Context:** `src/contexts/CurrencyContext.tsx`
*   **Utilities:** `src/utils/currency.ts`

**Data Flow and API Endpoints:**

#### a. Fetching Exchange Rates (External/System-wide)

*   **Trigger:** Likely on application load or periodically via `useExchangeRates` hook (details depend on `src/hooks/useExchangeRates.ts` implementation).
*   **Purpose:** To get the latest general exchange rates.
*   **Potential GET Endpoint:** `/api/v1/exchange-rates`
    *   **Description:** Retrieves the current system-wide exchange rates.
    *   **URL:** `GET /api/v1/exchange-rates`
    *   **Query Parameters (Optional):**
        *   `base={currency_code}` (e.g., `base=USD`) - To specify the base currency for rates.
    *   **Response Format (JSON):**
        ```json
        {
          "base": "USD",
          "rates": {
            "CDF": 2800.50,
            "FCFA": 600.75
            // ... other currency codes and their rates against the base
          },
          "lastUpdated": "2025-06-01T10:00:00Z" // ISO 8601 timestamp
        }
        ```

#### b. Updating User-Specific Manual Exchange Rates

*   **Trigger:** User saves new manual exchange rates in the "Manual Exchange Rates" section of `CurrencySettings`.
*   **UI Action:** `handleSaveRates` function in `CurrencySettings` component.
*   **Internal Flow:** `updateUserRate` (hook) -> `setUserExchangeRate` (context) -> `updateExchangeRates` (util) -> `localStorage`.
*   **Purpose:** To allow users to override system exchange rates with their own values for specific currencies, relative to their chosen base currency.
*   **Potential PUT Endpoint:** `/api/v1/user/settings/exchange-rates`
    *   **Description:** Saves or updates the user's preferred manual exchange rates.
    *   **URL:** `PUT /api/v1/user/settings/exchange-rates`
    *   **Request Body (JSON):**
        ```json
        {
          // The baseCurrency is determined by the user's current setting,
          // which might also be part of their user profile/settings on the backend.
          // The API should ideally know the user's base currency or allow it to be specified if necessary.
          // For this example, let's assume the backend knows the user's base currency.
          "rates": { // Key-value pairs of currency_code: rate_against_base_currency
            "CDF": 2850.00, // e.g., 1 {baseCurrency} = 2850.00 CDF
            "FCFA": 605.20  // e.g., 1 {baseCurrency} = 605.20 FCFA
          }
        }
        ```
    *   **Response Format (JSON - Success):**
        ```json
        {
          "success": true,
          "message": "Exchange rates updated successfully.",
          "data": {
            "baseCurrency": "USD", // The base currency these rates are relative to
            "rates": {
              "CDF": 2850.00,
              "FCFA": 605.20
            },
            "lastUpdated": "2025-06-01T10:05:00Z"
          }
        }
        ```
    *   **Response Format (JSON - Error):**
        ```json
        {
          "success": false,
          "message": "Invalid input: Rates must be positive numbers.",
          "errors": [ // Optional: more detailed errors
            { "field": "rates.CDF", "error": "Rate must be a positive number." }
          ]
        }
        ```

#### c. Changing Active Display Currency

*   **Trigger:** User selects a new currency from the `CurrencySelector` in the "Active Display Currency" section.
*   **UI Action:** `onChange` handler of `CurrencySelector` (currently `() => {}`, would call `setCurrency`).
*   **Internal Flow:** `setCurrency` (hook) -> `setContextCurrency` (context) -> `localStorage`.
*   **Purpose:** To set the user's preferred currency for displaying monetary values throughout the application.
*   **Potential PUT Endpoint:** `/api/v1/user/settings/display-currency`
    *   **Description:** Updates the user's active display currency preference.
    *   **URL:** `PUT /api/v1/user/settings/display-currency`
    *   **Request Body (JSON):**
        ```json
        {
          "displayCurrency": "CDF" // The new currency code (e.g., "USD", "CDF", "FCFA")
        }
        ```
    *   **Response Format (JSON - Success):**
        ```json
        {
          "success": true,
          "message": "Display currency updated successfully.",
          "data": {
            "displayCurrency": "CDF"
          }
        }
        ```
    *   **Response Format (JSON - Error):**
        ```json
        {
          "success": false,
          "message": "Invalid currency code provided."
        }
        ```

