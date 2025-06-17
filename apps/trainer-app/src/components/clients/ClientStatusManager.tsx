'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@fituno/ui';
import {
  Archive,
  ArrowLeftRight,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Pause,
  Play,
  Settings,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

type ClientStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'PAUSED' | 'TRANSFERRED' | 'ARCHIVED';

interface Client {
  id: string;
  email: string;
  full_name: string;
  status: ClientStatus;
  current_trainer_id?: string;
  trainer_name?: string;
  created_at: string;
  updated_at: string;
}

interface ClientStatusManagerProps {
  client: Client;
  onStatusChange?: (newStatus: ClientStatus) => void;
  onTransfer?: (newTrainerId: string) => void;
  onDelete?: () => void;
  currentUserId: string;
  availableTrainers?: Array<{ id: string; name: string; email: string }>;
}

export function ClientStatusManager({
  client,
  onStatusChange,
  onTransfer,
  onDelete,
  currentUserId,
  availableTrainers = [],
}: ClientStatusManagerProps) {
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ClientStatus>(client.status);
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [loading, setLoading] = useState(false);

  const statusConfig = {
    PENDING: {
      label: 'Pendente',
      description: 'Cliente ainda não completou anamnese',
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock,
    },
    ACTIVE: {
      label: 'Ativo',
      description: 'Cliente ativo com treinos regulares',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle,
    },
    INACTIVE: {
      label: 'Inativo',
      description: 'Cliente temporariamente inativo',
      color: 'bg-gray-100 text-gray-800',
      icon: Pause,
    },
    PAUSED: {
      label: 'Pausado',
      description: 'Conta pausada temporariamente',
      color: 'bg-blue-100 text-blue-800',
      icon: Pause,
    },
    TRANSFERRED: {
      label: 'Transferido',
      description: 'Cliente transferido para outro trainer',
      color: 'bg-purple-100 text-purple-800',
      icon: ArrowLeftRight,
    },
    ARCHIVED: {
      label: 'Arquivado',
      description: 'Cliente arquivado (soft delete)',
      color: 'bg-red-100 text-red-800',
      icon: Archive,
    },
  };

  const handleStatusChange = async () => {
    if (selectedStatus === client.status) {
      setShowStatusDialog(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/v1/clients/${client.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: selectedStatus,
          reason: statusReason,
          changed_by: currentUserId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update client status');
      }

      onStatusChange?.(selectedStatus);
      setShowStatusDialog(false);
      setStatusReason('');
    } catch (error) {
      console.error('Error updating client status:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedTrainer) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/v1/clients/${client.id}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_trainer_id: selectedTrainer,
          reason: transferReason,
          transferred_by: currentUserId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to transfer client');
      }

      onTransfer?.(selectedTrainer);
      setShowTransferDialog(false);
      setSelectedTrainer('');
      setTransferReason('');
    } catch (error) {
      console.error('Error transferring client:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/clients/${client.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          soft_delete: true,
          deleted_by: currentUserId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete client');
      }

      onDelete?.();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting client:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStatusBadge = () => {
    const config = statusConfig[client.status];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gerenciar Cliente</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Ações
                <MoreHorizontal className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={e => e.preventDefault()}>
                    <Play className="h-4 w-4 mr-2" />
                    Alterar Status
                  </DropdownMenuItem>
                </DialogTrigger>
              </Dialog>

              <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={e => e.preventDefault()}>
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Transferir Cliente
                  </DropdownMenuItem>
                </DialogTrigger>
              </Dialog>

              <DropdownMenuSeparator />

              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Arquivar Cliente
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
        <CardDescription>Gerencie o status e configurações do cliente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Status Atual</Label>
            <p className="text-sm text-muted-foreground">
              {statusConfig[client.status].description}
            </p>
          </div>
          {getCurrentStatusBadge()}
        </div>

        {/* Trainer Info */}
        <div>
          <Label className="text-sm font-medium">Trainer Responsável</Label>
          <p className="text-sm text-muted-foreground">{client.trainer_name || 'Não atribuído'}</p>
        </div>

        {/* Last Updated */}
        <div>
          <Label className="text-sm font-medium">Última Atualização</Label>
          <p className="text-sm text-muted-foreground">
            {new Date(client.updated_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </CardContent>

      {/* Status Change Dialog */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar Status do Cliente</DialogTitle>
          <DialogDescription>Selecione o novo status para {client.full_name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="status">Novo Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value: ClientStatus) => setSelectedStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusConfig).map(([status, config]) => {
                  const Icon = config.icon;
                  return (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-2" />
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="reason">Motivo da Alteração</Label>
            <Textarea
              id="reason"
              placeholder="Descreva o motivo desta alteração de status..."
              value={statusReason}
              onChange={e => setStatusReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowStatusDialog(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleStatusChange}
            disabled={loading || selectedStatus === client.status}
          >
            {loading ? 'Atualizando...' : 'Atualizar Status'}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Transfer Dialog */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transferir Cliente</DialogTitle>
          <DialogDescription>Transfira {client.full_name} para outro trainer</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="trainer">Novo Trainer</Label>
            <Select value={selectedTrainer} onValueChange={setSelectedTrainer}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um trainer" />
              </SelectTrigger>
              <SelectContent>
                {availableTrainers.map(trainer => (
                  <SelectItem key={trainer.id} value={trainer.id}>
                    <div>
                      <div className="font-medium">{trainer.name}</div>
                      <div className="text-sm text-muted-foreground">{trainer.email}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="transfer-reason">Motivo da Transferência</Label>
            <Textarea
              id="transfer-reason"
              placeholder="Descreva o motivo desta transferência..."
              value={transferReason}
              onChange={e => setTransferReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowTransferDialog(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleTransfer} disabled={loading || !selectedTrainer}>
            {loading ? 'Transferindo...' : 'Transferir Cliente'}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Arquivar Cliente</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja arquivar {client.full_name}? Esta ação irá:
            <br />
            • Mover o cliente para a lista de arquivados
            <br />
            • Pausar todos os treinos ativos
            <br />
            • Manter histórico para auditoria
            <br />
            <br />
            Esta ação pode ser revertida posteriormente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSoftDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Arquivando...' : 'Arquivar Cliente'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </Card>
  );
}
