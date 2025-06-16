import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '../../../../../lib/services/stripe';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    const stripeService = new StripeService();
    const invoices = await stripeService.getCustomerInvoices(customerId);

    return NextResponse.json({
      success: true,
      invoices,
    });
  } catch {

    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}
