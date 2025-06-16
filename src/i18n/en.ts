export default {
  // ... other translations
  common: {
    cancel: 'Cancel',
    save: 'Save',
    loading: 'Loading...',
    close: 'Close', // Added
    // ... other common translations
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
    errors: {
      loadFailed: 'Failed to load customers.',
      loadDetailsFailed: 'Failed to load customer details.',
      createFailed: 'Failed to create customer.',
      updateFailed: 'Failed to update customer.',
      deleteFailed: 'Failed to delete customer.', // Assuming you might add delete later
      documentUploadFailed: 'Failed to upload document.',
      documentApproveFailed: 'Failed to approve document.',
      documentRejectFailed: 'Failed to reject document.',
      validateFailed: 'Failed to validate customer.',
      suspendFailed: 'Failed to suspend customer.',
      reactivateFailed: 'Failed to reactivate customer.',
      loadActivitiesFailed: 'Failed to load customer activities.',
      loadStatsFailed: 'Failed to load customer statistics.',
      loadDocumentsFailed: 'Failed to load customer documents.'
    },
    notifications: {
      created: 'Customer created successfully.',
      updated: 'Customer updated successfully.',
      deleted: 'Customer deleted successfully.', // Assuming you might add delete later
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
      suspended: 'Suspended'
    },
    type: {
      pme: 'PME/SME',
      ge: 'Large Enterprise',
      individual: 'Individual',
      other: 'Other'
    }
  },
  users: {
    title: 'Users',
    actions: {
      create: 'Create User',
    },
    search: {
      placeholder: 'Search users by name or email...',
    },
    details: {
      title: 'User Details',
      createdAt: 'Created At',
      lastLogin: 'Last Login',
      tabs: {
        activity: 'Activity',
        sessions: 'Sessions',
        permissions: 'Permissions',
        tokens: 'Tokens'
      },
      permissions: {
        title: 'Permissions',
        none: 'This user has no permissions assigned.'
      },
      tokens: { // Added for TokenUsageTab, assuming it might be used here or in UserDetailsModal directly
        monthlyLimit: 'Monthly Limit',
        used: 'Used',
        remaining: 'Remaining',
        usageHistory: 'Usage History',
        noHistory: 'No token usage history available.',
        date: 'Date',
        tokensUsed: 'Tokens Used',
        action: 'Action',
      },
      sessions: { // Added for UserSessionList
        activeSessions: 'Active Sessions',
        noActiveSessions: 'No active sessions.',
        ipAddress: 'IP Address',
        userAgent: 'User Agent',
        lastActivity: 'Last Activity',
        started: 'Started',
        terminate: 'Terminate',
        confirmTerminate: 'Are you sure you want to terminate this session?',
      },
      activity: { // Added for UserActivityList
        recentActivity: 'Recent Activity',
        noActivity: 'No recent activity to display.',
        type: 'Type',
        message: 'Message',
        timestamp: 'Timestamp',
        application: 'Application',
      }
    },
    form: {
      create: {
        title: 'Create New User',
        submit: 'Create User',
      },
      edit: {
        title: 'Edit User',
      },
      name: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      role: 'Role',
      status: 'Status',
      userType: 'User Type',
      customerAccountId: 'Customer Account ID',
      errors: {
        passwordsDontMatch: 'Passwords do not match.',
        passwordTooShort: 'Password must be at least 8 characters long.',
        missingCustomerAccountId: 'Customer Account ID is required for external users.',
      },
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      suspended: 'Suspended',
    },
    userTypes: {
      internal: 'Internal',
      external: 'External (Client)',
    },
    notifications: {
      created: 'User created successfully.',
      updated: 'User updated successfully.',
      deleted: 'User deleted successfully.',
      sessionTerminated: 'Session terminated successfully.', // Added
    },
    errors: {
      loadFailed: 'Failed to load users.',
      createFailed: 'Failed to create user.',
      updateFailed: 'Failed to update user.',
      deleteFailed: 'Failed to delete user.',
      loadSingleFailed: 'Failed to load user details.',
      missingFields: 'Please fill in all required fields to create a user.',
      sessionTerminationFailed: 'Failed to terminate session.', // Added
      invalidEmail: 'Please enter a valid email address.', // Added from UserForm
      missingRequiredFields: 'Please fill in all required fields.', // Added from UserForm
    },
    roles: {
      super_admin: 'Super Admin',
      cto: 'CTO',
      growth_finance: 'Growth & Finance',
      customer_support: 'Customer Support',
      content_manager: 'Content Manager',
      company_admin: 'Company Admin',
      company_user: 'Company User',
    },
    table: {
      name: 'Name',
      email: 'Email',
      role: 'Role',
      status: 'Status',
      company: 'Company',
      customer: 'Customer', // Added customer column name
      lastLogin: 'Last Login',
      actions: 'Actions',
      internal: 'Wanzo (Internal)',
      unknown: 'Unknown Customer', // Added for unknown customer
    },
  },
  permissions: { // Permission translations
    view_users: 'View Users',
    manage_users: 'Manage Users',
    view_settings: 'View Settings',
    read: 'Read',
    write: 'Write',
    admin: 'Administration',
    create: 'Create',
    update: 'Update',
    delete: 'Delete',
    export: 'Export',
    import: 'Import',
    // Add more specific permission translations here based on your application
  },
  userPermissions: { // Section for permissions form
    title: 'Permission Management',
    applications: 'Applications',
    noApplications: 'No applications available',
    save: 'Save Permissions',
    cancel: 'Cancel',
    // Application groups
    groups: {
      erp: 'ERP Suite',
      finance: 'Financial Solutions'
    },
    // Applications
    apps: {
      accounting: 'Accounting',
      sales: 'Sales',
      inventory: 'Inventory',
      portfolio: 'Portfolio Management',
      leasing: 'Leasing Management'
    }
  },
  tokenUsage: {
    monthlyLimit: 'Monthly Limit',
    used: 'Used This Month',
    remaining: 'Remaining',
    usage: 'Usage',
    history: 'Usage History'
  },
  grouping: {
    groupByCompany: 'Group by Company',
    ungroupByCompany: 'Ungroup by Company',
  }
  // ... other translations
};