/**
 * N8N FUNCTION CODE FOR TYPEFORM → SUPABASE WEBHOOK
 * ===================================================
 *
 * This code processes Typeform webhook data and inserts it into Supabase.
 *
 * SETUP IN N8N:
 * 1. Add a "Function" node after your Typeform webhook trigger
 * 2. Paste this code into the Function node
 * 3. Add a "Supabase" node after the Function node
 * 4. Configure the Supabase node with your credentials
 *
 * ENVIRONMENT VARIABLES (set in n8n):
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_SERVICE_KEY: Your Supabase service role key (found in Project Settings > API)
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_SERVICE_KEY = 'your-service-role-key-here'; // Use service role key for writes

// =============================================================================
// MAIN PROCESSING FUNCTION
// =============================================================================

const items = $input.all();

const processedItems = items.map(item => {
  const webhookData = item.json;

  // Extract form_response from webhook
  const formResponse = webhookData.form_response || webhookData.body?.form_response;

  if (!formResponse) {
    throw new Error('No form_response found in webhook data');
  }

  // Extract answers from the form response
  const answers = formResponse.answers || [];
  const hidden = formResponse.hidden || {};

  // Initialize parsed data object
  const parsedData = {
    typeform_response_id: formResponse.token,
    typeform_form_id: formResponse.form_id,
    submitted_at: formResponse.submitted_at,
    landed_at: formResponse.landed_at,
    first_name: '',
    last_name: '',
    email: '',
    phone: null,
    last_disconnect: null,
    natural_sounds: null,
    describes_you: null,
    utm_source: hidden.utm_source || null,
    utm_medium: hidden.utm_medium || null,
    utm_campaign: hidden.utm_campaign || null,
    utm_content: hidden.utm_content || null,
    utm_term: hidden.utm_term || null
  };

  // Parse answers - Typeform stores answers by field type
  answers.forEach(answer => {
    const fieldType = answer.type;

    switch (fieldType) {
      case 'text':
        // First name field (ref: b7bed83b-7ce1-494d-a23c-6e20b2f0fa55)
        if (answer.field?.ref === 'b7bed83b-7ce1-494d-a23c-6e20b2f0fa55') {
          parsedData.first_name = answer.text || '';
        }
        // Last name field (ref: a066a88a-34ea-4df9-8704-0e9ab4d5355d)
        else if (answer.field?.ref === 'a066a88a-34ea-4df9-8704-0e9ab4d5355d') {
          parsedData.last_name = answer.text || '';
        }
        break;

      case 'email':
        parsedData.email = answer.email || '';
        break;

      case 'phone_number':
        parsedData.phone = answer.phone_number || null;
        break;

      case 'choice':
        // "When did you last disconnect for 24 hours?" (ref: 415d1d03-5b6d-4c80-843f-0e97cb3120f7)
        if (answer.field?.ref === '415d1d03-5b6d-4c80-843f-0e97cb3120f7') {
          parsedData.last_disconnect = answer.choice?.label || null;
        }
        // "When did you last hear only natural sounds?" (ref: 7786a74e-fd9e-4d14-8862-91ae0a63768e)
        else if (answer.field?.ref === '7786a74e-fd9e-4d14-8862-91ae0a63768e') {
          parsedData.natural_sounds = answer.choice?.label || null;
        }
        // "What Best Describes You?" (ref: 25d94dab-a725-442a-85e4-f5a2a4e55e41)
        else if (answer.field?.ref === '25d94dab-a725-442a-85e4-f5a2a4e55e41') {
          parsedData.describes_you = answer.choice?.label || null;
        }
        break;
    }
  });

  // Return structured data for Supabase insert
  return {
    json: parsedData
  };
});

// Output the processed items
return processedItems;

// =============================================================================
// ALTERNATIVE: Direct HTTP Request to Supabase (if not using Supabase node)
// =============================================================================

/*
 * If you prefer to make a direct HTTP request instead of using the Supabase node,
 * use this code in a "Code" node and add an "HTTP Request" node after it.
 */

/*
const items = $input.all();

const processedItems = items.map(item => {
  const webhookData = item.json;
  const formResponse = webhookData.form_response || webhookData.body?.form_response;

  if (!formResponse) {
    throw new Error('No form_response found in webhook data');
  }

  const answers = formResponse.answers || [];
  const hidden = formResponse.hidden || {};

  const parsedData = {
    typeform_response_id: formResponse.token,
    typeform_form_id: formResponse.form_id,
    submitted_at: formResponse.submitted_at,
    landed_at: formResponse.landed_at,
    first_name: '',
    last_name: '',
    email: '',
    phone: null,
    last_disconnect: null,
    natural_sounds: null,
    describes_you: null,
    utm_source: hidden.utm_source || null,
    utm_medium: hidden.utm_medium || null,
    utm_campaign: hidden.utm_campaign || null,
    utm_content: hidden.utm_content || null,
    utm_term: hidden.utm_term || null
  };

  answers.forEach(answer => {
    const fieldType = answer.type;

    switch (fieldType) {
      case 'text':
        if (answer.field?.ref === 'b7bed83b-7ce1-494d-a23c-6e20b2f0fa55') {
          parsedData.first_name = answer.text || '';
        } else if (answer.field?.ref === 'a066a88a-34ea-4df9-8704-0e9ab4d5355d') {
          parsedData.last_name = answer.text || '';
        }
        break;

      case 'email':
        parsedData.email = answer.email || '';
        break;

      case 'phone_number':
        parsedData.phone = answer.phone_number || null;
        break;

      case 'choice':
        if (answer.field?.ref === '415d1d03-5b6d-4c80-843f-0e97cb3120f7') {
          parsedData.last_disconnect = answer.choice?.label || null;
        } else if (answer.field?.ref === '7786a74e-fd9e-4d14-8862-91ae0a63768e') {
          parsedData.natural_sounds = answer.choice?.label || null;
        } else if (answer.field?.ref === '25d94dab-a725-442a-85e4-f5a2a4e55e41') {
          parsedData.describes_you = answer.choice?.label || null;
        }
        break;
    }
  });

  // Prepare Supabase insert request
  return {
    json: {
      method: 'POST',
      url: `${SUPABASE_URL}/rest/v1/webinar_registrants`,
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: parsedData
    }
  };
});

return processedItems;
*/

// =============================================================================
// FIELD REFERENCE GUIDE (from your Typeform)
// =============================================================================

/*
 * Field References (for mapping answers):
 *
 * First name:     b7bed83b-7ce1-494d-a23c-6e20b2f0fa55 (short_text)
 * Last name:      a066a88a-34ea-4df9-8704-0e9ab4d5355d (short_text)
 * Phone number:   3c579037-f275-4691-b3eb-92e9afafb945 (phone_number)
 * Email:          41c2d917-5e40-489f-9482-889d637e2abd (email)
 *
 * Q1 - Disconnect period:       415d1d03-5b6d-4c80-843f-0e97cb3120f7 (multiple_choice)
 * Q2 - Natural sounds:          7786a74e-fd9e-4d14-8862-91ae0a63768e (multiple_choice)
 * Q3 - Describes you:           25d94dab-a725-442a-85e4-f5a2a4e55e41 (dropdown)
 */
