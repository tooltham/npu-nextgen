# Application Form Specification

## Overview

This document specifies the data fields, validation rules, and logic for the 4-step application form of the "Smart Integrated Farm Manager" course.

---

## Step 1: PDPA Consent & Course Overview

- **Objective:** Legal compliance and informing the applicant.
- **Scroll Lock:** "Agree" checkbox and "Next" button are disabled until the PDPA text is scrolled to the bottom.
- **Fields:**
  - `pdpaConsent`: Boolean (Required: TRUE to proceed).

---

## Step 2: Personal Information

- **Objective:** Identity and contact details collection.
- **Fields:**
  - `titleTh`: Select (นาย, นาง, นางสาว).
  - `firstNameTh`: Text (Thai characters only).
  - `lastNameTh`: Text (Thai characters only).
  - `firstNameEn`: Text (Latin characters only).
  - `lastNameEn`: Text (Latin characters only).
  - `email`: Text (Email format, Unique in database).
  - `phone`: Text (10 digits, starts with 0).
  - `nationalId`: Text (13 digits, Thai ID checksum validation).
  - `lineId`: Text (Optional).

---

## Step 3: Background & Qualifications

- **Objective:** Eligibility screening.
- **Fields:**
  - `education`: Select (HIGH_SCHOOL_OR_VOC, DIPLOMA, BACHELOR, ABOVE_BACHELOR).
  - `targetGroup`: Multi-select (UNEMPLOYED, FARMER, COMMUNITY_ENTERPRISE, OTHER).
  - `hasAgriExperience`: Boolean (Radio).
  - `agriExperienceYears`: Number (Min 1, Required if `hasAgriExperience` is TRUE).
- **Conditional Logic:**
  - If `hasAgriExperience` is FALSE, show a warning: "This course requires agri experience; applications may be prioritized."

---

## Step 4: Readiness & Expectations

- **Objective:** Readiness assessment.
- **Fields:**
  - `digitalSkillLevel`: Select (EXCELLENT, GOOD, AVERAGE, LOW, NONE).
  - `expectations`: Multi-select (AI_IOT_FARM, DIGITAL_MARKETING, REDUCE_COST, OTHER).
  - `expectationsOther`: Text (Required if OTHER is selected).
  - `canCommitTime`: Boolean (Required: TRUE to confirm commitment to 285 hours).

---

## Review & Submission

- **Summary:** Displays all collected data for final verification.
- **Edit Links:** Allows returning to specific steps.
- **Security:** Data is encrypted (AES-256-GCM for `nationalId`) upon submission.
