'use client';

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Settings,
  User,
  XCircle,
} from 'lucide-react';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@fituno/ui';

interface SubscriptionStatusCardProps {
  subscription?: {
    id: string;
    status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired';
    planName: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd?: boolean;
    clientsCount?: number;
    clientsLimit?: number;
    amount: number;
  };
  isLoading?: boolean;
}

export function SubscriptionStatusCard({
  subscription,
  isLoading = false,
}: SubscriptionStatusCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount / 100); // Assuming amount is in cents
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const getStatusInfo = (
    status: NonNullable<SubscriptionStatusCardProps['subscription']>['status']
  ) => {
    switch (status) {
      case 'active':
        return {
          label: 'Ativo',
          variant: 'default' as const,
          icon: CheckCircle,
          color: 'text-green-600',
        };
      case 'trialing':
        return {
          label: 'Período de Teste',
          variant: 'secondary' as const,
          icon: Clock,
          color: 'text-blue-600',
        };
      case 'past_due':
        return {
          label: 'Pagamento em Atraso',
          variant: 'destructive' as const,
          icon: AlertCircle,
          color: 'text-red-600',
        };
      case 'canceled':
        return {
          label: 'Cancelado',
          variant: 'secondary' as const,
          icon: XCircle,
          color: 'text-gray-600',
        };
      case 'incomplete':
        return {
          label: 'Incompleto',
          variant: 'destructive' as const,
          icon: AlertCircle,
          color: 'text-orange-600',
        };
      case 'incomplete_expired':
        return {
          label: 'Expirado',
          variant: 'destructive' as const,
          icon: XCircle,
          color: 'text-red-600',
        };
      default:
        return {
          label: 'Desconhecido',
          variant: 'secondary' as const,
          icon: AlertCircle,
          color: 'text-gray-600',
        };
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Status da Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Status da Assinatura
          </CardTitle>
          <CardDescription>Você ainda não possui uma assinatura ativa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Para começar a gerenciar seus clientes, você precisa de uma assinatura ativa.
            </p>
            <Button asChild>
              <a href="/dashboard/subscription/plans">Ver Planos Disponíveis</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusInfo = getStatusInfo(subscription.status);
  const StatusIcon = statusInfo.icon;

  const isExpiringSoon = () => {
    const endDate = new Date(subscription.currentPeriodEnd);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const daysUntilRenewal = () => {
    const endDate = new Date(subscription.currentPeriodEnd);
    const now = new Date();
    return Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Status da Assinatura
        </CardTitle>
        <CardDescription>Informações sobre seu plano atual</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status and Plan Info */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            </div>
            <p className="text-2xl font-bold">{subscription.planName}</p>
            <p className="text-lg text-gray-600">{formatCurrency(subscription.amount)}/mês</p>
          </div>
        </div>

        {/* Usage Info */}
        {subscription.clientsLimit && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Clientes
              </span>
              <span>
                {subscription.clientsCount || 0} de {subscription.clientsLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(((subscription.clientsCount || 0) / subscription.clientsLimit) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Billing Period */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            Período de Cobrança
          </div>
          <div className="text-sm">
            <p>
              <strong>Início:</strong> {formatDate(subscription.currentPeriodStart)}
            </p>
            <p>
              <strong>{subscription.cancelAtPeriodEnd ? 'Expira em:' : 'Próxima cobrança:'}</strong>{' '}
              {formatDate(subscription.currentPeriodEnd)}
            </p>
            {!subscription.cancelAtPeriodEnd && isExpiringSoon() && (
              <p className="text-orange-600 text-xs mt-1">
                ⚠️ Renovação em {daysUntilRenewal()} dias
              </p>
            )}
          </div>
        </div>

        {/* Cancellation Warning */}
        {subscription.cancelAtPeriodEnd && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-800 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Assinatura Cancelada</span>
            </div>
            <p className="text-orange-700 text-xs mt-1">
              Sua assinatura será encerrada em {formatDate(subscription.currentPeriodEnd)}. Você
              pode reativar a qualquer momento antes desta data.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard/subscription/plans" className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              Gerenciar Plano
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard/subscription" className="flex items-center gap-1">
              <CreditCard className="h-3 w-3" />
              Ver Faturas
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
