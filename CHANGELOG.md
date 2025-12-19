# CHANGELOG

# version 2.0

## 2.0.1

- feature: Add occupation_type field with Job/Business radio selection in Step4
- feature: Add conditional fields (company_name, designation for Job; business_name, business_category for Business)
- feature: Add Computer Science to EDUCATION_STREAMS
- feature: Add keyboard navigation (Tab/Arrow keys) to Autocomplete component
- feature: Add Save button to TimePicker for explicit time confirmation
- feature: Replace state Select with searchable Autocomplete for Indian states
- feature: Enhance ProfileView to display all profile details (email, phone, education, location, family)
- feature: Update PublicProfileModal with ESC key close and show all details openly
- feature: Add Rejected tab to MatchView for viewing profiles user rejected
- feature: Add getRejectedProfiles service function and /api/matches/rejected endpoint
- change: Reorder FloatingNav to Profile → Rishtey → Search → Matches with always-visible labels
- change: Make profile pictures circular with fallback avatar in RishteyView
- change: Change salary label to "Annual Turnover Range" when Business is selected
- fix: Remove caste/gotra from father/mother sections, keep only for Maternal Side
- fix: Apply Title Case to name inputs instead of uppercase
- fix: Cancel button now redirects to Profile view with improved visibility

# version 1.1

## 1.1.1

- feature: Initialized FEATURES.md to track project functionality
- feature: Initialized CHANGELOG.md as per Unified Authoritative Agent Ruleset
