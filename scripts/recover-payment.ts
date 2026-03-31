// Script to manually recover a payment that failed during verification
// Run with: npx tsx --env-file=.env.local scripts/recover-payment.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function recoverPayment() {
  const enrollmentId = '37ea4992-ae16-431c-aca8-cf9ebfbd17f7';
  const razorpayPaymentId = 'pay_SWMxQKAb3pUpFy';
  const razorpayOrderId = 'order_SWMwjMOvOZSdDG';

  console.log('🔄 Recovering payment for enrollment:', enrollmentId);

  // 1. Get enrollment details
  const { data: enrollment, error: enrollError } = await supabase
    .from('enrollments')
    .select(`
      *,
      programs(name, duration_weeks, price, currency),
      coaches(full_name, whatsapp_number, checkin_day)
    `)
    .eq('id', enrollmentId)
    .single();

  if (enrollError || !enrollment) {
    console.error('❌ Enrollment not found:', enrollError);
    return;
  }

  console.log('✓ Found enrollment:', enrollment.programs?.name);
  console.log('✓ Coach:', enrollment.coaches?.full_name);

  // 2. Use the client data from the order notes (from the Razorpay info you provided)
  const clientData = {
    full_name: 'Ashok Verma', // Replace with actual client name if different
    whatsapp_number: '+917738363495', // Replace with actual client number
    email: 'ashok@example.com', // Replace with actual client email
    age: 30, // Replace with actual age
    primary_goal: 'Overall Fitness', // Replace with actual goal
    health_notes: '',
  };

  console.log('⚠️  Using client data:', clientData.full_name);
  console.log('   (Update these values in the script if incorrect)');

  const coach = enrollment.coaches as any;
  const program = enrollment.programs as any;

  // 3. Check if client already exists
  const { data: existingClient } = await supabase
    .from('clients')
    .select('id')
    .eq('whatsapp_number', clientData.whatsapp_number)
    .eq('coach_id', enrollment.coach_id)
    .single();

  let clientId: string;

  if (existingClient) {
    clientId = existingClient.id;
    console.log('✓ Existing client found:', clientId);
  } else {
    // 4. Create client record
    const { data: newClient, error: clientError } = await supabase
      .from('clients')
      .insert({
        coach_id: enrollment.coach_id,
        full_name: clientData.full_name,
        whatsapp_number: clientData.whatsapp_number,
        email: clientData.email,
        age: clientData.age,
        primary_goal: clientData.primary_goal,
        health_notes: clientData.health_notes || null,
        status: 'active',
      })
      .select()
      .single();

    if (clientError || !newClient) {
      console.error('❌ Failed to create client:', clientError);
      return;
    }

    clientId = newClient.id;
    console.log('✓ Created client:', clientId);
  }

  // 5. Update enrollment
  const { error: updateError } = await supabase
    .from('enrollments')
    .update({
      client_id: clientId,
      status: 'active',
      gateway_payment_id: razorpayPaymentId,
      payment_gateway: 'razorpay',
    })
    .eq('id', enrollmentId);

  if (updateError) {
    console.error('❌ Failed to update enrollment:', updateError);
    return;
  }

  console.log('✓ Updated enrollment to active');

  // 6. Record payment
  const { error: paymentError } = await supabase.from('payments').insert({
    coach_id: enrollment.coach_id,
    client_id: clientId,
    enrollment_id: enrollmentId,
    amount: enrollment.amount_paid,
    currency: enrollment.currency,
    payment_type: 'new',
    gateway_payment_id: razorpayPaymentId,
    gateway_order_id: razorpayOrderId,
    payment_gateway: 'razorpay',
    gateway_payment_status: 'captured',
    paid_at: new Date().toISOString(),
  });

  if (paymentError) {
    console.error('❌ Failed to record payment:', paymentError);
    return;
  }

  console.log('✓ Recorded payment:', razorpayPaymentId);

  console.log('\n✅ Recovery complete!');
  console.log('   Client ID:', clientId);
  console.log('   Enrollment ID:', enrollmentId);
  console.log('   Payment ID:', razorpayPaymentId);
  console.log('\n📱 WhatsApp messages were NOT sent.');
  console.log('   To send them manually, check the dashboard or contact the client.');
}

recoverPayment().catch(console.error);