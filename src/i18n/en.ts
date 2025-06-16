export default {
  // ... other translations
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
    errors: {
      loadFailed: 'Failed to load users.',
      createFailed: 'Failed to create user.',
      updateFailed: 'Failed to update user.',
      deleteFailed: 'Failed to delete user.',
      loadSingleFailed: 'Failed to load user details.'
    },
    notifications: {
      created: 'User created successfully.',
      updated: 'User updated successfully.',
      deleted: 'User deleted successfully.'
    }
  }
  // ... other translations
};