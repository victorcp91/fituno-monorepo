'use client';

import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@fituno/ui';
import { AlertCircle, CheckCircle, Copy, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useSubscription } from '../../hooks/useSubscription';

interface ClientInvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface InvitationFormData {
  email: string;
  full_name: string;
  age: string;
  city: string;
  timezone: string;
}

interface InvitationResponse {
  success: boolean;
  invitation: {
    id: string;
    email: string;
    token: string;
    status: string;
    expires_at: string;
    invitation_url: string;
  };
}

const TIMEZONE_OPTIONS = [
  { value: 'America/Sao_Paulo', label: 'São Paulo, Brasil (GMT-3)' },
  { value: 'America/New_York', label: 'Nova York, EUA (GMT-5)' },
  { value: 'Europe/London', label: 'Londres, Reino Unido (GMT+0)' },
  { value: 'Europe/Paris', label: 'Paris, França (GMT+1)' },
  { value: 'Asia/Tokyo', label: 'Tóquio, Japão (GMT+9)' },
];

export function ClientInvitationDialog({
  open,
  onOpenChange,
  onSuccess,
}: ClientInvitationDialogProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [invitationResult, setInvitationResult] = useState<InvitationResponse['invitation'] | null>(
    null
  );
  const [formData, setFormData] = useState<InvitationFormData>({
    email: '',
    full_name: '',
    age: '',
    city: '',
    timezone: 'America/Sao_Paulo',
  });

  const { subscription, canAddClient } = useSubscription();

  const resetDialog = () => {
    setStep('form');
    setFormData({
      email: '',
      full_name: '',
      age: '',
      city: '',
      timezone: 'America/Sao_Paulo',
    });
    setError('');
    setInvitationResult(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetDialog();
    }
    onOpenChange(newOpen);
  };

  const handleInputChange = (field: keyof InvitationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.full_name) {
      setError('E-mail e nome completo são obrigatórios');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Por favor, insira um e-mail válido');
      return false;
    }

    if (formData.full_name.trim().length < 2) {
      setError('Nome completo deve ter pelo menos 2 caracteres');
      return false;
    }

    if (formData.age && (parseInt(formData.age) < 16 || parseInt(formData.age) > 100)) {
      setError('Idade deve estar entre 16 e 100 anos');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Check if trainer can add more clients
    if (!canAddClient) {
      setError(
        'Você atingiu o limite de clientes do seu plano. Faça upgrade para adicionar mais clientes.'
      );
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/v1/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar convite');
      }

      const result: InvitationResponse = await response.json();
      setInvitationResult(result.invitation);
      setStep('success');
    } catch (err) {
      console.error('Error creating invitation:', err);
      setError(err instanceof Error ? err.message : 'Erro inesperado ao criar convite');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInvitationUrl = async () => {
    if (invitationResult?.invitation_url) {
      try {
        await navigator.clipboard.writeText(invitationResult.invitation_url);
        // TODO: Show success toast
      } catch (error) {
        console.error('Failed to copy URL:', error);
        // TODO: Show error toast
      }
    }
  };

  const handleFinish = () => {
    resetDialog();
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  1
                </div>
                Cadastrar novo cliente
                <Badge variant="secondary">Dados Pessoais</Badge>
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do cliente para enviar um convite de cadastro.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!canAddClient && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Você atingiu o limite de {subscription?.clientLimit || 2} clientes do seu plano.
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium text-destructive underline ml-1"
                    >
                      Faça upgrade
                    </Button>{' '}
                    para adicionar mais clientes.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="full_name">Nome completo*</Label>
                  <Input
                    id="full_name"
                    placeholder="Ex: Maria Silva"
                    value={formData.full_name}
                    onChange={e => handleInputChange('full_name', e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="email">E-mail*</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ex: maria@email.com"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Ex: 28"
                    value={formData.age}
                    onChange={e => handleInputChange('age', e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="city">Cidade/País</Label>
                  <Input
                    id="city"
                    placeholder="Ex: São Paulo, Brasil"
                    value={formData.city}
                    onChange={e => handleInputChange('city', e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={value => handleInputChange('timezone', value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fuso horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONE_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Detectado automaticamente com base na localização
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={loading || !canAddClient}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Próximo'
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Convite enviado com sucesso!
              </DialogTitle>
              <DialogDescription>
                O cliente receberá um e-mail com as instruções para completar o cadastro.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Card className="p-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Cliente</Label>
                    <p className="text-sm">{formData.full_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">E-mail</Label>
                    <p className="text-sm">{formData.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Aguardando aceite
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Expira em</Label>
                    <p className="text-sm">
                      {invitationResult
                        ? new Date(invitationResult.expires_at).toLocaleDateString('pt-BR')
                        : ''}
                    </p>
                  </div>
                </div>
              </Card>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Link de convite</Label>
                <div className="flex gap-2">
                  <Input
                    value={invitationResult?.invitation_url || ''}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button variant="outline" size="sm" onClick={handleCopyInvitationUrl}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Você pode compartilhar este link diretamente com o cliente
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleFinish} className="w-full">
                Concluir
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
