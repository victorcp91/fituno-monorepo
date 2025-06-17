'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@fituno/ui';
import { Eye, MessageCircle, MoreHorizontal, Plus, Search, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { ClientInvitationDialog } from '../../../components/clients/ClientInvitationDialog';

interface Client {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  timezone: string;
  language: string;
  current_trainer_id?: string;
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
  latest_anamnesis_id?: string;
  measurement_system: 'METRIC' | 'IMPERIAL';
  created_at: string;
  updated_at: string;
}

interface ClientsResponse {
  clients: Client[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showInvitationDialog, setShowInvitationDialog] = useState(false);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/v1/clients?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }

      const data: ClientsResponse = await response.json();
      setClients(data.clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleInvitationSuccess = () => {
    setShowInvitationDialog(false);
    fetchClients(); // Refresh the list
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Ativo
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Sem Anamnese
          </Badge>
        );
      case 'INACTIVE':
        return <Badge variant="destructive">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Lista de Clientes</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie seus clientes, visualize detalhes e crie novas séries
            </p>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Cliente
          </Button>
        </div>

        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Lista de Clientes</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie seus clientes, visualize detalhes e crie novas séries
          </p>
        </div>
        <Button onClick={() => setShowInvitationDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Cliente
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-[200px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os status</SelectItem>
            <SelectItem value="ACTIVE">Ativo</SelectItem>
            <SelectItem value="PENDING">Sem Anamnese</SelectItem>
            <SelectItem value="INACTIVE">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Clientes ({clients.length})
          </CardTitle>
          <CardDescription>Lista dos seus clientes cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter
                  ? 'Tente ajustar os filtros para encontrar clientes.'
                  : 'Comece adicionando seu primeiro cliente.'}
              </p>
              {!searchTerm && !statusFilter && (
                <Button onClick={() => setShowInvitationDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Cliente
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Série Atual</TableHead>
                    <TableHead>Último Treino</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map(client => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <input type="checkbox" className="rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={client.avatar_url} alt={client.full_name} />
                            <AvatarFallback>{getInitials(client.full_name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{client.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date().getFullYear() - new Date(client.created_at).getFullYear()}{' '}
                              anos
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{client.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {client.timezone?.replace('_', ' ') || 'Não informado'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {client.status === 'ACTIVE' ? 'Treino A/B/C' : 'Sem série ativa'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {client.status === 'ACTIVE' ? 'Válido até 30/06/2025' : ''}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            {client.status === 'ACTIVE' ? 'Hoje, 08:30' : 'Nunca treinou'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {clients.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando 1 a {clients.length} de {clients.length} resultados
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled>
              Próximo
            </Button>
          </div>
        </div>
      )}

      {/* Client Invitation Dialog */}
      <ClientInvitationDialog
        open={showInvitationDialog}
        onOpenChange={setShowInvitationDialog}
        onSuccess={handleInvitationSuccess}
      />
    </div>
  );
}
