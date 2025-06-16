'use client';

import {
  AlertCircle,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  Receipt,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  hosted_invoice_url?: string;
  invoice_pdf?: string;
  description?: string;
  paid: boolean;
  subscription: string;
  period_start: number;
  period_end: number;
}

interface BillingHistoryProps {
  customerId?: string;
}

export function BillingHistory({ customerId }: BillingHistoryProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!customerId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/v1/subscriptions/invoices?customerId=${customerId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }

        const data = await response.json();
        setInvoices(data.invoices || []);
      } catch (err) {
        console.error('Error fetching invoices:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [customerId]);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string, paid: boolean) => {
    if (paid) {
      return (
        <Badge variant="default" className="bg-green-500">
          Paid
        </Badge>
      );
    }

    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'open':
        return <Badge variant="outline">Pending</Badge>;
      case 'paid':
        return (
          <Badge variant="default" className="bg-green-500">
            Paid
          </Badge>
        );
      case 'uncollectible':
        return <Badge variant="destructive">Failed</Badge>;
      case 'void':
        return <Badge variant="secondary">Void</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const downloadInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/v1/subscriptions/invoice/${invoiceId}/download`);

      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5" />
            <span>Billing History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5" />
            <span>Billing History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>Error loading billing history: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Receipt className="h-5 w-5" />
          <span>Billing History</span>
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          View and download your past invoices and receipts.
        </p>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No billing history</h3>
            <p className="text-gray-600">
              Your invoices will appear here once you have an active subscription.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map(invoice => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {formatAmount(invoice.amount, invoice.currency)}
                      </span>
                      {getStatusBadge(invoice.status, invoice.paid)}
                    </div>

                    <div className="text-sm text-gray-600 flex items-center space-x-4 mt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(invoice.created)}</span>
                      </span>

                      {invoice.period_start && invoice.period_end && (
                        <span className="text-xs">
                          Service: {formatDate(invoice.period_start)} -{' '}
                          {formatDate(invoice.period_end)}
                        </span>
                      )}
                    </div>

                    {invoice.description && (
                      <p className="text-xs text-gray-500 mt-1">{invoice.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {invoice.hosted_invoice_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(invoice.hosted_invoice_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  )}

                  {invoice.invoice_pdf && (
                    <Button variant="outline" size="sm" onClick={() => downloadInvoice(invoice.id)}>
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment Method Information */}
        {invoices.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CreditCard className="h-4 w-4" />
                <span>Payment method charges appear as "FITUNO" on your statement</span>
              </div>

              <Button variant="outline" size="sm">
                Manage Payment Methods
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
