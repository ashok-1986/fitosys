import 'server-only';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { InvoicePDF, InvoiceDataProps } from '@/components/pdf/InvoicePDF';
import { createServiceClient } from '@/lib/supabase/server';

export async function generateInvoiceNumber(): Promise<string> {
    const supabase = await createServiceClient();
    const year = new Date().getFullYear();

    const { count, error } = await supabase
        .from('gst_invoices')
        .select('*', { count: 'exact', head: true })
        .gte('invoice_date', `${year}-01-01`);

    if (error) {
        throw new Error('Failed to fetch invoice count');
    }

    const seq = String((count || 0) + 1).padStart(6, '0');
    return `FIT-${year}-${seq}`;
}

export async function generateGSTInvoice(
    data: Omit<InvoiceDataProps, 'invoiceNumber'> & {
        coachId: string;
        clientId: string;
        enrollmentId: string | null;
        paymentId: string;
    }
): Promise<string> {
    const supabase = await createServiceClient();
    const invoiceNumber = await generateInvoiceNumber();

    const pdfProps: InvoiceDataProps = {
        ...data,
        invoiceNumber
    };

    // 1. Render PDF to buffer
    const pdfBuffer = await renderToBuffer(React.createElement(InvoicePDF, { data: pdfProps }) as any);

    // 2. Upload to Supabase Storage
    const path = `invoices/${data.coachId}/${invoiceNumber}.pdf`;

    const { error: uploadError } = await supabase.storage
        .from('invoices')
        .upload(path, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true
        });

    if (uploadError) {
        console.error('[Invoice Gen] Storage Upload Failed:', uploadError);
        throw new Error('Failed to upload invoice to storage');
    }

    // 3. Get public URL
    const { data: urlData } = supabase.storage.from('invoices').getPublicUrl(path);

    // 4. Create gst_invoices record
    const { error: dbError } = await supabase.from('gst_invoices').insert({
        coach_id: data.coachId,
        client_id: data.clientId,
        enrollment_id: data.enrollmentId,
        payment_id: data.paymentId,
        invoice_number: invoiceNumber,
        invoice_date: data.invoiceDate,
        seller_name: data.seller.name,
        seller_gstin: data.seller.gstin || null,
        seller_address: data.seller.address,
        buyer_name: data.buyer.name,
        buyer_email: data.buyer.email,
        buyer_gstin: data.buyer.gstin || null,
        item_description: data.item.description,
        amount_before_tax: data.item.amountBeforeTax,
        gst_rate: data.tax.rate,
        cgst_amount: data.tax.cgst || null,
        sgst_amount: data.tax.sgst || null,
        igst_amount: data.tax.igst || null,
        total_amount: data.totalAmount,
        currency: 'INR',
        pdf_url: urlData.publicUrl,
        sent_to_client: false, // Will be updated when actually sent
        sent_to_coach: false,
    });

    if (dbError) {
        console.error('[Invoice Gen] Database Insert Failed:', dbError);
        // We'll return the url regardless, but it's not ideal if the record fails to create
    }

    // 5. TODO: Send via Resend/Email as defined in spec
    // await sendInvoiceEmails(data, urlData.publicUrl);

    return urlData.publicUrl;
}
