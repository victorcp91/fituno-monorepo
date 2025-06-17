'use client';

import { Check, Star, Zap } from 'lucide-react';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@fituno/ui';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  clientsLimit: number;
  features: string[];
  popular?: boolean;
  description: string;
}

interface PricingPlansProps {
  plans?: Plan[];
  currentPlanId?: string;
  isLoading?: boolean;
  onSelectPlan?: (planId: string) => void;
}

const defaultPlans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 2900, // R$ 29.00 in cents
    interval: 'month',
    clientsLimit: 10,
    description: 'Perfeito para personal trainers iniciantes',
    features: [
      'Até 10 clientes',
      'Criação de treinos personalizados',
      'Acompanhamento básico de progresso',
      'Suporte por email',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 4900, // R$ 49.00 in cents
    interval: 'month',
    clientsLimit: 30,
    popular: true,
    description: 'Para trainers que querem crescer seu negócio',
    features: [
      'Até 30 clientes',
      'Criação de treinos avançados',
      'Relatórios detalhados de progresso',
      'Agendamento de sessões',
      'Nutrição básica',
      'Suporte prioritário',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 7900, // R$ 79.00 in cents
    interval: 'month',
    clientsLimit: 100,
    description: 'Para academias e grandes estúdios',
    features: [
      'Até 100 clientes',
      'Todos os recursos Professional',
      'Planos nutricionais completos',
      'Analytics avançados',
      'API para integração',
      'Suporte 24/7',
      'Treinamento e onboarding',
    ],
  },
];

export function PricingPlans({
  plans = defaultPlans,
  currentPlanId,
  isLoading = false,
  onSelectPlan,
}: PricingPlansProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount / 100);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded w-1/2" />
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded" />
                ))}
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Escolha o plano ideal para você</h2>
        <p className="text-lg text-gray-600 mt-2">
          Todos os planos incluem 7 dias grátis para testar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => {
          const isCurrentPlan = currentPlanId === plan.id;
          const isPopular = plan.popular;

          return (
            <Card
              key={plan.id}
              className={`relative ${isPopular ? 'border-orange-500 shadow-lg scale-105' : ''} ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-orange-500 hover:bg-orange-600">
                    <Star className="h-3 w-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Plano Atual
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{formatCurrency(plan.price)}</span>
                  <span className="text-gray-600">
                    /{plan.interval === 'month' ? 'mês' : 'ano'}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Zap className="h-4 w-4" />
                      Até {plan.clientsLimit} clientes
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    {isCurrentPlan ? (
                      <Button className="w-full" variant="outline" disabled>
                        Plano Atual
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => onSelectPlan?.(plan.id)}
                        variant={isPopular ? 'default' : 'outline'}
                      >
                        {currentPlanId ? 'Trocar para este plano' : 'Começar agora'}
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    7 dias grátis • Cancele a qualquer momento
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-600">
        <p>
          Todos os preços são em reais (BRL) e cobrados mensalmente.
          <br />
          Você pode cancelar ou alterar seu plano a qualquer momento.
        </p>
      </div>
    </div>
  );
}
