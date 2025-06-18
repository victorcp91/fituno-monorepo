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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import {
  Activity,
  Calendar,
  Clock,
  Download,
  Eye,
  Filter,
  Grid3X3,
  List,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  SortAsc,
  SortDesc,
  Target,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
  UserX,
} from 'lucide-react';
import Link from 'next/link';
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
  // Mock metrics - these would come from the API in real implementation
  total_workouts?: number;
  last_workout_date?: string | null;
  current_streak?: number;
  progress_score?: number;
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

type ViewMode = 'list' | 'grid';
type SortField = 'name' | 'created_at' | 'last_activity' | 'status';
type SortOrder = 'asc' | 'desc';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
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

      params.append('sort_field', sortField);
      params.append('sort_order', sortOrder);

      const response = await fetch(`/api/v1/clients?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }

      const data: ClientsResponse = await response.json();

      // Add mock metrics for demonstration
      const clientsWithMetrics = data.clients.map(client => ({
        ...client,
        total_workouts: Math.floor(Math.random() * 50) + 5,
        last_workout_date:
          client.status === 'ACTIVE'
            ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            : null,
        current_streak: client.status === 'ACTIVE' ? Math.floor(Math.random() * 15) + 1 : 0,
        progress_score: client.status === 'ACTIVE' ? Math.floor(Math.random() * 40) + 60 : 0,
      }));

      setClients(clientsWithMetrics);
    } catch {
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, sortField, sortOrder]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleInvitationSuccess = () => {
    setShowInvitationDialog(false);
    fetchClients(); // Refresh the list
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectClient = (clientId: string) => {
    setSelectedClients(prev =>
      prev.includes(clientId) ? prev.filter(id => id !== clientId) : [...prev, clientId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map(client => client.id));
    }
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

  const formatLastWorkout = (date: string | null | undefined) => {
    if (!date) return 'Nunca treinou';

    const diffTime = Math.abs(new Date().getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Ontem';
    if (diffDays === 0) return 'Hoje';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return `${Math.floor(diffDays / 30)} meses atrás`;
  };

  const getMetricsData = () => {
    const total = clients.length;
    const active = clients.filter(c => c.status === 'ACTIVE').length;
    const pending = clients.filter(c => c.status === 'PENDING').length;
    const avgWorkouts = clients.reduce((sum, c) => sum + (c.total_workouts || 0), 0) / total || 0;

    return { total, active, pending, avgWorkouts };
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const metricsData = getMetricsData();

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
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowInvitationDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Convidar Cliente
          </Button>
          <Button onClick={() => setShowInvitationDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Cliente
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Clientes</p>
                <p className="text-2xl font-bold">{metricsData.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clientes Ativos</p>
                <p className="text-2xl font-bold">{metricsData.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aguardando Anamnese</p>
                <p className="text-2xl font-bold">{metricsData.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Média de Treinos</p>
                <p className="text-2xl font-bold">{metricsData.avgWorkouts.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort('name')}>
                Nome
                {sortField === 'name' &&
                  (sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4 ml-2" />
                  ) : (
                    <SortDesc className="h-4 w-4 ml-2" />
                  ))}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('created_at')}>
                Data de Cadastro
                {sortField === 'created_at' &&
                  (sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4 ml-2" />
                  ) : (
                    <SortDesc className="h-4 w-4 ml-2" />
                  ))}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('last_activity')}>
                Última Atividade
                {sortField === 'last_activity' &&
                  (sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4 ml-2" />
                  ) : (
                    <SortDesc className="h-4 w-4 ml-2" />
                  ))}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('status')}>
                Status
                {sortField === 'status' &&
                  (sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4 ml-2" />
                  ) : (
                    <SortDesc className="h-4 w-4 ml-2" />
                  ))}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          {selectedClients.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedClients.length} selecionado(s)
              </span>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Remover
              </Button>
            </div>
          )}

          <div className="flex border rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'list' ? (
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
                      <TableHead className="w-[50px]">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedClients.length === clients.length}
                          onChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Métricas</TableHead>
                      <TableHead>Último Treino</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map(client => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={selectedClients.includes(client.id)}
                            onChange={() => handleSelectClient(client.id)}
                          />
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
                                Membro desde{' '}
                                {new Date(client.created_at).toLocaleDateString('pt-BR')}
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
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Target className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{client.total_workouts || 0} treinos</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Activity className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">
                                {client.current_streak || 0} dias seguidos
                              </span>
                            </div>
                            {client.progress_score && (
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs">{client.progress_score}% progresso</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{formatLastWorkout(client.last_workout_date)}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Link href={`/clients/${client.id}`}>
                              <Button variant="ghost" size="sm" title="Ver perfil">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" title="Enviar mensagem">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/clients/${client.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver perfil
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Enviar mensagem
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Criar treino
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <UserX className="h-4 w-4 mr-2" />
                                  Desativar cliente
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clients.map(client => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={client.avatar_url} alt={client.full_name} />
                      <AvatarFallback>{getInitials(client.full_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{client.full_name}</h3>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedClients.includes(client.id)}
                    onChange={() => handleSelectClient(client.id)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {getStatusBadge(client.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Treinos</p>
                      <p className="font-semibold">{client.total_workouts || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sequência</p>
                      <p className="font-semibold">{client.current_streak || 0} dias</p>
                    </div>
                  </div>

                  {client.progress_score && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-semibold">{client.progress_score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${client.progress_score}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Último treino</p>
                    <p className="text-sm font-medium">
                      {formatLastWorkout(client.last_workout_date)}
                    </p>
                  </div>

                  <div className="flex justify-between pt-3 border-t">
                    <Link href={`/clients/${client.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" />
                          Criar treino
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Activity className="h-4 w-4 mr-2" />
                          Ver progresso
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <UserX className="h-4 w-4 mr-2" />
                          Desativar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
