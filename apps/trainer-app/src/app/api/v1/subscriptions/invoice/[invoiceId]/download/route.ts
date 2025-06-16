import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '../../../../../../../lib/services/stripe';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await params;

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    const stripeService = new StripeService();

    // Get the invoice from Stripe
    const invoice = await stripeService.getInvoice(invoiceId);

    if (!invoice.invoice_pdf) {
      return NextResponse.json({ error: 'Invoice PDF not available' }, { status: 404 });
    }

    // Fetch the PDF from Stripe
    const response = await fetch(invoice.invoice_pdf);

    if (!response.ok) {
      throw new Error('Failed to fetch invoice PDF');
    }

    const pdfBuffer = await response.arrayBuffer();

    // Return the PDF as a download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoiceId}.pdf"`,
        'Content-Length': pdfBuffer.byteLength.toString(),
      },
    });
  } catch {

    return NextResponse.json({ error: 'Failed to download invoice' }, { status: 500 });
  }
}
