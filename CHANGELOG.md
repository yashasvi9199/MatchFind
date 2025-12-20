# CHANGELOG

# version 2.1

## 2.1.1

- feature: Added in-app update checker for Android builds (checks GitHub Releases on app launch)
- feature: APK download modal now hidden on Android native app (only shows on website)
- feature: Added platform detection utility using Capacitor
- feature: Android hardware back button navigation (Profile/Search/Match → Rishtey, closes modals)
- change: Added version metadata to metadata.json for update comparison

# version 2.0

## 2.0.8

- feature: Added playful "lift" animation to input icons on focus for Email, Phone, and Password.
- feature: Enhanced phone input with auto-formatting (+91 prefix) and strict numeric validation.
- feature: Added "Confirm Password" field to signup flow and password visibility toggles (Eye/EyeOff).
- feature: Revamped password validation with immediate client-side feedback and real-time visual separation (red border) for mismatches.
- style: Relocated "Forgot Password" link to a more intuitive position inside the password field block.

## 2.0.7

- feature: Replaced static Android download banner with a premium "Get App" popup modal.
- feature: "Get App" modal auto-appears on load (desktop & mobile) and fetches latest APK from GitHub.

## 2.0.6

- feature: Enhanced Profile UI with optimized layout (Health & Lifestyle section repositioned).
- feature: Dynamic gender-based color themes (Blue/Cyan for Male, Rose/Orange for Female).
- feature: Standardized 'SquarePen' edit icons across the entire profile view for consistency.
- fix: Significant performance optimization in ProfileView and FullProfileView by stabilizing component definitions.
- style: Refined Hero section aesthetics with improved spacing and visual layering.

## 2.0.5

- feature: Redesigned ProfileView with a premium, organized layout and better visual hierarchy.
- feature: Direct step navigation for profile editing (clicking "edit" icon goes directly to the relevant step).
- feature: Global input validation and formatting (Title Case, no-trim-on-change) for smoother professional profiles.
- fix: Resolved the space issues in input fields by removing premature trimming.
- fix: Implemented centralized trim-on-submit logic in Dashboard.tsx.
- change: Updated all profile editing steps to remove redundant formatting logic.

## 2.0.4

- feature: Custom "Wave" Spinner in RishteyView with 2s minimum duration for smooth UX
- feature: Partial profile editing UI with "square-pen" icons in ProfileView
- feature: Partial edit modal with logic-based redirection to editor steps
- fix: Integrated isProfileComplete check and IncompleteProfileModal into partial editing flow

## 2.0.3

- feature: Full Profile View with dedicated page for potential matches
- feature: Image pop-out modality for profile pictures
- feature: AM/PM format support in TimePicker and profile display
- feature: Android App Download banner on Auth page with release link
- fix: Title case and text input handling across all form steps
- fix: Removed blocking validation for occupation field
- change: Updated floating navigation with bottom labels and improved icons (Height, Location)

## 2.0.2

- fix: Mobile login/signup page 3-second lag by initializing isMobile state synchronously
- fix: Constant truthiness lint error on weight field in PublicProfileModal

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
