interface Integration {
  id: string
  name: string
  type: 'laboratory' | 'payment' | 'ehr' | 'imaging' | 'insurance' | 'pharmacy' | 'accounting'
  category: string
  description: string
  provider: string
  status: 'active' | 'inactive' | 'pending' | 'error'
  version: string
  lastSync: Date
  config: IntegrationConfig
  endpoints: IntegrationEndpoint[]
  credentials: IntegrationCredentials
  usage: IntegrationUsage
}

interface IntegrationConfig {
  baseUrl: string
  timeout: number
  retryCount: number
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly'
  dataMapping: { [key: string]: string }
  filters: { [key: string]: any }
  webhookUrl?: string
  headers: { [key: string]: string }
}

interface IntegrationEndpoint {
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  parameters?: { [key: string]: any }
  response?: any
  lastUsed?: Date
  successRate: number
}

interface IntegrationCredentials {
  apiKey?: string
  username?: string
  password?: string
  token?: string
  clientId?: string
  clientSecret?: string
  certificate?: string
  isEncrypted: boolean
}

interface IntegrationUsage {
  requestsCount: number
  successCount: number
  errorCount: number
  lastRequest: Date
  averageResponseTime: number
  dataTransferred: number
  monthlyQuota: number
  quotaUsed: number
}

interface LaboratoryResult {
  id: string
  patientId: string
  patientName: string
  examType: string
  examCode: string
  laboratoryId: string
  laboratoryName: string
  requestDate: Date
  collectionDate?: Date
  resultDate?: Date
  status: 'requested' | 'collected' | 'processing' | 'completed' | 'cancelled'
  results: {
    parameter: string
    value: string
    unit: string
    referenceRange: string
    status: 'normal' | 'abnormal' | 'critical'
  }[]
  observations: string
  attachments: {
    name: string
    url: string
    type: string
  }[]
  integrationId: string
}

interface PaymentTransaction {
  id: string
  integrationId: string
  paymentId: string
  appointmentId?: string
  patientId: string
  amount: number
  currency: string
  method: 'credit_card' | 'debit_card' | 'pix' | 'bank_slip' | 'cash'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  gateway: string
  transactionFee: number
  createdAt: Date
  processedAt?: Date
  metadata: { [key: string]: any }
  receipt?: {
    url: string
    number: string
  }
}

interface EHRRecord {
  id: string
  patientId: string
  integrationId: string
  recordType: 'appointment' | 'diagnosis' | 'prescription' | 'procedure' | 'note'
  title: string
  description: string
  date: Date
  provider: string
  icd10Code?: string
  medications?: {
    name: string
    dosage: string
    frequency: string
    duration: string
  }[]
  attachments?: {
    name: string
    url: string
    type: string
  }[]
  syncStatus: 'pending' | 'synced' | 'error'
  lastSync: Date
}

interface SyncLog {
  id: string
  integrationId: string
  type: 'manual' | 'scheduled' | 'webhook'
  status: 'started' | 'completed' | 'failed'
  startTime: Date
  endTime?: Date
  recordsProcessed: number
  recordsSuccess: number
  recordsError: number
  errors: {
    record: string
    error: string
    timestamp: Date
  }[]
  summary: string
}

class IntegrationsService {
  private static instance: IntegrationsService
  private integrations: Integration[] = []
  private labResults: LaboratoryResult[] = []
  private paymentTransactions: PaymentTransaction[] = []
  private ehrRecords: EHRRecord[] = []
  private syncLogs: SyncLog[] = []

  private constructor() {
    this.initializeData()
  }

  public static getInstance(): IntegrationsService {
    if (!IntegrationsService.instance) {
      IntegrationsService.instance = new IntegrationsService()
    }
    return IntegrationsService.instance
  }

