'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@fituno/ui';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Calendar,
  Clock,
  Dumbbell,
  Edit,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Target,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ClientStatusManager } from '../../../../components/clients/ClientStatusManager';

// Mock interfaces - these would come from @fituno/types in a real implementation
type ClientStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'PAUSED' | 'TRANSFERRED' | 'ARCHIVED';

interface Client {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  emergency_contact?: string;
  timezone: string;
  language: string;
  current_trainer_id?: string;
  trainer_name?: string;
  status: ClientStatus;
  latest_anamnesis_id?: string;
  measurement_system: 'METRIC' | 'IMPERIAL';
  created_at: string;
  updated_at: string;
  // Computed metrics
  total_workouts?: number;
  last_workout_date?: string | null;
  current_streak?: number;
  progress_score?: number;
  compliance_rate?: number;
  body_weight?: number;
  body_fat?: number;
  goals?: string[];
}

interface WorkoutPlan {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'paused';
  start_date: string;
  end_date?: string;
  total_sessions: number;
  completed_sessions: number;
  weekly_frequency: number;
}

interface AnamnesisData {
  id: string;
  completed_at: string;
  health_conditions?: string[];
  fitness_goals?: string[];
  exercise_experience?: string;
  preferences?: string[];
  restrictions?: string[];
}

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.clientId as string;

  const [client, setClient] = useState<Client | null>(null);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [anamnesisData, setAnamnesisData] = useState<AnamnesisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchClientData = useCallback(async () => {
    try {
      setLoading(true);

      // Mock client data for demonstration - in real app would fetch from API
      const mockClient: Client = {
        id: clientId,
        email: 'client@example.com',
        full_name: 'João Silva',
        avatar_url: '',
        phone: '+55 11 99999-9999',
        date_of_birth: '1990-05-15',
        address: 'São Paulo, SP',
        emergency_contact: 'Maria Silva - (11) 88888-8888',
        timezone: 'America/Sao_Paulo',
        language: 'pt-BR',
        status: 'ACTIVE',
        measurement_system: 'METRIC',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
        total_workouts: 45,
        last_workout_date: '2024-01-15T10:30:00Z',
        current_streak: 5,
        progress_score: 78,
        compliance_rate: 85,
        body_weight: 75.5,
        body_fat: 18.2,
        goals: ['Perder peso', 'Ganhar massa muscular', 'Melhorar condicionamento'],
      };

      setClient(mockClient);

      // Mock workout plans
      setWorkoutPlans([
        {
          id: '1',
          name: 'Programa de Hipertrofia - Iniciante',
          status: 'active',
          start_date: '2024-01-01',
          total_sessions: 36,
          completed_sessions: 18,
          weekly_frequency: 3,
        },
        {
          id: '2',
          name: 'Condicionamento Cardiovascular',
          status: 'completed',
          start_date: '2023-10-01',
          end_date: '2023-12-31',
          total_sessions: 24,
          completed_sessions: 24,
          weekly_frequency: 2,
        },
      ]);

      // Mock anamnesis data
      setAnamnesisData({
        id: 'anamnesis_1',
        completed_at: '2024-01-01T09:00:00Z',
        health_conditions: ['Hipertensão leve'],
        fitness_goals: ['Perder peso', 'Ganhar massa muscular'],
        exercise_experience: 'Iniciante',
        preferences: ['Academia', 'Corrida'],
        restrictions: ['Problemas no joelho direito'],
      });
    } catch {
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

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
            Pendente
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="h-64 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="lg:col-span-2">
            <div className="h-64 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-bold">Cliente não encontrado</h2>
        <p className="text-muted-foreground">
          O cliente solicitado não existe ou você não tem permissão para visualizá-lo.
        </p>
        <Link href="/clients">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Lista
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/clients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{client.full_name}</h1>
            <div className="flex items-center gap-3 mt-2">
              {getStatusBadge(client.status)}
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                Cliente desde {formatDate(client.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Mensagem
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={client.avatar_url} alt={client.full_name} />
                <AvatarFallback className="text-lg">{getInitials(client.full_name)}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{client.full_name}</CardTitle>
              <p className="text-muted-foreground">{client.email}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.phone}</span>
                  </div>
                )}
                {client.date_of_birth && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(client.date_of_birth)}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{client.address}</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{client.total_workouts}</p>
                  <p className="text-xs text-muted-foreground">Total Treinos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{client.current_streak}</p>
                  <p className="text-xs text-muted-foreground">Sequência Atual</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{client.progress_score}%</p>
                  <p className="text-xs text-muted-foreground">Progresso</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{client.compliance_rate}%</p>
                  <p className="text-xs text-muted-foreground">Aderência</p>
                </div>
              </div>

              <Separator />

              {/* Emergency Contact */}
              {client.emergency_contact && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Contato de Emergência</h4>
                  <p className="text-sm text-muted-foreground">{client.emergency_contact}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content - will continue in next chunk */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">
                <Activity className="h-4 w-4 mr-2" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="anamnesis">
                <FileText className="h-4 w-4 mr-2" />
                Anamnese
              </TabsTrigger>
              <TabsTrigger value="workouts">
                <Dumbbell className="h-4 w-4 mr-2" />
                Treinos
              </TabsTrigger>
              <TabsTrigger value="progress">
                <BarChart3 className="h-4 w-4 mr-2" />
                Progresso
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="settings">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Configurações
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Último Treino</p>
                        <p className="font-medium">{formatLastWorkout(client.last_workout_date)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Peso Atual</p>
                        <p className="font-medium">{client.body_weight} kg</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Target className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">% Gordura</p>
                        <p className="font-medium">{client.body_fat}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Objetivos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {client.goals?.map((goal, index) => (
                      <Badge key={index} variant="secondary">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Current Workout Plans */}
              <Card>
                <CardHeader>
                  <CardTitle>Planos de Treino Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workoutPlans
                      .filter(plan => plan.status === 'active')
                      .map(plan => (
                        <div
                          key={plan.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{plan.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {plan.completed_sessions}/{plan.total_sessions} sessões •{' '}
                              {plan.weekly_frequency}x por semana
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {Math.round((plan.completed_sessions / plan.total_sessions) * 100)}%
                            </p>
                            <p className="text-xs text-muted-foreground">concluído</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Anamnesis Tab */}
            <TabsContent value="anamnesis" className="space-y-6">
              {anamnesisData ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Última Anamnese</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Preenchida em {formatDate(anamnesisData.completed_at)}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Health Conditions */}
                      <div>
                        <h4 className="font-medium mb-3">Condições de Saúde</h4>
                        <div className="flex flex-wrap gap-2">
                          {anamnesisData.health_conditions?.map((condition, index) => (
                            <Badge key={index} variant="destructive">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Fitness Goals */}
                      <div>
                        <h4 className="font-medium mb-3">Objetivos de Fitness</h4>
                        <div className="flex flex-wrap gap-2">
                          {anamnesisData.fitness_goals?.map((goal, index) => (
                            <Badge key={index} variant="default">
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Exercise Experience */}
                      <div>
                        <h4 className="font-medium mb-3">Experiência com Exercícios</h4>
                        <p className="text-sm">{anamnesisData.exercise_experience}</p>
                      </div>

                      {/* Preferences */}
                      <div>
                        <h4 className="font-medium mb-3">Preferências de Exercício</h4>
                        <div className="flex flex-wrap gap-2">
                          {anamnesisData.preferences?.map((preference, index) => (
                            <Badge key={index} variant="secondary">
                              {preference}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Restrictions */}
                      <div>
                        <h4 className="font-medium mb-3">Restrições/Limitações</h4>
                        <div className="flex flex-wrap gap-2">
                          {anamnesisData.restrictions?.map((restriction, index) => (
                            <Badge key={index} variant="outline">
                              {restriction}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma anamnese encontrada</h3>
                    <p className="text-muted-foreground mb-4">
                      Este cliente ainda não preencheu uma anamnese.
                    </p>
                    <Button>Enviar Anamnese</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Workouts Tab */}
            <TabsContent value="workouts" className="space-y-6">
              <div className="space-y-4">
                {workoutPlans.map(plan => (
                  <Card key={plan.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <Badge
                          variant={
                            plan.status === 'active'
                              ? 'default'
                              : plan.status === 'completed'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {plan.status === 'active'
                            ? 'Ativo'
                            : plan.status === 'completed'
                              ? 'Concluído'
                              : 'Pausado'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Frequência</p>
                          <p className="font-medium">{plan.weekly_frequency}x por semana</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Progresso</p>
                          <p className="font-medium">
                            {plan.completed_sessions}/{plan.total_sessions} sessões
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Início</p>
                          <p className="font-medium">{formatDate(plan.start_date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="font-medium">
                            {Math.round((plan.completed_sessions / plan.total_sessions) * 100)}%
                            concluído
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                        {plan.status === 'active' && (
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardContent className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Gráficos de Progresso</h3>
                  <p className="text-muted-foreground mb-4">
                    Visualizações detalhadas de progresso serão implementadas aqui.
                  </p>
                  <Button variant="outline">Ver Relatórios</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Chat com Cliente</h3>
                  <p className="text-muted-foreground mb-4">
                    Interface de chat será implementada aqui.
                  </p>
                  <Button>Iniciar Conversa</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <ClientStatusManager
                client={client}
                currentUserId="current-trainer-id"
                availableTrainers={[
                  { id: 'trainer-1', name: 'Ana Silva', email: 'ana@fituno.com' },
                  { id: 'trainer-2', name: 'Carlos Santos', email: 'carlos@fituno.com' },
                  { id: 'trainer-3', name: 'Maria Oliveira', email: 'maria@fituno.com' },
                ]}
                onStatusChange={(newStatus: ClientStatus) => {
                  setClient(prev =>
                    prev
                      ? { ...prev, status: newStatus, updated_at: new Date().toISOString() }
                      : null
                  );
                  // TODO: Show success toast
                }}
                onTransfer={(newTrainerId: string) => {
                  setClient(prev =>
                    prev
                      ? {
                          ...prev,
                          current_trainer_id: newTrainerId,
                          status: 'TRANSFERRED',
                          updated_at: new Date().toISOString(),
                        }
                      : null
                  );
                  // TODO: Show success toast and redirect
                }}
                onDelete={() => {
                  setClient(prev =>
                    prev
                      ? { ...prev, status: 'ARCHIVED', updated_at: new Date().toISOString() }
                      : null
                  );
                  // TODO: Show success toast and redirect to clients list
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
