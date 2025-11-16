# Form Questions Documentation

## Main Registration Form (AccessSection.tsx)

### Form Section Title
**"Reserve Your Place"**

### Required Fields

#### 1. First Name
- **Label:** "First Name *"
- **Input Type:** Text
- **Placeholder:** "Your first name"
- **Required:** Yes

#### 2. Email Address
- **Label:** "Email Address *"
- **Input Type:** Email
- **Placeholder:** "your@email.com"
- **Required:** Yes

#### 3. Phone Number
- **Label:** "Phone Number *"
- **Input Type:** Telephone
- **Placeholder:** "+91 98765 43210"
- **Required:** Yes

#### 4. Professional Role
- **Label:** "What Best Describes You? *"
- **Input Type:** Select Dropdown
- **Options:**
  - Select... (default)
  - Business Owner/Founder
  - Executive/Director
  - Professional (Doctor/Lawyer/Consultant)
  - Investor
  - Other
- **Required:** Yes

### Optional Fields

#### 5. Company/Organization
- **Label:** "Company/Organization"
- **Input Type:** Text
- **Placeholder:** "Your company (optional)"
- **Required:** No

## Form Actions

### Primary Actions
- **Submit Button:** "Confirm My Place Now"
- **Loading State:** "Securing Your Place..."

### Security & Consent
- **Message:** "Your information is secure and will never be shared. By registering, you agree to receive webinar details and follow-up communication."

## Call-to-Action Buttons

### Primary CTAs
1. **"Join the Conversation"** (HeroSection.tsx)
2. **"Reserve Your Spot for the Conversation"** (WebinarSection.tsx)
3. **"Request Invite"** (Floating CTA in WebinarSection.tsx)
4. **"I'd like to explore 10%, sign me up to the webinar"** (Floating CTA text)

### Secondary CTAs
5. **"Apply Now"** (ApplySection.tsx, MicroHeroSection.tsx, HeroSectionMicro.tsx)
6. **"Apply now"** (ApplySection.tsx button)

## Navigation Links with Form Implications

### Registration Navigation
- **"Register Now"** (page.tsx - links to #access)
- **"Webinar Details"** (links to #webinar)
- **"Results & Testimonials"** (links to #validation)

## Interactive User Identification Questions

### Audience Targeting (Webinar Section)
The form includes implicit user characteristic questions:

#### Persona Categories
1. **"Are you a Naturalist?"**
   - Options: Wilderness, Eco-tourism, Authentic

2. **"Are you Wellness Discerning?"**
   - Options: Meditation, Digital detox, Mindful

3. **"Are you a Cultural Authenticist?"**
   - Options: Sustainability, Regenerative, Community

4. **"Are you a Wilderness Relocator?"**
   - Options: Wilderness Living, Full Immersion, Nature Integration

### Philosophical Alignment Questions
5. **"Are you looking for time alone, not time off?"**
6. **"Do you want to buy back your time?"**
7. **"Are you ready to invest in solitude, silence, and stillness?"**
8. **"Are you ready to question whether your success is serving your life?"**

## Form Submission Confirmation

### Success Messages
- **Alert:** "Registration successful! Check your email for confirmation."

## Screening Questions (Implicit)

### This Conversation Is Not For:
- People looking for quick fixes
- Those seeking traditional luxury accommodations
- Individuals uncomfortable with wilderness settings

### However, If You're:
- A leader seeking deeper connection with yourself
- Someone who values authentic experiences over luxury
- Ready to disconnect from digital noise
- Seeking meaningful transformation through nature

## User Journey Questions

### Experience-Based Questions
- **"What happens when you step into nature?"**
- **"Don't just take our word for it. The numbers—and the people—tell the real story."** (Implies asking users to trust but also verify)

## Summary Statistics

### Form Fields Count
- **Required Fields:** 4
- **Optional Fields:** 1
- **Total Input Fields:** 5

### Button Actions
- **Primary CTAs:** 4
- **Secondary CTAs:** 2

### Dropdown Options
- **Professional Roles:** 5 options plus default

### Implicit Questions
- **Persona Categories:** 4
- **Philosophical Alignment:** 4+
- **Screening Questions:** Multiple implicit filters

## Form Design Philosophy

### Emphasis Areas
- **Exclusivity:** Limited availability messaging
- **Intentionality:** Purpose-driven user selection
- **Personal Transformation:** Nature immersion principles
- **Authenticity:** Wilderness-focused experience
- **Professional Alignment:** Targeting specific audience profiles

### Data Collection Strategy
The form system is designed to:
1. **Qualify leads** based on professional status and readiness
2. **Ensure philosophical alignment** with wilderness values
3. **Filter for serious applicants** through thoughtful questioning
4. **Manage expectations** about the wilderness experience
5. **Create urgency** through limited availability messaging