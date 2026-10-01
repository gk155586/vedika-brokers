// Supabase Edge Function: verify-payment
// Cryptographically verifies Razorpay signature server-side, updates payment, and unlocks address

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.2';
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function createHmacSha256(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, msgData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || '';

    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, property_id } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !property_id) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Cryptographic validation: HMAC-SHA256(order_id + "|" + payment_id, secret)
    const expectedSignature = await createHmacSha256(
      razorpayKeySecret,
      `${razorpay_order_id}|${razorpay_payment_id}`
    );

    if (expectedSignature !== razorpay_signature) {
      // Record failed transaction attempt
      await supabase.from('payments').update({
        status: 'failed',
        razorpay_payment_id,
        updated_at: new Date().toISOString(),
      }).eq('razorpay_order_id', razorpay_order_id);

      return new Response(JSON.stringify({ error: 'Invalid payment signature' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update payment record to 'paid'
    const { data: paymentRecord } = await supabase.from('payments').update({
      status: 'paid',
      razorpay_payment_id,
      razorpay_signature,
      updated_at: new Date().toISOString(),
    }).eq('razorpay_order_id', razorpay_order_id).select().single();

    // Create property unlock record (Idempotent: ON CONFLICT DO NOTHING)
    await supabase.from('property_unlocks').upsert({
      user_id: user.id,
      property_id: property_id,
      payment_id: paymentRecord?.id,
      unlocked_at: new Date().toISOString(),
    }, { onConflict: 'user_id,property_id' });

    // Increment unlocks counter on property
    await supabase.rpc('increment_property_unlocks', { prop_id: property_id });

    // Send notification to user
    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Property Address Unlocked!',
      message: 'You have successfully unlocked the complete address for ₹1,000. You can now schedule a visit.',
      link: `/property/${property_id}`,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Address unlocked successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
