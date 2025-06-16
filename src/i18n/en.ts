export default {
  // ... other translations
  navigation: {
    dashboard: 'Dashboard',
    users: 'Users Management',
    company: 'Company Profile',
    settings: 'Settings',
    customers: 'Customers',
    finance: 'Finance',
    reports: 'Reports',
    activities: 'Activities',
    subscription: 'Subscription',
    profile: 'Profile',
    'customers-pme': 'SMEs',
    'customers-financial': 'Financial Institutions',
    'customers-pending': 'Pending Accounts',
    'finance-revenue': 'Revenue',
    'finance-subscriptions': 'Subscriptions',
    'finance-tokens': 'Tokens & AI',
    'finance-payments': 'Payments',
    'finance-manual': 'Manual Payments',
    system: 'System',
    'system-health': 'System Health',
    'system-api': 'API Performance',
    'system-database': 'Databases',
    'system-ai': 'AI Configuration',
    'system-alerts': 'Alerts',
    'system-logs': 'Logs',
    configuration: 'Configuration',    'configuration-plans': 'Plans & Pricing',
    'configuration-tokens': 'Token Packages',
    'configuration-ai-costs': 'AI Costs',
  },
  common: {
    locale: 'en-US',
    back: 'Back',
    print: 'Print',
    export: 'Export',
    share: 'Share',
    backToFinance: 'Back to Finance',
    cancel: 'Cancel',
    save: 'Save',
    loading: 'Loading...',
    close: 'Close',
    edit: 'Edit',
    remove: 'Remove',
    on: 'on',
    saveChanges: 'Save Changes',
    loadingPayments: 'Loading payments...',
    downloadInitiated: 'Downloading data...',
    downloadSuccess: 'Payment list downloaded successfully (simulation)',
    paginationResult: 'Page {{page}} of {{totalPages}}',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    results: 'results',
    paginationShowing: 'Showing',
    paginationTo: 'to',
    paginationOf: 'of',
    notAvailable: 'N/A',
    allStatuses: 'All statuses',
    download: 'Download',
    viewDetails: 'View details',
    approve: 'Approve',
    reject: 'Reject',
    menu: 'Menu',
    toggleTheme: 'Toggle theme',
    expand: 'Expand',
    collapse: 'Collapse',
    adminTitle: 'Wanzo Admin',
    never: 'Never',
    unknown: 'Unknown',
    delete: 'Delete',
    deleting: 'Deleting...',
    loadingDelete: 'Deleting...',
    retry: 'Retry',
    search: 'Search...',
    selectCurrency: 'Select Currency',
    // ... other common translations
  },
  dashboard: {
    title: 'Wanzo Admin Dashboard',
    loadError: 'Error loading dashboard',
    totalUsers: 'Total Users',
    vsPreviousMonth: 'vs previous month',
    monthlyRevenue: 'Monthly Revenue',
    tokensUsed: 'Tokens Used',
    tokenCost: 'Token Cost',
    customerAccounts: 'Customer Accounts',
    systemHealth: 'System Health',
    operational: 'Operational',
    attentionRequired: 'Attention Required',
    pendingAccounts: 'Pending Accounts',
    paymentsToValidate: 'Payments to Validate',
    revenueEvolution: 'Revenue Evolution',
    aiTokenUsage: 'AI Token Usage',
    recentActivity: 'Recent Activity',
  },
  auth: {
    auth0Page: {
      title: 'Authentication with Auth0',
      description: 'Log in with your account to access the admin dashboard',
      authenticatedMessage: 'You are authenticated! Redirecting to dashboard...',
      accessNow: 'Access now',
      secureIntegration: 'Secure integration with API Gateway',
    },
    authCallbackPage: {
      processing: 'Processing authentication...',
      errorTitle: 'Authentication Error',
      errorMessage: 'An error occurred during authentication: {error}',
      contactSupport: 'If the problem persists, please contact support.',
      backToLogin: 'Back to Login',
      // Log messages (optional, but good for consistency if you translate logs)
      logAuth0Mounted: 'Auth0 callback page mounted',
      logCurrentURL: 'Current URL:',
      logSearchParams: 'Search parameters:',
      logLocalStorage: 'LocalStorage data:',
      logAccessTokenPresent: 'present',
      logAccessTokenAbsent: 'absent',
      logIdTokenPresent: 'present',
      logIdTokenAbsent: 'absent',
      logRefreshTokenPresent: 'present',
      logRefreshTokenAbsent: 'absent',
      logUserInfoPresent: 'present',
      logUserInfoAbsent: 'absent',
      logProcessingCallback: 'Processing Auth0 callback:',
      logAuthCodePresent: 'present',
      logAuthCodeAbsent: 'absent',
      logAuth0SDKLoading: 'Auth0 SDK loading, please wait...',
      logUserAuthenticated: 'User authenticated via Auth0, fetching tokens...',
      logUserInfo: 'User information:',
      logRoleUndefined: 'undefined',
      logScopesUndefined: 'undefined',
      logTokensFetched: 'Tokens fetched:',
      logIdTokenClaimsPresent: 'present',
      logIdTokenClaimsAbsent: 'absent',
      logStoringTokens: 'Storing tokens and user info...',
      logTokensStoredRedirecting: 'Tokens stored. Redirecting to dashboard...',
      logAuth0Error: 'Auth0 Error: {error} - {description}',
      logSilentAuthFailed: 'Silent authentication failed:',
      logRedirectingToLogin: 'Redirecting to login page...',
      logTokenExchangeFailed: 'Token exchange with backend failed:',
      logBackendVerificationError: 'Backend verification failed:',
    },
    authPage: {
      loginTitle: 'Wanzo Admin',
      loginMessage: 'Log in to your account',
      registerMessage: 'Create a new account',
      forgotPasswordMessage: 'Reset your password',
      loginError: 'Incorrect credentials. Please try again.',
      ksAuthError: 'Error during KS Auth authentication.',
      signUpError: 'Error during sign up. Please try again.'
    },
    forgotPasswordPage: {
      resetEmailSent: 'Reset email sent',
      errorSendingEmail: 'An error occurred while sending the email',
    },
    loginPage: {
      title: 'Login',
      adminPortal: 'Wanzo Administration',
      portalDescription: 'Admin portal for Wanzo managers',
      continueWithAuth0: 'Continue with Auth0',
      terms: 'terms of use',
      privacyPolicy: 'privacy policy',
      agreeMessage: 'By logging in, you agree to our {terms} and our {privacyPolicy}.',
      // Log messages
      logAuthState: 'Authentication state on LoginPage:',
      logUserAuthenticated: 'User already authenticated on LoginPage, redirecting to /dashboard',
      logAuth0Start: 'Starting Auth0 authentication...',
      logRedirectURI: 'Configured redirect URI:',
      logCallbackURL: 'Callback URL used:',
      logScopesUsed: 'Scopes used:',
      logAuthParams: 'Authentication parameters:',
    },
    nonAutorisePage: {
      title: 'Unauthorized Access',
      message: 'You do not have the necessary permissions to access this page. Please contact your administrator if you believe this is an error.',
      backToDashboard: 'Back to Dashboard',
    },
    resetPasswordPage: {
      passwordResetSuccess: 'Password reset successfully',
      errorResettingPassword: 'An error occurred while resetting the password',
    },
    resetPasswordForm: {
      title: 'Reset Your Password',
      instruction: 'Enter your new password below',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      passwordPlaceholder: 'Enter your new password',
      confirmPasswordPlaceholder: 'Confirm your new password',
      resetButton: 'Reset Password',
      passwordTooShort: 'Password must be at least 8 characters',
      passwordsDoNotMatch: 'Passwords do not match',
    },
    twoFactorVerificationPage: {
      verificationFailed: 'Verification failed',
      // The component itself handles more detailed error messages
    },
    // ... other auth translations
  },  finance: {
    payments: {
      title: 'Payment Management',
      searchPlaceholder: 'Search (ID, customer, invoice...)',
      newPaymentButton: 'New Payment',
      addPaymentSoon: 'Add payment feature coming soon',
      viewDetailsSimulation: 'View payment details: {{paymentId}}',
      downloadInvoiceSimulation: 'Download invoice: {{invoiceNumber}}',
      refundSimulationSuccess: 'Payment refund simulated successfully',
      noPaymentsFound: 'No payments found for the selected filters.',
    },
    tokens: {
      title: 'Tokens & AI Usage',
      subtitle: 'Manage and monitor token consumption across services',
      refreshMessage: 'Token data refreshed successfully',
      exportMessage: 'Token data export initiated',
      loading: 'Loading token data...',
      noData: 'No token transactions found',
      errorLoadingTitle: 'Error Loading Token Data',
      errorLoadingMessage: 'An error occurred while loading token data: {message}',
      tryAgain: 'Try Again',
      filters: {
        searchPlaceholder: 'Search by customer, token type...',
        allServices: 'All Services',
        allTime: 'All Time',
        last7Days: 'Last 7 Days',
        last30Days: 'Last 30 Days',
        last90Days: 'Last 90 Days',
        customRange: 'Custom Range',
        refresh: 'Refresh Data',
        export: 'Export Data'
      },
      serviceTypes: {
        text: 'Text Processing',
        voice: 'Voice Recognition',
        image: 'Image Processing',
        chat: 'AI Chat',
        wanzo_credit: 'Wanzo Credit',
        api_call: 'API Call',
        storage_gb: 'Storage GB',
        processing_unit: 'Processing Unit',
        generic: 'Generic Token',
        unknown: 'Unknown Service'
      },
      table: {
        customer: 'Customer',
        customerType: 'Type',
        date: 'Date',
        serviceType: 'Service',
        model: 'Token Type',
        tokens: 'Tokens',
        cost: 'Cost',
        requests: 'Requests',
        actions: 'Actions'
      },
      actions: {
        delete: 'Delete',
        deleteNotImplemented: 'Delete functionality coming soon'
      },
      pagination: {
        info: 'Showing {from} to {to} of {total} entries',
        prev: 'Previous',
        next: 'Next'
      },
      convertedFrom: 'converted from {currency}'
    },
    customer: {
      id: 'Customer ID',
    },
    status: {
      completed: 'Completed',
      pending: 'Pending',
      failed: 'Failed',
      canceled: 'Canceled',
      verified: 'Verified',
      rejected: 'Rejected',
      unknown: 'Unknown Status', // Added for PaymentsPage
    },
    paymentMethods: {
      card: 'Credit Card',
      bank_transfer: 'Bank Transfer',
      cash: 'Cash',
      paypal: 'PayPal',
      stripe: 'Stripe',
      manual: 'Manual',
      mobile_money: 'Mobile Money',
      crypto: 'Crypto',
      check: 'Check',
      other: 'Other',
    },
    filters: {
      status: 'Status',
      method: 'Method',
      date: 'Date',
      allStatuses: 'All statuses',
      allMethods: 'All methods',
      allDates: 'All dates',
      today: 'Today',
      thisWeek: 'This week',
      thisMonth: 'This month',
    },
    table: {
      date: 'Date',
      customer: 'Customer',
      invoiceId: 'Invoice ID',
      amount: 'Amount',
      method: 'Method',
      status: 'Status',
      actions: 'Actions',
    },
    actions: {
      downloadInvoice: 'Download Invoice',
      refund: 'Refund/Cancel',
    },
    summary: {
      totalRevenue: 'Total Revenue (Completed)',
      pendingRevenue: 'Pending Revenue',
      refundedAmount: 'Cancelled/Refunded Amount',
    },
    manualPayments: {
      title: 'Manual Payments Management',
      description: 'Verify and manage manually submitted payments.',
      searchPlaceholder: 'Ref, Name, Amount...',
      noPaymentsFound: 'No manual payments found',
      noPaymentsYet: 'There are no manual payments recorded yet.',
      noMatchingPayments: 'No payments match your search or filter criteria.',
      status: {
        pending: 'Pending',
        verified: 'Verified',
        rejected: 'Rejected',
        completed: 'Completed',
        failed: 'Failed',
        canceled: 'Canceled',
      },
      success: {
        approved: 'Payment approved successfully',
        rejected: 'Payment rejected successfully',
      },
      errors: {
        verificationError: 'Error verifying payment',
        verificationErrorDefault: 'Error during payment verification:',
      },
      modal: {
        detailsTitle: 'Manual Payment Details',
        customerName: 'Customer name',
        customerId: 'Customer ID',
        transactionRef: 'Transaction reference',
        amount: 'Amount',
        paymentDate: 'Payment date',
        submissionDate: 'Submission date',
        status: 'Current status',
        description: 'Description/Customer Notes',
        proofOfPayment: 'Proof of payment',
        adminNotes: 'Administrator Notes',
        verifyPaymentTitle: 'Verify Payment',
        verificationNotesPlaceholder: 'Add a note (optional)...',
        viewProof: 'View proof',
        proofPreviewAlt: 'Proof preview',
      },
      table: {
        customer: 'Customer',
        reference: 'Reference',
        amount: 'Amount',
        currency: 'Currency',
        paymentDate: 'Payment Date',
        submissionDate: 'Submission Date',
        status: 'Status',
        actions: 'Actions',
      },
    },
    analytics: {
      generalTitle: 'Financial Analytics',
      customerTitle: 'Customer Financial Analytics',
      errors: {
        title: 'Error Loading Analytics',
        generalError: 'Could not load financial data at this time. Please try again later.',
        unknownError: 'An unknown error occurred while fetching financial data.',
      },
      noData: {
        title: 'No Financial Data Available',
        message: 'There is no financial data to display for the selected period or filters.',
        chartMessage: 'No data available to display chart.'
      },
      timeframes: {
        label: 'Select timeframe',
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
      },
      periods: {
        label: 'Select period',
        last30days: 'Last 30 days',
        last90days: 'Last 90 days',
        lastYear: 'Last Year',
        allTime: 'All Time',
      },
      cards: {
        totalRevenue: 'Total Revenue',
        totalTransactions: 'Total Transactions',
        avgTransactionValue: 'Avg. Transaction Value',
      },
      charts: {
        revenueTrend: 'Revenue Trend',
        placeholder: 'Chart rendering is not implemented in this component.',
        dataPoints_one: 'data point',
        dataPoints_other: 'data points',
      }
    },
    revenue: {
      title: 'Revenue Analytics',
      timeFrames: {
        month: 'This Month',
        quarter: 'This Quarter',
        year: 'This Year',
      },
      errors: {
        loadErrorDefault: 'Error loading revenue data:',
        noDataTitle: 'No Revenue Data',
        noDataMessage: 'Could not load revenue data at this time.',
      },
      info: {
        noDataToExport: 'No data to export.',
      },
      success: {
        exportInitiated: 'Revenue data export initiated',
        dataRefreshed: 'Revenue data updated',
      },
      sections: {
        overview: 'Overview',
        breakdown: 'Breakdown',
        trends: 'Trends',
      },
      metrics: {
        totalRevenue: 'Total Revenue',
        recurringRevenue: 'Recurring Revenue (MRR/ARR)',
        oneTimeRevenue: 'One-Time Revenue',
        revenueGrowth: 'Revenue Growth',
        avgRevenuePerCustomer: 'Avg. Revenue / Customer',
        customerLifetimeValue: 'Customer Lifetime Value (CLV)',
        vsPreviousPeriod: 'vs. previous period',
      },
      breakdownTitles: {
        byCategory: 'Revenue by Category',
        byPlan: 'Revenue by Subscription Plan',
        byCustomerType: 'Revenue by Customer Type',
      },
      categoryNames: { // For dynamic category names if needed, or use direct strings in component
        subscriptions: 'Subscriptions',
        additionalTokens: 'Additional Tokens',
        professionalServices: 'Professional Services',
      },
      planTypes: {
        starter: 'Starter',
        pro: 'Professional',
        enterprise: 'Enterprise',
        financial: 'Financial Institution',
      },
      customerTypes: {
        pme: 'SME',
        financial: 'Financial Institution',
      },
      charts: {
        revenueTrend: 'Revenue Trend Over Time',
        noData: 'No data available for chart',
        total: 'Total',
        recurring: 'Recurring',
        oneTime: 'One-Time',
      },
      tableHeaders: {
        category: 'Category',
        planName: 'Plan Name',
        customerType: 'Customer Type',
        amount: 'Amount',
        percentage: 'Percentage',
        customers: 'Customers',
        period: 'Period',
      },
    },
  },
  settings: { 
    pageTitle: 'Admin Settings',
    tabs: {
      profile: 'Profile',
      currency: 'Currency',
      security: 'Security',
      notifications: 'Notifications',
      display: 'Display', 
      language: 'Language & Date', 
    },
    profile: {
      title: 'Admin Profile',
      updateSuccess: 'Profile updated successfully.',
      updateError: 'Error updating profile.',
      avatarSizeError: 'Image is too large (max 1MB).',
      avatarTypeError: 'Unsupported image format (JPG, PNG, GIF).',
      loadError: 'Error loading profile:',
      editButton: 'Edit',
      form: {
        nameLabel: 'Full Name',
        emailLabel: 'Email',
        phoneLabel: 'Phone',
        phonePlaceholder: '+1 234 567 8900',
      },
      view: {
        nameLabel: 'Full Name',
        emailLabel: 'Email',
        phoneLabel: 'Phone',
        phoneNotDefined: 'Not set',
      },
      kyc: {
        title: 'Identity Documents',
        idCardLabel: 'ID Card or Passport',
        idCardUploaded: 'Document uploaded',
        idCardVerified: 'and verified',
        idCardPending: 'pending verification',
        idCardNotUploaded: 'No document uploaded',
        updateIdCardButton: 'Update',
        uploadIdCardButton: 'Upload',
        signatureLabel: 'Signature',
        signatureSaved: 'Signature saved',
        signatureSavedDate: 'Signature saved on {date}',
        signatureNotSaved: 'No signature saved',
        signatureVerified: 'Signature verified', // Added for consistency, may not be used
        signaturePending: 'Signature pending', // Added for consistency, may not be used
        updateSignatureButton: 'Update',
        signButton: 'Sign',
        signatureComingSoon: 'Signature feature coming soon',
      },
      avatarDetails: { // Renamed from 'avatar' to 'avatarDetails' to avoid conflict
        change: 'Change Avatar',
        requirements: 'JPG, PNG, GIF up to 1MB.',
        editor: {
          title: 'Edit Avatar',
          cropPreviewAlt: 'Avatar crop preview'
        }
      },
      edit: 'Edit Profile',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      position: 'Position',
      role: 'Role',
      avatar: 'Profile Picture', // This is the label for the avatar image itself
      avatarAlt: "Admin's avatar",
      changeAvatar: 'Change', // This seems to be a duplicate of avatarDetails.change, review usage
    },
    currency: {
      currencyChanged: 'Currency changed to {currency}.',
      invalidRate: 'Invalid exchange rate. Rate must be a positive number.',
      rateExists: 'A manual rate for {currency} already exists.',
      rateAdded: 'Manual rate for {currency} added successfully.',
      fillAllFields: 'Please fill all fields for the new rate.',
      rateUpdated: 'Manual rate for {currency} updated successfully.',
      activeCurrency: 'Active Display Currency',
      manualRates: 'Manual Exchange Rates',
      manualRatesDescription: 'Set manual exchange rates against your active display currency. These rates will override live market rates for display purposes.',
      noManualRates: 'No manual exchange rates set.',
      addRateTitle: 'Add New Manual Rate',
      currencyLabel: 'Currency',
      selectCurrency: 'Select Currency',      rateLabel: 'Exchange Rate (1 {selectedCurrency} = X {activeCurrency})',
      ratePlaceholder: 'e.g., 1.12345',
      addRateButton: 'Add Rate',
    },
    security: {
      loadError: 'Error loading security settings.',
      updateSuccess: 'Security settings updated successfully.',
      updateError: 'Error updating security settings.', // Added
      sessionTerminated: 'Session terminated successfully.',
      allOtherSessionsTerminated: 'All other sessions terminated successfully.',
      generalTitle: 'General Security', // This might be too generic, consider specific titles for sections
      identityVerification: { // Added for KYC section title
        title: 'Identity Verification (KYC)',
      },
      twoFactorAuth: { // Added for 2FA section
        title: 'Two-Factor Authentication',
        description: 'Add an extra layer of security to your account.',
        statusEnabled: '2FA is Enabled',
        statusDisabled: '2FA is Disabled',
        methodEmail: 'Email',
        methodSms: 'SMS',
        promptDisable: 'Disable to remove this security layer.',
        promptEnable: 'Enable to enhance your account security.',
        enableButton: 'Enable 2FA',
        disableButton: 'Disable 2FA',
      },
      sessions: { // Added for Active Sessions section
        title: 'Active Sessions',
        description: 'Manage devices and browsers currently logged into your account.',
        loadError: 'Failed to load active sessions.',
        terminateSuccess: 'Session terminated successfully.',
        terminateError: 'Failed to terminate session.',
        terminateAllOthersButton: 'Log out all other sessions',
        terminateAllOthersSuccess: 'All other sessions terminated successfully.',
        terminateAllOthersError: 'Failed to terminate all other sessions.',
        unknownDevice: 'Unknown Device',
        currentSession: 'Current',
        ipAddressLabel: 'IP:',
        lastAccessedLabel: 'Last accessed:',
        terminateButton: 'Log out',
        noOtherSessions: 'No other active sessions found.',
      },
      loginHistory: { // Added for Login History section
        title: 'Login History (Last 10)',
        loadError: 'Failed to load login history.',
        dateHeader: 'Date',
        deviceHeader: 'Device/Browser',
        ipHeader: 'IP Address',
        statusHeader: 'Status',
        statusSuccess: 'Successful',
        statusFailed: 'Failed',
        noHistory: 'No login history found.',
      },
      // The following were present before, ensure they are correctly mapped or removed if covered by new keys
      twoFactorLabel: 'Enable Two-Factor Authentication (2FA)', // Covered by twoFactorAuth.title
      twoFactorDescription: 'Increase your account security by requiring a second form of verification.', // Covered by twoFactorAuth.description
      noSettingsData: 'Security settings data is not available at the moment.', // This might be a general error message
      activeSessionsTitle: 'Active Sessions', // Covered by sessions.title
      terminateAllOtherSessions: 'Log out all other sessions', // Covered by sessions.terminateAllOthersButton
      // unknownDevice: 'Unknown Device', // Covered by sessions.unknownDevice
      // currentSession: 'Current session', // Covered by sessions.currentSession
      // lastAccessed: 'Last accessed', // Covered by sessions.lastAccessedLabel
      // terminateSession: 'Log out', // Covered by sessions.terminateButton
      // noActiveSessions: 'No other active sessions found.', // Covered by sessions.noOtherSessions
      // loginHistoryTitle: 'Login History (Last 10)', // Covered by loginHistory.title
      // historyDate: 'Date', // Covered by loginHistory.dateHeader
      // historyIp: 'IP Address', // Covered by loginHistory.ipHeader
      // historyDevice: 'Device/Browser', // Covered by loginHistory.deviceHeader
      // historyStatus: 'Status', // Covered by loginHistory.statusHeader
      // historySuccess: 'Successful', // Covered by loginHistory.statusSuccess
      // historyFailed: 'Failed', // Covered by loginHistory.statusFailed
      // noLoginHistory: 'No login history found.', // Covered by loginHistory.noHistory
    },
    notifications: {
      updateSuccess: 'Notification preferences updated successfully.',
      updateError: 'Error updating notification preferences.',
      loadError: 'Error loading notification preferences.',
      title: 'Notification Preferences',
      description: 'Manage the notifications you receive.',
      emailNotifications: { // Renamed from email to emailNotifications
        title: "Email Notifications",
        description: "Manage your email notification preferences."
      },
      securityAlerts: { // Renamed from security to securityAlerts
        title: "Security Alerts",
        description: "Receive notifications for important security events, like new logins or password changes."
      },
      productUpdates: { // Renamed from updates to productUpdates
        title: "Product Updates & News",
        description: "Stay informed about new features, improvements, and announcements."
      },
      toggle: 'Toggle notification for {type}',
      noPreferences: 'No notification preferences available.',
      email: { // Added for email notifications
        label: 'Email Notifications',
        description: 'Receive important updates via email.',
      },
      sms: { // Added for SMS notifications
        label: 'SMS Notifications',
        description: 'Receive critical alerts via SMS.',
      },
      types: { // Example, add more as needed from your NotificationPreference types
        NEW_USER_REGISTRATION: {
          label: 'New User Registration',
          description: 'Receive a notification when a new user registers.',
        },
        SUBSCRIPTION_CHANGE: {
          label: 'Subscription Change',
          description: 'Receive a notification for subscription upgrades or downgrades.',
        },
        PAYMENT_RECEIVED: {
          label: 'Payment Received',
          description: 'Get notified when a payment is successfully processed.',
        },
        SYSTEM_ALERTS: {
            label: 'System Alerts',
            description: 'Receive important system-wide alerts and announcements.'
        }
      }
    },
    display: { // Added display settings
      title: 'Display Settings',
      themeLabel: 'Theme',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeSystem: 'System',
      layoutLabel: 'Layout',
      layoutCompact: 'Compact',
      layoutComfortable: 'Comfortable',
      themeUpdateSuccess: 'Theme updated successfully',
      themeUpdateError: 'Failed to update theme',
      layoutUpdateSuccess: 'Layout updated successfully',
      layoutUpdateError: 'Failed to update layout',
    },
    language: { // Added language settings
      title: 'Language & Date Settings',
      languageLabel: 'Language',
      selectLanguagePlaceholder: 'Select language',
      english: 'English',
      french: 'French',
      dateFormatLabel: 'Date Format',
      selectDateFormatPlaceholder: 'Select date format',
      languageChangeSuccess: 'Language changed successfully',
      languageChangeError: 'Error changing language:',
      languageChangeActionError: 'change language',
      dateFormatChangeSuccess: 'Date format changed successfully',
      dateFormatChangeError: 'Error changing date format:',
      dateFormatChangeActionError: 'change date format',
    },
    advanced: {
      title: 'Advanced Settings',
      exportData: 'Export Data',
      exportDescription: 'Download your application data in various formats.',
      exportFormat: 'Export Format',
      exportButton: 'Export Data',
      exportStarted: 'Data export started. This may take a few moments.',
      importData: 'Import Data',
      importWarning: 'Importing data will overwrite existing settings and content. Ensure you have a backup.',
      dropFiles: 'Drop files here or click to upload',
      supportedFormats: 'Supported formats: JSON, CSV',
      browseFiles: 'Browse Files',
      importStarted: 'Data import started. This may take a few moments.',
      resetApplication: 'Reset Application',
      resetWarning: 'This action is irreversible. Resetting will delete all your data and restore the application to its default state.',
      resetButton: 'Reset Application Data',
      confirmReset: 'Are you absolutely sure?',
      confirmResetDescription: 'This will permanently delete all application data. This action cannot be undone.',
      confirmResetButton: 'Yes, Reset Everything',
      resetComplete: 'Application has been reset successfully.',
    }
  },
  company: {
    profile: {
      title: 'Company Profile',
      name: 'Company Name',
      rccm: {
        label: 'Trade Register (RCCM)',
        placeholder: 'Ex: CD/GOMA/RCCM/23-B-00196'
      },
      nationalId: {
        label: 'National ID',
        placeholder: 'Ex: 19-H5300-N40995F'
      },
      taxNumber: {
        label: 'Tax Number (NIF)',
        placeholder: 'Ex: A2321658S'
      },
      address: {
        title: 'Address',
        street: 'Street/Avenue and number',
        city: 'City',
        province: 'Province',
        commune: 'Municipality',
        quartier: 'District'
      },
      contact: {
        title: 'Contact',
        email: 'Email',
        phone: 'Phone',
        addPhone: 'Add phone number'
      },
      representative: {
        title: 'Legal Representative',
        name: 'Full name',
        role: 'Position'
      }
    },
    registration: {
      title: 'Company Registration',
      form: {
        businessInfo: {
          title: 'Business Information',
          name: 'Company name',
          legalForm: 'Legal form',
          sector: 'Business sector',
          activities: 'Activities'
        },
        identification: {
          title: 'Identification',
          rccm: 'Trade Register',
          nationalId: 'National ID',
          taxNumber: 'Tax Number'
        },
        documents: {
          title: 'Documents',
          rccm: 'Trade Register Certificate',
          nationalId: 'National ID Certificate',
          taxNumber: 'Tax Certificate',
          upload: 'Upload'
        }
      }
    }
  },
  customers: {
    title: 'Customers',
    newCustomer: 'New Customer',
    addCustomer: 'Add Customer',
    confirmDelete: 'Are you sure you want to delete this customer?',
    pme: {
      title: 'SME Customers',
      noCustomersFound: 'No SME customers found',
      errors: {
        loadFailed: 'Failed to load PME customers. Please try again.'
      }
    },
    financial: {
      title: 'Financial Institution Customers',
      noCustomersFound: 'No financial institution customers found',
      errors: {
        loadFailed: 'Failed to load financial institution customers. Please try again.'
      }
    },
    pending: {
      title: 'Pending Customers',
      noCustomersFound: 'No pending customers found',
      loadError: 'Error loading pending customers',
      moreInfoMessage: 'Additional information is required',
      approveSuccess: 'Customer has been successfully approved',
      approveError: 'Error approving customer',
      rejectSuccess: 'Customer has been successfully rejected',
      rejectError: 'Error rejecting customer',
      requestInfoSuccess: 'Request for additional information sent',
      requestInfoError: 'Error sending information request',
      status: {
        verification: 'Pending Verification',
        approval: 'Pending Approval',
        info: 'Missing Information',
        payment: 'Pending Payment'
      },
      statusDescription: {
        verification: 'Information verification in progress',
        approval: 'Requires manual approval',
        info: 'Additional information required',
        payment: 'Waiting for first payment'
      },
      actions: {
        requestInfo: 'Request more info',
        approve: 'Approve',
        reject: 'Reject',
        view: 'View details'
      },
      confirmations: {
        approve: {
          title: 'Approve Customer',
          message: 'Are you sure you want to approve this customer? This will move them to active status.'
        },
        reject: {
          title: 'Reject Customer',
          message: 'Are you sure you want to reject this customer? This action cannot be undone.'
        },
        requestInfo: {
          title: 'Request More Information',
          message: 'This will notify the customer that additional information is required and change their status accordingly.'
        }
      }
    },
    tokenUsage: {
      title: 'Token Usage',
      noData: 'No token usage data available.',
      details: 'Usage Details',
      allocated: 'Allocation',
      used: 'Used',
      remaining: 'Remaining',
      rate: 'Average Daily Rate',
      processing: 'Processing...',
      confirm: 'Confirm Addition',
    },
    columns: {
      name: 'Name',
      email: 'Email',
      location: 'Location',
      status: 'Status',
      actions: 'Actions',
      type: 'Type',
      accountManager: 'Account Manager',
      created: 'Created',
      lastActivity: 'Last Activity',
      subscription: 'Subscription'
    },
    actions: {
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
      approve: 'Approve',
      reject: 'Reject',
      suspend: 'Suspend',
      reactivate: 'Reactivate',
      editNotImplemented: 'Edit functionality to be implemented'
    },
    errors: {
      loadFailed: 'Failed to load customers.',
      networkError: 'Unable to load customers. Please check your network connection.',
      serverError: 'The server encountered an error while loading customers.',
      loadDetailsFailed: 'Failed to load customer details.',
      createFailed: 'Failed to create customer.',
      updateFailed: 'Failed to update customer.',
      deleteFailed: 'Failed to delete customer.',
      documentUploadFailed: 'Failed to upload document.',
      documentApproveFailed: 'Failed to approve document.',
      documentRejectFailed: 'Failed to reject document.',
      validateFailed: 'Failed to validate customer.',
      suspendFailed: 'Failed to suspend customer.',
      reactivateFailed: 'Failed to reactivate customer.',
      loadActivitiesFailed: 'Failed to load customer activities.',
      loadStatsFailed: 'Failed to load customer statistics.',
      loadDocumentsFailed: 'Failed to load customer documents.',
      invalidId: 'Invalid customer ID.',
      loadDetailsFailedHook: 'Could not load customer details via hook.',
    },
    notifications: {
      created: 'Customer created successfully.',
      updated: 'Customer updated successfully.',
      deleted: 'Customer deleted successfully.',
      documentUploaded: 'Document uploaded successfully.',
      documentApproved: 'Document approved successfully.',
      documentRejected: 'Document rejected successfully.',
      validated: 'Customer validated successfully.',
      suspended: 'Customer suspended successfully.',
      reactivated: 'Customer reactivated successfully.'
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      suspended: 'Suspended',
      all: 'All Statuses'
    },
    type: {
      pme: 'PME/SME',
      ge: 'Large Enterprise',
      individual: 'Individual',
      financial: 'Financial Institution',
      other: 'Other'
    },
    notFound: {
      title: 'Customer not found',
      financialDetailsDescription: 'The customer with the provided ID was not found or the data is incomplete.',
    },
    editNotAvailable: 'Editing not possible: customer not loaded or ID missing.',
    create: {
      title: 'Create SME Customer',
      financialTitle: 'Create Financial Institution'
    },
    details: {
      title: 'Customer Information',
      subtitle: 'Details and contact information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      website: 'Website',
      contactPerson: 'Contact Person',
      taxId: 'Tax ID',
      paymentMethod: 'Preferred Payment Method',
      createdAt: 'Creation Date',
      notes: 'Notes',
    },
    documents: {
      title: 'Legal Documents',
      pme: {
        description: 'Documents required to validate your business account'
      },
      financial: {
        description: 'Approval document required to validate your financial institution'
      },
      status: {
        uploading: 'Uploading...',
        approved: 'Approved',
        rejected: 'Rejected',
        pendingReview: 'Pending verification',
        pending: 'Pending'
      },
      rejectionReason: 'Reason',
      actions: {
        add: 'Add',
        view: 'View document',
        resubmit: 'Resubmit',
        approve: 'Approve',
        reject: 'Reject'
      },
      toast: {
        uploadSuccess: 'Document uploaded successfully',
        uploadError: 'Error uploading document',
        rejectSuccess: 'Document rejected successfully',
        rejectError: 'Error rejecting document',
        rejectionReasonRequired: 'Rejection reason is required.'
      },
      errors: {
        uploadErrorLog: 'Error uploading document:'
      },
      modals: {
        rejectDocument: {
          title: 'Reject Document',
          description: 'Please provide a reason for rejection.',
          reasonPlaceholder: 'Rejection reason...'
        }
      },
      types: {
        rccm: 'Trade Register (RCCM)',
        id_nat: 'National ID',
        nif: 'Tax ID Number',
        cnss: 'National Social Security Fund',
        inpp: 'National Institute of Professional Preparation',
        patente: 'Business License',
        agrement: 'Approval Document',
        contract: 'Contract',
        agrementDescription: 'Official document certifying your financial institution',
        genericDescription: 'Official document required for validation'
      }
    },
    form: {
      businessInfo: {
        title: 'Business Information',
        name: 'Company name',
        legalForm: 'Legal form',
        sector: 'Business sector',
        activities: 'Activities'
      },
      identification: {
        title: 'Identification',
        rccm: 'Trade Register',
        nationalId: 'National ID',
        taxNumber: 'Tax Number'
      },
      documents: {
        title: 'Documents',
        rccm: 'Trade Register Certificate',
        nationalId: 'National ID Certificate',
        taxNumber: 'Tax Certificate',
        upload: 'Upload'
      },
      setTokens: {
        pme: 'Set 1M',
        financial: 'Set 10M'
      },
      selectUser: '-- Select a user --',
      selectPlan: '-- Select a plan --',
      accountTypes: {
        freemium: 'Freemium',
        standard: {
          pme: 'Standard SME',
          financial: 'Standard Financial'
        },
        premium: {
          pme: 'Premium SME',
          financial: 'Premium Financial'
        },
        enterprise: 'Enterprise Financial'
      }
    },
    // ...other customers translations...
  },
  users: {
    title: 'User Management',
    adminUsers: 'Admin Users',
    customerUsers: 'Customer Users',
    searchPlaceholder: 'Search users (name, email, ID...)',
    inviteUser: 'Invite User',
    inviteUserSuccess: 'User invited successfully: {{email}}',
    inviteUserError: 'Error inviting user: {{error}}',
    updateUserSuccess: 'User updated successfully: {{name}}',
    updateUserError: 'Error updating user: {{error}}',
    deleteUserSuccess: 'User deleted successfully: {{name}}',
    deleteUserError: 'Error deleting user: {{error}}',
    deleteUserConfirmationTitle: 'Delete User',
    deleteUserConfirmationMessage: 'Are you sure you want to delete the user {{name}}? This action cannot be undone.',
    userForm: {
      titleCreate: 'Create New User',
      titleEdit: 'Edit User',
      nameLabel: 'Full Name',
      namePlaceholder: 'Enter full name',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter email address',
      roleLabel: 'Role',
      statusLabel: 'Status',
      userTypeLabel: 'User Type',
      customerAccountLabel: 'Customer Account (for external users)',
      customerAccountPlaceholder: 'Select or enter customer account ID',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter new password (min. 8 characters)',
      confirmPasswordLabel: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm new password',
      createUserButton: 'Create User',
      updateUserButton: 'Update User',
      changePasswordButton: 'Change Password',
      passwordsDontMatch: 'Passwords do not match.',
      errors: {
        missingRequiredFields: 'Please fill in all required fields.',
        passwordTooShort: 'Password must be at least 8 characters long.',
        invalidEmail: 'Please enter a valid email address.',
        missingCustomerAccountId: 'Please provide a customer account ID for external users.',
      }
    },
    table: {
      name: 'Name',
      email: 'Email',
      role: 'Role',
      status: 'Status',
      customer: 'Customer',
      lastLogin: 'Last Login',
      actions: 'Actions',
      customerAccount: 'Customer {{accountId}}',
      internal: 'Wanzo (Internal)',
    },
    statusValues: {
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      title: 'User Details: {{userName}}',
      createdAt: 'Created At',
      lastLogin: 'Last Login',
      tabs: {
        activityLog: 'Activity Log',
        activeSessions: 'Active Sessions',
        permissionsAndRoles: 'Permissions & Roles',
      },
      permissions: {
        assignedPermissions: 'Assigned Permissions',
        applications: {
          // Add application IDs here as needed, e.g.:
          // 'wanzoApp': 'Wanzo Platform',
          // 'adminPortal': 'Admin Portal'
        },
        permissionValues: {
          // Add permission keys here as needed, e.g.:
          // 'read:users': 'Read Users',
          // 'write:settings': 'Write Settings'
        },
        noPermissionsAssigned: 'No specific permissions assigned. Role-based access applies.',
      },
      roles: {
        super_admin: 'Super Admin',
        company_admin: 'Company Admin',
        customer_support: 'Customer Support',
        sales_manager: 'Sales Manager',
        finance_manager: 'Finance Manager',
        technical_support: 'Technical Support',
        auditor: 'Auditor',
        external_user: 'External User',
      }
    },
    delete: {
      title: 'Confirm Deletion',
      warning: 'Warning: This action is irreversible.',
      description: 'Are you sure you want to permanently delete the user {{name}}? All associated data will be removed.',
    }
  },
  customer: {
    types: {
      pme: 'SME',
      financial_institution: 'Financial Institution',
    },
    // ... other customer translations
  },
  notifications: {
    title: 'Notifications',
    markAllRead: 'Mark all as read',
    empty: 'You have no new notifications.',
    realtime: {
      connected: 'Real-time connection active',
      disconnected: 'Real-time connection inactive, polling for updates'
    },
    errors: {
      load: 'Error loading notifications',
      markRead: 'Error marking notification as read',
      markAllRead: 'Error marking all notifications as read',
      delete: 'Error deleting notification',
    },
    types: {
      security: 'Security Alert',
      warning: 'Warning',
      payment: 'Payment Received',
      document: 'Document Update',
      info: 'Information',
      subscription: 'Subscription Update',
      success: 'Success',
      error: 'Error',
    }
  },
  transaction: {
    type: {
      payment: 'Payment',
      refund: 'Refund',
      subscription: 'Subscription',
      credit: 'Credit'
    },
    descriptions: {
      premiumSubscription: 'Premium Subscription - {{month}} {{year}}',
      partialRefund: 'Partial Refund - Service unavailable',
      extendedTestCredit: 'Credit for extended test period'
    }
  },
  chat: {
    title: 'Support',
    closeChat: 'Close chat',
    sendMessage: 'Send message',
    attachFile: 'Attach file',
    messagePlaceholder: 'Type your message here...',
    fileUploadError: 'Error uploading file',
    connectingMessage: 'Connecting...',
    typingIndicator: 'is typing...',
    connectionError: 'Chat connection error',
    reconnectMessage: 'Attempting to reconnect...',
    noMessages: 'No messages. Start the conversation!',
    welcomeMessage: 'Hello! How can I help you today?',
    agentName: 'Wanzo Support',
    yourName: 'You',
    sendingMessage: 'Sending...',
    failedToSend: 'Failed to send. Click to retry.',
    attachmentTypes: 'Images, PDFs, Documents (.doc, .docx)',
    fileSizeLimit: 'Maximum file size: 5 MB'
  },
  // ... other translations
};