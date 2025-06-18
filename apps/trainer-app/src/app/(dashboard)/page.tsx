import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@fituno/ui';
import {
  BookOpen,
  Calendar,
  Crown,
  Dumbbell,
  FileText,
  TrendingDown,
  Users,
  UserX,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Overview - Portuguese labels matching wireframe */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sem Anamnese</CardTitle>
            <FileText className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">3</div>
            <p className="text-xs text-gray-500">clientes</p>
            <Button variant="link" className="text-blue-600 p-0 h-auto text-xs mt-1">
              Ver detalhes →
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sem Série Ativa</CardTitle>
            <Dumbbell className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">2</div>
            <p className="text-xs text-gray-500">clientes</p>
            <Button variant="link" className="text-blue-600 p-0 h-auto text-xs mt-1">
              Ver detalhes →
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Séries Vencidas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">1</div>
            <p className="text-xs text-gray-500">cliente</p>
            <Button variant="link" className="text-blue-600 p-0 h-auto text-xs mt-1">
              Ver detalhes →
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Clientes Inativos</CardTitle>
            <UserX className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <p className="text-xs text-gray-500">clientes</p>
            <Button variant="link" className="text-blue-600 p-0 h-auto text-xs mt-1">
              Ver detalhes →
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid - Schedule and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Section - Left side, takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-200 bg-white">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                  Agenda do Dia
                </CardTitle>
                <p className="text-sm text-gray-500">12 de Junho, 2025</p>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Schedule Item 1 */}
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                    <Dumbbell className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Ana Silva</p>
                    <p className="text-sm text-gray-600">Treino A - Peito e Tríceps</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">08:30 - 09:30</p>
                    <Badge className="bg-green-100 text-green-800 text-xs">Confirmado</Badge>
                  </div>
                </div>

                {/* Schedule Item 2 */}
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-8 bg-yellow-500 rounded-full"></div>
                    <Dumbbell className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Carlos Oliveira</p>
                    <p className="text-sm text-gray-600">Treino B - Costas e Bíceps</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">10:00 - 11:00</p>
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pendente</Badge>
                  </div>
                </div>

                {/* Schedule Item 3 */}
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                    <Dumbbell className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Maria Santos</p>
                    <p className="text-sm text-gray-600">Treino C - Pernas</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">16:00 - 17:00</p>
                    <Badge className="bg-green-100 text-green-800 text-xs">Confirmado</Badge>
                  </div>
                </div>

                {/* Schedule Item 4 */}
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                    <Dumbbell className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Pedro Almeida</p>
                    <p className="text-sm text-gray-600">Treino A - Peito e Tríceps</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">18:30 - 19:30</p>
                    <Badge className="bg-green-100 text-green-800 text-xs">Confirmado</Badge>
                  </div>
                </div>
              </div>

              <Button variant="link" className="text-blue-600 p-0 h-auto text-sm mt-4">
                Ver agenda completa →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Quick Actions and Subscription */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border border-gray-200 bg-white">
            <CardHeader className="border-b border-gray-200 pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900">Atalhos Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Button className="w-full justify-start h-12 bg-blue-600 hover:bg-blue-700 text-white">
                  <Users className="h-5 w-5 mr-3" />
                  Cadastrar Cliente
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Dumbbell className="h-5 w-5 mr-3" />
                  Criar Série
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <BookOpen className="h-5 w-5 mr-3" />
                  Biblioteca de Exercícios
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  Agenda
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Notice */}
          <Card className="border border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Crown className="h-6 w-6 text-yellow-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-1">Plano Gratuito</h3>
                  <p className="text-sm text-yellow-800 mb-3">
                    Você está utilizando 3 de 2 clientes permitidos.
                  </p>
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm">
                    Atualizar Plano
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