  private initializeData() {
    // Integrações disponíveis
    this.integrations = [
      {
        id: 'lab-fleury',
        name: 'Grupo Fleury',
        type: 'laboratory',
        category: 'Laboratório',
        description: 'Integração com laboratório Fleury para solicitação e recebimento de resultados',
        provider: 'Fleury Medicina e Saúde',
        status: 'active',
        version: '2.1.0',
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
        config: {
          baseUrl: 'https://api.fleury.com.br/v2',
          timeout: 30000,
          retryCount: 3,
          syncFrequency: 'hourly',
          dataMapping: {
            'patient_id': 'paciente_id',
            'exam_code': 'codigo_exame',
            'result_date': 'data_resultado'
          },
          filters: { clinic_id: 'CLI001' },
          webhookUrl: 'https://odontopro.com/webhooks/fleury',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Version': '2.1'
          }
        },
        endpoints: [
          {
            name: 'Solicitar Exame',
            method: 'POST',
            path: '/exams/request',
            description: 'Solicita um novo exame para um paciente',
            successRate: 98.5,
            lastUsed: new Date(Date.now() - 1 * 60 * 60 * 1000)
          },
          {
            name: 'Consultar Resultados',
            method: 'GET',
            path: '/exams/results',
            description: 'Consulta resultados de exames disponíveis',
            successRate: 99.2,
            lastUsed: new Date(Date.now() - 30 * 60 * 1000)
          },
          {
            name: 'Download de Laudos',
            method: 'GET',
            path: '/exams/{id}/report',
            description: 'Download do laudo em PDF',
            successRate: 97.8,
            lastUsed: new Date(Date.now() - 45 * 60 * 1000)
          }
        ],
        credentials: {
          apiKey: '***************456',
          clientId: 'odonto_pro_001',
          isEncrypted: true
        },
        usage: {
          requestsCount: 1250,
          successCount: 1235,
          errorCount: 15,
          lastRequest: new Date(Date.now() - 30 * 60 * 1000),
          averageResponseTime: 850,
          dataTransferred: 15768000, // bytes
          monthlyQuota: 10000,
          quotaUsed: 1250
        }
      },
      {
        id: 'payment-stripe',
        name: 'Stripe',
        type: 'payment',
        category: 'Pagamentos',
        description: 'Gateway de pagamento para cartões de crédito e débito',
        provider: 'Stripe Inc.',
        status: 'active',
        version: '1.0.0',
        lastSync: new Date(Date.now() - 15 * 60 * 1000),
        config: {
          baseUrl: 'https://api.stripe.com/v1',
          timeout: 15000,
          retryCount: 2,
          syncFrequency: 'realtime',
          dataMapping: {
            'amount': 'amount',
            'currency': 'currency',
            'customer_id': 'customer'
          },
          filters: {},
          webhookUrl: 'https://odontopro.com/webhooks/stripe',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Stripe-Version': '2023-10-16'
          }
        },
        endpoints: [
          {
            name: 'Criar Pagamento',
            method: 'POST',
            path: '/payment_intents',
            description: 'Cria uma nova intenção de pagamento',
            successRate: 99.8,
            lastUsed: new Date(Date.now() - 15 * 60 * 1000)
          },
          {
            name: 'Consultar Transação',
            method: 'GET',
            path: '/payment_intents/{id}',
            description: 'Consulta o status de uma transação',
            successRate: 99.9,
            lastUsed: new Date(Date.now() - 20 * 60 * 1000)
          },
          {
            name: 'Estornar Pagamento',
            method: 'POST',
            path: '/refunds',
            description: 'Estorna um pagamento processado',
            successRate: 98.5,
            lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          }
        ],
        credentials: {
          apiKey: 'sk_live_***************',
          isEncrypted: true
        },
        usage: {
          requestsCount: 2850,
          successCount: 2845,
          errorCount: 5,
          lastRequest: new Date(Date.now() - 15 * 60 * 1000),
          averageResponseTime: 450,
          dataTransferred: 8950000,
          monthlyQuota: 100000,
          quotaUsed: 2850
        }
      },
      {
        id: 'pix-bacen',
        name: 'PIX - Banco Central',
        type: 'payment',
        category: 'Pagamentos',
        description: 'Integração PIX para pagamentos instantâneos',
        provider: 'Banco Central do Brasil',
        status: 'active',
        version: '1.2.0',
        lastSync: new Date(Date.now() - 5 * 60 * 1000),
        config: {
          baseUrl: 'https://api.bcb.gov.br/pix/v1',
          timeout: 10000,
          retryCount: 3,
          syncFrequency: 'realtime',
          dataMapping: {
            'chave_pix': 'pix_key',
            'valor': 'amount',
            'descricao': 'description'
          },
          filters: { instituicao: 'CLI001' },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {token}'
          }
        },
        endpoints: [
          {
            name: 'Gerar QR Code',
            method: 'POST',
            path: '/qrcode/generate',
            description: 'Gera QR Code para pagamento PIX',
            successRate: 99.5,
            lastUsed: new Date(Date.now() - 5 * 60 * 1000)
          },
          {
            name: 'Consultar Pagamento',
            method: 'GET',
            path: '/payments/{txid}',
            description: 'Consulta status de pagamento PIX',
            successRate: 99.8,
            lastUsed: new Date(Date.now() - 10 * 60 * 1000)
          }
        ],
        credentials: {
          clientId: 'cli_odonto_001',
          clientSecret: '***************',
          certificate: 'cert_pix_production.p12',
          isEncrypted: true
        },
        usage: {
          requestsCount: 1580,
          successCount: 1575,
          errorCount: 5,
          lastRequest: new Date(Date.now() - 5 * 60 * 1000),
          averageResponseTime: 280,
          dataTransferred: 4250000,
          monthlyQuota: 50000,
          quotaUsed: 1580
        }
      },
      {
        id: 'ehr-prontomed',
        name: 'ProntoMed EHR',
        type: 'ehr',
        category: 'Prontuário Eletrônico',
        description: 'Sistema de prontuário eletrônico integrado',
        provider: 'ProntoMed Sistemas',
        status: 'active',
        version: '3.5.2',
        lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000),
        config: {
          baseUrl: 'https://api.prontomed.com.br/v3',
          timeout: 25000,
          retryCount: 3,
          syncFrequency: 'daily',
          dataMapping: {
            'patient_id': 'id_paciente',
            'appointment_id': 'id_consulta',
            'diagnosis_code': 'codigo_cid'
          },
          filters: { clinic_id: 'CLI001', active_only: true },
          webhookUrl: 'https://odontopro.com/webhooks/prontomed',
          headers: {
            'Content-Type': 'application/json',
            'X-Clinic-ID': 'CLI001'
          }
        },
        endpoints: [
          {
            name: 'Sincronizar Pacientes',
            method: 'GET',
            path: '/patients/sync',
            description: 'Sincroniza dados de pacientes',
            successRate: 96.8,
            lastUsed: new Date(Date.now() - 4 * 60 * 60 * 1000)
          },
          {
            name: 'Enviar Consulta',
            method: 'POST',
            path: '/appointments',
            description: 'Envia dados de nova consulta',
            successRate: 98.2,
            lastUsed: new Date(Date.now() - 6 * 60 * 60 * 1000)
          },
          {
            name: 'Atualizar Prontuário',
            method: 'PUT',
            path: '/records/{id}',
            description: 'Atualiza informações do prontuário',
            successRate: 97.5,
            lastUsed: new Date(Date.now() - 8 * 60 * 60 * 1000)
          }
        ],
        credentials: {
          username: 'api_odontopro',
          password: '***************',
          token: 'tk_***************',
          isEncrypted: true
        },
        usage: {
          requestsCount: 450,
          successCount: 438,
          errorCount: 12,
          lastRequest: new Date(Date.now() - 4 * 60 * 60 * 1000),
          averageResponseTime: 1200,
          dataTransferred: 12500000,
          monthlyQuota: 5000,
          quotaUsed: 450
        }
      },
      {
        id: 'insurance-unimed',
        name: 'Unimed - Guias',
        type: 'insurance',
        category: 'Convênios',
        description: 'Sistema de autorização e guias Unimed',
        provider: 'Unimed Brasil',
        status: 'pending',
        version: '2.0.1',
        lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
        config: {
          baseUrl: 'https://api.unimed.com.br/v2',
          timeout: 20000,
          retryCount: 3,
          syncFrequency: 'daily',
          dataMapping: {
            'beneficiario': 'patient_id',
            'procedimento': 'procedure_code',
            'prestador': 'provider_id'
          },
          filters: { prestador_id: 'PREST001' },
          headers: {
            'Content-Type': 'application/json',
            'X-Provider-ID': 'PREST001'
          }
        },
        endpoints: [
          {
            name: 'Consultar Elegibilidade',
            method: 'GET',
            path: '/eligibility/{patient_id}',
            description: 'Consulta elegibilidade do beneficiário',
            successRate: 94.5,
            lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000)
          },
          {
            name: 'Solicitar Autorização',
            method: 'POST',
            path: '/authorizations',
            description: 'Solicita autorização para procedimento',
            successRate: 92.3,
            lastUsed: new Date(Date.now() - 25 * 60 * 60 * 1000)
          },
          {
            name: 'Enviar Guia',
            method: 'POST',
            path: '/claims',
            description: 'Envia guia para faturamento',
            successRate: 89.7,
            lastUsed: new Date(Date.now() - 26 * 60 * 60 * 1000)
          }
        ],
        credentials: {
          username: 'prestador001',
          password: '***************',
          isEncrypted: true
        },
        usage: {
          requestsCount: 180,
          successCount: 165,
          errorCount: 15,
          lastRequest: new Date(Date.now() - 24 * 60 * 60 * 1000),
          averageResponseTime: 1800,
          dataTransferred: 2100000,
          monthlyQuota: 2000,
          quotaUsed: 180
        }
      }
    ]

    // Resultados de laboratório simulados
    this.labResults = [
      {
        id: 'lab-001',
        patientId: 'patient-1',
        patientName: 'Maria Silva',
        examType: 'Hemograma Completo',
        examCode: 'HEM001',
        laboratoryId: 'lab-fleury',
        laboratoryName: 'Grupo Fleury',
        requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        collectionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        resultDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'completed',
        results: [
          {
            parameter: 'Hemácias',
            value: '4.8',
            unit: 'milhões/mm³',
            referenceRange: '4.0 - 5.4',
            status: 'normal'
          },
          {
            parameter: 'Hemoglobina',
            value: '13.2',
            unit: 'g/dL',
            referenceRange: '12.0 - 16.0',
            status: 'normal'
          },
          {
            parameter: 'Leucócitos',
            value: '9200',
            unit: '/mm³',
            referenceRange: '4000 - 11000',
            status: 'normal'
          }
        ],
        observations: 'Exame dentro dos parâmetros normais.',
        attachments: [
          {
            name: 'hemograma_maria_silva.pdf',
            url: '/lab-results/hemograma_maria_silva.pdf',
            type: 'application/pdf'
          }
        ],
        integrationId: 'lab-fleury'
      }
    ]

    // Transações de pagamento simuladas
    this.paymentTransactions = [
      {
        id: 'pay-001',
        integrationId: 'payment-stripe',
        paymentId: 'pi_1234567890',
        patientId: 'patient-1',
        amount: 35000, // R$ 350.00 em centavos
        currency: 'BRL',
        method: 'credit_card',
        status: 'completed',
        gateway: 'Stripe',
        transactionFee: 1085, // R$ 10.85 em centavos
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        processedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5000),
        metadata: {
          appointmentId: 'apt-001',
          treatmentType: 'Limpeza Dental',
          installments: 1
        },
        receipt: {
          url: '/receipts/pay-001.pdf',
          number: 'REC-001-2024'
        }
      },
      {
        id: 'pay-002',
        integrationId: 'pix-bacen',
        paymentId: 'pix_abcd123456',
        patientId: 'patient-2',
        amount: 150000, // R$ 1.500.00 em centavos
        currency: 'BRL',
        method: 'pix',
        status: 'completed',
        gateway: 'PIX',
        transactionFee: 0,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        processedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 15000),
        metadata: {
          appointmentId: 'apt-002',
          treatmentType: 'Implante Dentário',
          pixKey: 'odontopro@email.com'
        }
      }
    ]

    // Registros EHR simulados
    this.ehrRecords = [
      {
        id: 'ehr-001',
        patientId: 'patient-1',
        integrationId: 'ehr-prontomed',
        recordType: 'appointment',
        title: 'Consulta Preventiva',
        description: 'Consulta de rotina com limpeza dental',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        provider: 'Dr. João Santos',
        syncStatus: 'synced',
        lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: 'ehr-002',
        patientId: 'patient-2',
        integrationId: 'ehr-prontomed',
        recordType: 'prescription',
        title: 'Prescrição Pós-Cirúrgica',
        description: 'Medicação para recuperação pós-implante',
        date: new Date(Date.now() - 48 * 60 * 60 * 1000),
        provider: 'Dra. Maria Fernandes',
        medications: [
          {
            name: 'Amoxicilina 500mg',
            dosage: '500mg',
            frequency: '8/8h',
            duration: '7 dias'
          },
          {
            name: 'Ibuprofeno 600mg',
            dosage: '600mg',
            frequency: '12/12h',
            duration: '3 dias'
          }
        ],
        syncStatus: 'synced',
        lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000)
      }
    ]

    // Logs de sincronização
    this.syncLogs = [
      {
        id: 'sync-001',
        integrationId: 'lab-fleury',
        type: 'scheduled',
        status: 'completed',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 45000),
        recordsProcessed: 15,
        recordsSuccess: 14,
        recordsError: 1,
        errors: [
          {
            record: 'exam-xyz-456',
            error: 'Paciente não encontrado no sistema',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000)
          }
        ],
        summary: 'Sincronização concluída com 1 erro. 14 resultados importados com sucesso.'
      }
    ]
  }

  // Gerenciamento de Integrações
  public getIntegrations(): Integration[] {
    return this.integrations
  }

  public getIntegration(id: string): Integration | undefined {
    return this.integrations.find(integration => integration.id === id)
  }

  public getIntegrationsByType(type: Integration['type']): Integration[] {
    return this.integrations.filter(integration => integration.type === type)
  }

  public getActiveIntegrations(): Integration[] {
    return this.integrations.filter(integration => integration.status === 'active')
  }

  public activateIntegration(id: string): boolean {
    const integration = this.integrations.find(i => i.id === id)
    if (!integration) return false

    integration.status = 'active'
    integration.lastSync = new Date()
    return true
  }

  public deactivateIntegration(id: string): boolean {
    const integration = this.integrations.find(i => i.id === id)
    if (!integration) return false

    integration.status = 'inactive'
    return true
  }

  public updateIntegrationConfig(id: string, config: Partial<IntegrationConfig>): boolean {
    const integration = this.integrations.find(i => i.id === id)
    if (!integration) return false

    integration.config = { ...integration.config, ...config }
    return true
  }

  public testIntegration(id: string): Promise<{ success: boolean; message: string; responseTime: number }> {
    return new Promise((resolve) => {
      const integration = this.integrations.find(i => i.id === id)
      if (!integration) {
        resolve({ success: false, message: 'Integração não encontrada', responseTime: 0 })
        return
      }

      // Simular teste de conexão
      setTimeout(() => {
        const success = Math.random() > 0.1 // 90% de sucesso
        const responseTime = Math.random() * 2000 + 200 // 200ms a 2200ms
        
        resolve({
          success,
          message: success ? 'Conexão estabelecida com sucesso' : 'Erro na autenticação',
          responseTime
        })
      }, 1000)
    })
  }

  // Resultados de Laboratório
  public getLaboratoryResults(filters?: {
    patientId?: string
    laboratoryId?: string
    status?: string
    dateFrom?: Date
    dateTo?: Date
  }): LaboratoryResult[] {
    let results = [...this.labResults]

    if (filters) {
      if (filters.patientId) {
        results = results.filter(r => r.patientId === filters.patientId)
      }
      if (filters.laboratoryId) {
        results = results.filter(r => r.laboratoryId === filters.laboratoryId)
      }
      if (filters.status) {
        results = results.filter(r => r.status === filters.status)
      }
      if (filters.dateFrom) {
        results = results.filter(r => r.requestDate >= filters.dateFrom!)
      }
      if (filters.dateTo) {
        results = results.filter(r => r.requestDate <= filters.dateTo!)
      }
    }

    return results.sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime())
  }

  public requestLabExam(data: {
    patientId: string
    examType: string
    examCode: string
    laboratoryId: string
    urgency: 'routine' | 'urgent'
    observations?: string
  }): Promise<{ success: boolean; examId?: string; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.05 // 95% de sucesso
        
        if (success) {
          const examId = `exam-${Date.now()}`
          const newExam: LaboratoryResult = {
            id: examId,
            patientId: data.patientId,
            patientName: 'Paciente Exemplo', // Buscar nome real
            examType: data.examType,
            examCode: data.examCode,
            laboratoryId: data.laboratoryId,
            laboratoryName: 'Laboratório Exemplo',
            requestDate: new Date(),
            status: 'requested',
            results: [],
            observations: data.observations || '',
            attachments: [],
            integrationId: data.laboratoryId
          }
          
          this.labResults.push(newExam)
          
          resolve({
            success: true,
            examId,
            message: 'Exame solicitado com sucesso'
          })
        } else {
          resolve({
            success: false,
            message: 'Erro na comunicação com o laboratório'
          })
        }
      }, 1500)
    })
  }

  // Transações de Pagamento
  public getPaymentTransactions(filters?: {
    patientId?: string
    status?: string
    method?: string
    dateFrom?: Date
    dateTo?: Date
  }): PaymentTransaction[] {
    let transactions = [...this.paymentTransactions]

    if (filters) {
      if (filters.patientId) {
        transactions = transactions.filter(t => t.patientId === filters.patientId)
      }
      if (filters.status) {
        transactions = transactions.filter(t => t.status === filters.status)
      }
      if (filters.method) {
        transactions = transactions.filter(t => t.method === filters.method)
      }
      if (filters.dateFrom) {
        transactions = transactions.filter(t => t.createdAt >= filters.dateFrom!)
      }
      if (filters.dateTo) {
        transactions = transactions.filter(t => t.createdAt <= filters.dateTo!)
      }
    }

    return transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  public processPayment(data: {
    patientId: string
    amount: number
    method: PaymentTransaction['method']
    integrationId: string
    metadata?: { [key: string]: any }
  }): Promise<{ success: boolean; transactionId?: string; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.02 // 98% de sucesso
        
        if (success) {
          const transactionId = `pay-${Date.now()}`
          const newTransaction: PaymentTransaction = {
            id: transactionId,
            integrationId: data.integrationId,
            paymentId: `ext_${Date.now()}`,
            patientId: data.patientId,
            amount: data.amount,
            currency: 'BRL',
            method: data.method,
            status: 'completed',
            gateway: data.method === 'pix' ? 'PIX' : 'Stripe',
            transactionFee: data.method === 'pix' ? 0 : Math.round(data.amount * 0.031), // 3.1% taxa cartão
            createdAt: new Date(),
            processedAt: new Date(),
            metadata: data.metadata || {}
          }
          
          this.paymentTransactions.push(newTransaction)
          
          resolve({
            success: true,
            transactionId,
            message: 'Pagamento processado com sucesso'
          })
        } else {
          resolve({
            success: false,
            message: 'Erro no processamento do pagamento'
          })
        }
      }, 2000)
    })
  }

  // Prontuário Eletrônico
  public getEHRRecords(patientId?: string): EHRRecord[] {
    let records = [...this.ehrRecords]
    
    if (patientId) {
      records = records.filter(record => record.patientId === patientId)
    }
    
    return records.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  public syncEHRRecord(recordId: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const record = this.ehrRecords.find(r => r.id === recordId)
        if (!record) {
          resolve({ success: false, message: 'Registro não encontrado' })
          return
        }

        const success = Math.random() > 0.1 // 90% de sucesso
        
        if (success) {
          record.syncStatus = 'synced'
          record.lastSync = new Date()
          resolve({ success: true, message: 'Registro sincronizado com sucesso' })
        } else {
          record.syncStatus = 'error'
          resolve({ success: false, message: 'Erro na sincronização' })
        }
      }, 1000)
    })
  }

  // Logs de Sincronização
  public getSyncLogs(integrationId?: string): SyncLog[] {
    let logs = [...this.syncLogs]
    
    if (integrationId) {
      logs = logs.filter(log => log.integrationId === integrationId)
    }
    
    return logs.sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
  }

  public startManualSync(integrationId: string): Promise<{ success: boolean; logId: string; message: string }> {
    return new Promise((resolve) => {
      const logId = `sync-${Date.now()}`
      const newLog: SyncLog = {
        id: logId,
        integrationId,
        type: 'manual',
        status: 'started',
        startTime: new Date(),
        recordsProcessed: 0,
        recordsSuccess: 0,
        recordsError: 0,
        errors: [],
        summary: 'Sincronização iniciada manualmente'
      }
      
      this.syncLogs.push(newLog)
      
      // Simular processo de sincronização
      setTimeout(() => {
        const integration = this.integrations.find(i => i.id === integrationId)
        if (!integration) {
          newLog.status = 'failed'
          newLog.endTime = new Date()
          newLog.summary = 'Integração não encontrada'
          resolve({ success: false, logId, message: 'Integração não encontrada' })
          return
        }

        const success = Math.random() > 0.15 // 85% de sucesso
        const recordsProcessed = Math.floor(Math.random() * 20) + 5
        const recordsError = success ? Math.floor(Math.random() * 3) : Math.floor(recordsProcessed * 0.3)
        const recordsSuccess = recordsProcessed - recordsError

        newLog.status = success ? 'completed' : 'failed'
        newLog.endTime = new Date()
        newLog.recordsProcessed = recordsProcessed
        newLog.recordsSuccess = recordsSuccess
        newLog.recordsError = recordsError
        newLog.summary = success 
          ? `Sincronização concluída. ${recordsSuccess} registros processados com sucesso.`
          : `Sincronização falhou. ${recordsError} erros encontrados.`

        integration.lastSync = new Date()
        integration.usage.lastRequest = new Date()
        integration.usage.requestsCount += recordsProcessed

        resolve({
          success,
          logId,
          message: newLog.summary
        })
      }, 3000 + Math.random() * 2000) // 3-5 segundos
    })
  }

  // Estatísticas e Métricas
  public getIntegrationStats(): {
    totalIntegrations: number
    activeIntegrations: number
    totalRequests: number
    successRate: number
    averageResponseTime: number
    monthlyDataTransfer: number
    topIntegrations: { name: string; requests: number; successRate: number }[]
  } {
    const activeIntegrations = this.integrations.filter(i => i.status === 'active')
    const totalRequests = this.integrations.reduce((sum, i) => sum + i.usage.requestsCount, 0)
    const totalSuccess = this.integrations.reduce((sum, i) => sum + i.usage.successCount, 0)
    const totalResponseTime = this.integrations.reduce((sum, i) => sum + i.usage.averageResponseTime, 0)
    const totalDataTransfer = this.integrations.reduce((sum, i) => sum + i.usage.dataTransferred, 0)

    return {
      totalIntegrations: this.integrations.length,
      activeIntegrations: activeIntegrations.length,
      totalRequests,
      successRate: totalRequests > 0 ? (totalSuccess / totalRequests) * 100 : 0,
      averageResponseTime: this.integrations.length > 0 ? totalResponseTime / this.integrations.length : 0,
      monthlyDataTransfer: totalDataTransfer,
      topIntegrations: this.integrations
        .map(i => ({
          name: i.name,
          requests: i.usage.requestsCount,
          successRate: i.usage.requestsCount > 0 ? (i.usage.successCount / i.usage.requestsCount) * 100 : 0
        }))
        .sort((a, b) => b.requests - a.requests)
        .slice(0, 5)
    }
  }

  // Utilitários
  public formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  public getStatusColor(status: Integration['status']): string {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  public getStatusLabel(status: Integration['status']): string {
    switch (status) {
      case 'active': return 'Ativo'
      case 'inactive': return 'Inativo'
      case 'pending': return 'Pendente'
      case 'error': return 'Erro'
      default: return 'Desconhecido'
    }
  }
}

export const integrationsService = IntegrationsService.getInstance()

export type {
  Integration,
  IntegrationConfig,
  IntegrationEndpoint,
  IntegrationCredentials,
  IntegrationUsage,
  LaboratoryResult,
  PaymentTransaction,
  EHRRecord,
  SyncLog
}