interface AuditEvent {
  id: string
  timestamp: Date
  userId: string
  userName: string
  userRole: 'admin' | 'doctor' | 'assistant' | 'patient' | 'system'
  action: AuditAction
  resource: AuditResource
  resourceId: string
  resourceName?: string
  details: AuditDetails
  outcome: 'success' | 'failure' | 'warning'
  ipAddress: string
  userAgent: string
  sessionId: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  compliance: ComplianceFlags
  geolocation?: {
    country: string
    region: string
    city: string
  }
}

interface AuditAction {
  type: 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'export' | 'share' | 'backup' | 'restore'
  category: 'authentication' | 'data_access' | 'data_modification' | 'system_administration' | 'file_operations' | 'communication'
  description: string
  severity: 'info' | 'warning' | 'error' | 'critical'
}

interface AuditResource {
  type: 'patient' | 'appointment' | 'treatment' | 'payment' | 'file' | 'user' | 'system_config' | 'report' | 'backup'
  category: 'pii' | 'phi' | 'financial' | 'system' | 'communication'
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted'
  dataClassification: string[]
}

interface AuditDetails {
  before?: any
  after?: any
  changes?: AuditChange[]
  metadata: { [key: string]: any }
  reason?: string
  approvalRequired?: boolean
  approvedBy?: string
  businessJustification?: string
}

interface AuditChange {
  field: string
  fieldType: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array'
  oldValue: any
  newValue: any
  sensitive: boolean
  encrypted: boolean
}

interface ComplianceFlags {
  lgpd: boolean
  hipaa: boolean
  gdpr: boolean
  sox: boolean
  pci: boolean
  iso27001: boolean
}

interface AuditFilter {
  userId?: string
  userRole?: string
  action?: string
  resource?: string
  outcome?: string
  riskLevel?: string
  startDate?: Date
  endDate?: Date
  ipAddress?: string
  complianceFlag?: keyof ComplianceFlags
  searchTerm?: string
}

interface ComplianceReport {
  id: string
  type: 'lgpd' | 'hipaa' | 'gdpr' | 'sox' | 'pci' | 'iso27001' | 'custom'
  name: string
  description: string
  period: {
    startDate: Date
    endDate: Date
  }
  generatedAt: Date
  generatedBy: string
  status: 'generating' | 'completed' | 'failed'
  metrics: ComplianceMetrics
  violations: ComplianceViolation[]
  recommendations: string[]
  attachments: {
    name: string
    url: string
    type: string
  }[]
}

interface ComplianceMetrics {
  totalEvents: number
  highRiskEvents: number
  violations: number
  dataAccessEvents: number
  unauthorizedAttempts: number
  dataExports: number
  userSessions: number
  averageSessionDuration: number
  complianceScore: number
}

interface ComplianceViolation {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: string
  description: string
  eventId: string
  detectedAt: Date
  resolvedAt?: Date
  resolvedBy?: string
  resolution?: string
  impact: string
  recommendation: string
}

interface SecurityAlert {
  id: string
  type: 'suspicious_login' | 'data_breach' | 'unauthorized_access' | 'mass_export' | 'privilege_escalation' | 'unusual_activity'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  detectedAt: Date
  userId?: string
  ipAddress?: string
  relatedEvents: string[]
  status: 'open' | 'investigating' | 'resolved' | 'false_positive'
  assignedTo?: string
  actions: SecurityAction[]
  riskScore: number
}

interface SecurityAction {
  id: string
  type: 'block_user' | 'require_2fa' | 'log_additional_info' | 'notify_admin' | 'escalate' | 'quarantine'
  description: string
  executedAt: Date
  executedBy: string
  result: 'success' | 'failure'
}

interface DataRetentionPolicy {
  id: string
  name: string
  description: string
  dataType: 'audit_logs' | 'patient_data' | 'financial_records' | 'communication' | 'backups'
  retentionPeriod: number // dias
  archivePeriod: number // dias
  deletionMethod: 'soft_delete' | 'hard_delete' | 'anonymize' | 'encrypt'
  isActive: boolean
  createdAt: Date
  lastApplied: Date
  nextExecution: Date
}

interface PrivacyRequest {
  id: string
  type: 'access' | 'portability' | 'rectification' | 'erasure' | 'restriction' | 'objection'
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  patientId: string
  patientName: string
  requestDate: Date
  completionDate?: Date
  assignedTo?: string
  description: string
  justification?: string
  dataExported?: {
    filename: string
    url: string
    generatedAt: Date
  }
  verificationMethod: 'document' | 'in_person' | 'digital_signature'
  isVerified: boolean
}

class AuditService {
  private static instance: AuditService
  private auditEvents: AuditEvent[] = []
  private complianceReports: ComplianceReport[] = []
  private securityAlerts: SecurityAlert[] = []
  private retentionPolicies: DataRetentionPolicy[] = []
  private privacyRequests: PrivacyRequest[] = []

  private constructor() {
    this.initializeData()
  }

  public static getInstance(): AuditService {
    if (!AuditService.instance) {
      AuditService.instance = new AuditService()
    }
    return AuditService.instance
  }

  private initializeData() {
    // Eventos de auditoria simulados
    this.auditEvents = [
      {
        id: 'audit-001',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        userId: 'user-001',
        userName: 'Dr. João Santos',
        userRole: 'doctor',
        action: {
          type: 'read',
          category: 'data_access',
          description: 'Acesso a prontuário de paciente',
          severity: 'info'
        },
        resource: {
          type: 'patient',
          category: 'phi',
          sensitivity: 'confidential',
          dataClassification: ['medical_record', 'personal_data']
        },
        resourceId: 'patient-001',
        resourceName: 'Maria Silva',
        details: {
          metadata: {
            viewedSections: ['personal_data', 'treatment_history', 'appointments'],
            accessReason: 'scheduled_appointment'
          },
          businessJustification: 'Consulta agendada para hoje às 14:00'
        },
        outcome: 'success',
        ipAddress: '192.168.1.10',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        sessionId: 'sess-001',
        riskLevel: 'low',
        compliance: {
          lgpd: true,
          hipaa: true,
          gdpr: true,
          sox: false,
          pci: false,
          iso27001: true
        },
        geolocation: {
          country: 'Brazil',
          region: 'São Paulo',
          city: 'São Paulo'
        }
      },
      {
        id: 'audit-002',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        userId: 'user-002',
        userName: 'Ana Secretária',
        userRole: 'assistant',
        action: {
          type: 'update',
          category: 'data_modification',
          description: 'Atualização de dados pessoais do paciente',
          severity: 'warning'
        },
        resource: {
          type: 'patient',
          category: 'pii',
          sensitivity: 'confidential',
          dataClassification: ['personal_data', 'contact_info']
        },
        resourceId: 'patient-002',
        resourceName: 'João Oliveira',
        details: {
          before: {
            phone: '(11) 99999-8888',
            email: 'joao.old@email.com'
          },
          after: {
            phone: '(11) 99999-9999',
            email: 'joao.new@email.com'
          },
          changes: [
            {
              field: 'phone',
              fieldType: 'string',
              oldValue: '(11) 99999-8888',
              newValue: '(11) 99999-9999',
              sensitive: true,
              encrypted: false
            },
            {
              field: 'email',
              fieldType: 'string',
              oldValue: 'joao.old@email.com',
              newValue: 'joao.new@email.com',
              sensitive: true,
              encrypted: false
            }
          ],
          metadata: {
            updateReason: 'patient_request',
            verifiedBy: 'phone_call'
          },
          reason: 'Paciente solicitou atualização via telefone'
        },
        outcome: 'success',
        ipAddress: '192.168.1.15',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        sessionId: 'sess-002',
        riskLevel: 'medium',
        compliance: {
          lgpd: true,
          hipaa: true,
          gdpr: true,
          sox: false,
          pci: false,
          iso27001: true
        }
      },
      {
        id: 'audit-003',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        userId: 'user-003',
        userName: 'Sistema Automático',
        userRole: 'system',
        action: {
          type: 'backup',
          category: 'system_administration',
          description: 'Backup automático do banco de dados',
          severity: 'info'
        },
        resource: {
          type: 'backup',
          category: 'system',
          sensitivity: 'restricted',
          dataClassification: ['full_database', 'encrypted']
        },
        resourceId: 'backup-daily-001',
        resourceName: 'Backup Diário - 13/10/2025',
        details: {
          metadata: {
            backupSize: '2.5GB',
            compression: 'gzip',
            encryption: 'AES-256',
            location: 'AWS S3',
            duration: '15 minutes'
          }
        },
        outcome: 'success',
        ipAddress: '0.0.0.0',
        userAgent: 'System/1.0',
        sessionId: 'system-001',
        riskLevel: 'low',
        compliance: {
          lgpd: true,
          hipaa: true,
          gdpr: true,
          sox: true,
          pci: true,
          iso27001: true
        }
      },
      {
        id: 'audit-004',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        userId: 'user-004',
        userName: 'Tentativa de Acesso',
        userRole: 'patient',
        action: {
          type: 'login',
          category: 'authentication',
          description: 'Tentativa de login falhada - credenciais inválidas',
          severity: 'warning'
        },
        resource: {
          type: 'user',
          category: 'system',
          sensitivity: 'internal',
          dataClassification: ['authentication']
        },
        resourceId: 'login-attempt-001',
        details: {
          metadata: {
            attempts: 3,
            loginMethod: 'email_password',
            failureReason: 'invalid_credentials',
            accountLocked: false
          }
        },
        outcome: 'failure',
        ipAddress: '203.45.67.89',
        userAgent: 'Mozilla/5.0 (Android 10; Mobile; rv:81.0) Gecko/81.0 Firefox/81.0',
        sessionId: 'failed-001',
        riskLevel: 'medium',
        compliance: {
          lgpd: true,
          hipaa: false,
          gdpr: true,
          sox: false,
          pci: false,
          iso27001: true
        }
      },
      {
        id: 'audit-005',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        userId: 'user-001',
        userName: 'Dr. João Santos',
        userRole: 'doctor',
        action: {
          type: 'export',
          category: 'file_operations',
          description: 'Exportação de relatório de pacientes',
          severity: 'warning'
        },
        resource: {
          type: 'report',
          category: 'phi',
          sensitivity: 'confidential',
          dataClassification: ['patient_list', 'medical_data']
        },
        resourceId: 'report-001',
        resourceName: 'Relatório Mensal - Outubro 2025',
        details: {
          metadata: {
            exportFormat: 'PDF',
            recordCount: 150,
            includesSensitiveData: true,
            encryptionApplied: true,
            approvalLevel: 'supervisor'
          },
          approvalRequired: true,
          approvedBy: 'supervisor-001',
          businessJustification: 'Relatório solicitado pela diretoria clínica'
        },
        outcome: 'success',
        ipAddress: '192.168.1.10',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        sessionId: 'sess-003',
        riskLevel: 'high',
        compliance: {
          lgpd: true,
          hipaa: true,
          gdpr: true,
          sox: false,
          pci: false,
          iso27001: true
        }
      }
    ]

    // Relatórios de compliance
    this.complianceReports = [
      {
        id: 'report-lgpd-001',
        type: 'lgpd',
        name: 'Relatório LGPD - Outubro 2025',
        description: 'Auditoria de conformidade com a Lei Geral de Proteção de Dados',
        period: {
          startDate: new Date(2025, 9, 1), // Outubro
          endDate: new Date(2025, 9, 13)
        },
        generatedAt: new Date(),
        generatedBy: 'system',
        status: 'completed',
        metrics: {
          totalEvents: 1250,
          highRiskEvents: 45,
          violations: 3,
          dataAccessEvents: 890,
          unauthorizedAttempts: 12,
          dataExports: 28,
          userSessions: 456,
          averageSessionDuration: 45, // minutos
          complianceScore: 94.5
        },
        violations: [
          {
            id: 'viol-001',
            severity: 'medium',
            type: 'Acesso não autorizado',
            description: 'Tentativa de acesso a dados de paciente sem justificativa clínica',
            eventId: 'audit-012',
            detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            impact: 'Exposição potencial de dados pessoais',
            recommendation: 'Revisar política de acesso e implementar controles adicionais'
          },
          {
            id: 'viol-002',
            severity: 'low',
            type: 'Exportação sem aprovação',
            description: 'Exportação de relatório sem aprovação prévia do supervisor',
            eventId: 'audit-018',
            detectedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
            resolvedAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
            resolvedBy: 'compliance-team',
            resolution: 'Aprovação retroativa obtida, processo corrigido',
            impact: 'Baixo - dados permaneceram seguros',
            recommendation: 'Treinamento sobre processo de aprovação'
          }
        ],
        recommendations: [
          'Implementar controles de acesso mais granulares',
          'Aumentar frequência de treinamentos de segurança',
          'Revisar política de exportação de dados',
          'Implementar sistema de aprovação em tempo real'
        ],
        attachments: [
          {
            name: 'relatorio_lgpd_outubro_2025.pdf',
            url: '/compliance/relatorio_lgpd_outubro_2025.pdf',
            type: 'application/pdf'
          }
        ]
      }
    ]

    // Alertas de segurança
    this.securityAlerts = [
      {
        id: 'alert-001',
        type: 'suspicious_login',
        severity: 'medium',
        title: 'Tentativas de login suspeitas',
        description: 'Múltiplas tentativas de login falhadas do mesmo IP em horário não comercial',
        detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        ipAddress: '203.45.67.89',
        relatedEvents: ['audit-004', 'audit-011', 'audit-015'],
        status: 'investigating',
        assignedTo: 'security-team',
        actions: [
          {
            id: 'action-001',
            type: 'log_additional_info',
            description: 'Ativação de log detalhado para IP suspeito',
            executedAt: new Date(Date.now() - 90 * 60 * 1000),
            executedBy: 'system',
            result: 'success'
          },
          {
            id: 'action-002',
            type: 'notify_admin',
            description: 'Notificação enviada para equipe de segurança',
            executedAt: new Date(Date.now() - 85 * 60 * 1000),
            executedBy: 'system',
            result: 'success'
          }
        ],
        riskScore: 65
      },
      {
        id: 'alert-002',
        type: 'mass_export',
        severity: 'high',
        title: 'Exportação massiva de dados',
        description: 'Usuario exportou grande quantidade de dados em curto período',
        detectedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        userId: 'user-005',
        relatedEvents: ['audit-020', 'audit-021', 'audit-022'],
        status: 'resolved',
        assignedTo: 'compliance-team',
        actions: [
          {
            id: 'action-003',
            type: 'require_2fa',
            description: 'Solicitação de autenticação adicional para próximas exportações',
            executedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
            executedBy: 'security-system',
            result: 'success'
          }
        ],
        riskScore: 80
      }
    ]

    // Políticas de retenção
    this.retentionPolicies = [
      {
        id: 'policy-001',
        name: 'Logs de Auditoria',
        description: 'Retenção de logs de auditoria conforme LGPD e ISO 27001',
        dataType: 'audit_logs',
        retentionPeriod: 2555, // 7 anos
        archivePeriod: 1825, // 5 anos
        deletionMethod: 'anonymize',
        isActive: true,
        createdAt: new Date(2025, 0, 1),
        lastApplied: new Date(Date.now() - 24 * 60 * 60 * 1000),
        nextExecution: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        id: 'policy-002',
        name: 'Dados de Pacientes',
        description: 'Retenção de dados clínicos conforme regulamentação médica',
        dataType: 'patient_data',
        retentionPeriod: 7300, // 20 anos
        archivePeriod: 3650, // 10 anos
        deletionMethod: 'anonymize',
        isActive: true,
        createdAt: new Date(2025, 0, 1),
        lastApplied: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextExecution: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'policy-003',
        name: 'Registros Financeiros',
        description: 'Retenção de dados financeiros para auditoria fiscal',
        dataType: 'financial_records',
        retentionPeriod: 1825, // 5 anos
        archivePeriod: 1095, // 3 anos
        deletionMethod: 'encrypt',
        isActive: true,
        createdAt: new Date(2025, 0, 1),
        lastApplied: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        nextExecution: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ]

    // Solicitações de privacidade
    this.privacyRequests = [
      {
        id: 'privacy-001',
        type: 'access',
        status: 'completed',
        patientId: 'patient-001',
        patientName: 'Maria Silva',
        requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        completionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        assignedTo: 'privacy-officer',
        description: 'Solicitação de acesso a todos os dados pessoais armazenados',
        dataExported: {
          filename: 'dados_maria_silva.pdf',
          url: '/privacy/dados_maria_silva.pdf',
          generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        verificationMethod: 'document',
        isVerified: true
      },
      {
        id: 'privacy-002',
        type: 'erasure',
        status: 'pending',
        patientId: 'patient-010',
        patientName: 'Carlos Santos',
        requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        assignedTo: 'privacy-officer',
        description: 'Solicitação de exclusão de todos os dados pessoais (direito ao esquecimento)',
        justification: 'Paciente não deseja mais manter vínculo com a clínica',
        verificationMethod: 'in_person',
        isVerified: false
      }
    ]
  }

  // Logging de eventos
  public logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): string {
    const auditEvent: AuditEvent = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...event
    }

    this.auditEvents.push(auditEvent)

    // Verificar se o evento requer análise de segurança
    this.analyzeEventForSecurity(auditEvent)

    return auditEvent.id
  }

  private analyzeEventForSecurity(event: AuditEvent): void {
    // Detectar padrões suspeitos
    if (event.outcome === 'failure' && event.action.category === 'authentication') {
      this.checkForBruteForce(event)
    }

    if (event.action.type === 'export' && event.resource.category === 'phi') {
      this.checkForMassExport(event)
    }

    if (event.riskLevel === 'high' || event.riskLevel === 'critical') {
      this.createSecurityAlert(event)
    }
  }

  private checkForBruteForce(event: AuditEvent): void {
    const recentFailures = this.auditEvents.filter(e => 
      e.ipAddress === event.ipAddress &&
      e.action.category === 'authentication' &&
      e.outcome === 'failure' &&
      e.timestamp > new Date(Date.now() - 15 * 60 * 1000) // últimos 15 minutos
    )

    if (recentFailures.length >= 5) {
      this.securityAlerts.push({
        id: `alert-${Date.now()}`,
        type: 'suspicious_login',
        severity: 'high',
        title: 'Possível ataque de força bruta detectado',
        description: `${recentFailures.length} tentativas de login falhadas do IP ${event.ipAddress}`,
        detectedAt: new Date(),
        ipAddress: event.ipAddress,
        relatedEvents: recentFailures.map(e => e.id),
        status: 'open',
        actions: [],
        riskScore: 85
      })
    }
  }

  private checkForMassExport(event: AuditEvent): void {
    const recentExports = this.auditEvents.filter(e =>
      e.userId === event.userId &&
      e.action.type === 'export' &&
      e.timestamp > new Date(Date.now() - 60 * 60 * 1000) // última hora
    )

    if (recentExports.length >= 3) {
      this.securityAlerts.push({
        id: `alert-${Date.now()}`,
        type: 'mass_export',
        severity: 'medium',
        title: 'Exportação massiva de dados detectada',
        description: `Usuário ${event.userName} realizou ${recentExports.length} exportações na última hora`,
        detectedAt: new Date(),
        userId: event.userId,
        relatedEvents: recentExports.map(e => e.id),
        status: 'open',
        actions: [],
        riskScore: 70
      })
    }
  }

  private createSecurityAlert(event: AuditEvent): void {
    this.securityAlerts.push({
      id: `alert-${Date.now()}`,
      type: 'unusual_activity',
      severity: event.riskLevel === 'critical' ? 'critical' : 'high',
      title: 'Atividade de alto risco detectada',
      description: `Evento de ${event.riskLevel} risco: ${event.action.description}`,
      detectedAt: new Date(),
      userId: event.userId,
      relatedEvents: [event.id],
      status: 'open',
      actions: [],
      riskScore: event.riskLevel === 'critical' ? 95 : 80
    })
  }

  // Consulta de eventos
  public getAuditEvents(filter: AuditFilter = {}, limit?: number): AuditEvent[] {
    let events = [...this.auditEvents]

    // Aplicar filtros
    if (filter.userId) {
      events = events.filter(e => e.userId === filter.userId)
    }
    if (filter.userRole) {
      events = events.filter(e => e.userRole === filter.userRole)
    }
    if (filter.action) {
      events = events.filter(e => e.action.type === filter.action)
    }
    if (filter.resource) {
      events = events.filter(e => e.resource.type === filter.resource)
    }
    if (filter.outcome) {
      events = events.filter(e => e.outcome === filter.outcome)
    }
    if (filter.riskLevel) {
      events = events.filter(e => e.riskLevel === filter.riskLevel)
    }
    if (filter.startDate) {
      events = events.filter(e => e.timestamp >= filter.startDate!)
    }
    if (filter.endDate) {
      events = events.filter(e => e.timestamp <= filter.endDate!)
    }
    if (filter.ipAddress) {
      events = events.filter(e => e.ipAddress.includes(filter.ipAddress!))
    }
    if (filter.complianceFlag) {
      events = events.filter(e => e.compliance[filter.complianceFlag!])
    }
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase()
      events = events.filter(e => 
        e.action.description.toLowerCase().includes(term) ||
        e.userName.toLowerCase().includes(term) ||
        e.resourceName?.toLowerCase().includes(term)
      )
    }

    // Ordenar por timestamp (mais recente primeiro)
    events = events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    return limit ? events.slice(0, limit) : events
  }

  // Relatórios de compliance
  public generateComplianceReport(
    type: ComplianceReport['type'],
    startDate: Date,
    endDate: Date
  ): Promise<string> {
    return new Promise((resolve) => {
      const reportId = `report-${type}-${Date.now()}`
      
      // Simular geração de relatório
      setTimeout(() => {
        const eventsInPeriod = this.auditEvents.filter(e =>
          e.timestamp >= startDate && e.timestamp <= endDate
        )

        const report: ComplianceReport = {
          id: reportId,
          type,
          name: `Relatório ${type.toUpperCase()} - ${startDate.toLocaleDateString()} a ${endDate.toLocaleDateString()}`,
          description: `Relatório de conformidade ${type.toUpperCase()} para o período especificado`,
          period: { startDate, endDate },
          generatedAt: new Date(),
          generatedBy: 'system',
          status: 'completed',
          metrics: {
            totalEvents: eventsInPeriod.length,
            highRiskEvents: eventsInPeriod.filter(e => e.riskLevel === 'high' || e.riskLevel === 'critical').length,
            violations: Math.floor(eventsInPeriod.length * 0.02), // 2% de violações simuladas
            dataAccessEvents: eventsInPeriod.filter(e => e.action.type === 'read').length,
            unauthorizedAttempts: eventsInPeriod.filter(e => e.outcome === 'failure').length,
            dataExports: eventsInPeriod.filter(e => e.action.type === 'export').length,
            userSessions: new Set(eventsInPeriod.map(e => e.sessionId)).size,
            averageSessionDuration: 45,
            complianceScore: Math.random() * 10 + 90 // 90-100%
          },
          violations: [],
          recommendations: [
            'Manter treinamentos regulares de segurança',
            'Revisar políticas de acesso trimestralmente',
            'Implementar monitoramento contínuo',
            'Atualizar documentação de compliance'
          ],
          attachments: [
            {
              name: `relatorio_${type}_${Date.now()}.pdf`,
              url: `/compliance/relatorio_${type}_${Date.now()}.pdf`,
              type: 'application/pdf'
            }
          ]
        }

        this.complianceReports.push(report)
        resolve(reportId)
      }, 2000)
    })
  }

  public getComplianceReports(): ComplianceReport[] {
    return this.complianceReports.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())
  }

  // Alertas de segurança
  public getSecurityAlerts(status?: SecurityAlert['status']): SecurityAlert[] {
    let alerts = [...this.securityAlerts]
    
    if (status) {
      alerts = alerts.filter(alert => alert.status === status)
    }
    
    return alerts.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime())
  }

  public resolveSecurityAlert(alertId: string, resolution: string, resolvedBy: string): boolean {
    const alert = this.securityAlerts.find(a => a.id === alertId)
    if (!alert) return false

    alert.status = 'resolved'
    alert.actions.push({
      id: `action-${Date.now()}`,
      type: 'escalate',
      description: `Resolvido: ${resolution}`,
      executedAt: new Date(),
      executedBy: resolvedBy,
      result: 'success'
    })

    return true
  }

  // Políticas de retenção
  public getRetentionPolicies(): DataRetentionPolicy[] {
    return this.retentionPolicies
  }

  public executeRetentionPolicy(policyId: string): Promise<{ processed: number; archived: number; deleted: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const policy = this.retentionPolicies.find(p => p.id === policyId)
        if (policy) {
          policy.lastApplied = new Date()
          policy.nextExecution = new Date(Date.now() + 24 * 60 * 60 * 1000) // próximo dia
        }

        resolve({
          processed: Math.floor(Math.random() * 1000) + 100,
          archived: Math.floor(Math.random() * 50) + 10,
          deleted: Math.floor(Math.random() * 25) + 5
        })
      }, 3000)
    })
  }

  // Solicitações de privacidade (LGPD/GDPR)
  public getPrivacyRequests(status?: PrivacyRequest['status']): PrivacyRequest[] {
    let requests = [...this.privacyRequests]
    
    if (status) {
      requests = requests.filter(req => req.status === status)
    }
    
    return requests.sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime())
  }

  public processPrivacyRequest(requestId: string, action: 'approve' | 'reject', notes?: string): boolean {
    const request = this.privacyRequests.find(r => r.id === requestId)
    if (!request) return false

    if (action === 'approve') {
      request.status = 'in_progress'
      if (request.type === 'access') {
        // Simular geração de arquivo
        setTimeout(() => {
          request.status = 'completed'
          request.completionDate = new Date()
          request.dataExported = {
            filename: `dados_${request.patientName.toLowerCase().replace(/\s+/g, '_')}.pdf`,
            url: `/privacy/dados_${request.patientId}.pdf`,
            generatedAt: new Date()
          }
        }, 2000)
      }
    } else {
      request.status = 'rejected'
      request.justification = notes
    }

    return true
  }

  // Estatísticas e métricas
  public getAuditStatistics(): {
    totalEvents: number
    eventsByRisk: { [key: string]: number }
    eventsByType: { [key: string]: number }
    complianceScore: number
    activeAlerts: number
    recentViolations: number
    topUsers: { name: string; events: number }[]
    topResources: { type: string; accesses: number }[]
  } {
    const totalEvents = this.auditEvents.length
    const activeAlerts = this.securityAlerts.filter(a => a.status === 'open').length
    const recentViolations = this.complianceReports
      .flatMap(r => r.violations)
      .filter(v => !v.resolvedAt).length

    const eventsByRisk = this.auditEvents.reduce((acc, event) => {
      acc[event.riskLevel] = (acc[event.riskLevel] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    const eventsByType = this.auditEvents.reduce((acc, event) => {
      acc[event.action.type] = (acc[event.action.type] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    const userEventCounts = this.auditEvents.reduce((acc, event) => {
      if (event.userRole !== 'system') {
        acc[event.userName] = (acc[event.userName] || 0) + 1
      }
      return acc
    }, {} as { [key: string]: number })

    const topUsers = Object.entries(userEventCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, events]) => ({ name, events }))

    const resourceAccessCounts = this.auditEvents.reduce((acc, event) => {
      acc[event.resource.type] = (acc[event.resource.type] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    const topResources = Object.entries(resourceAccessCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, accesses]) => ({ type, accesses }))

    return {
      totalEvents,
      eventsByRisk,
      eventsByType,
      complianceScore: this.calculateComplianceScore(),
      activeAlerts,
      recentViolations,
      topUsers,
      topResources
    }
  }

  private calculateComplianceScore(): number {
    const totalEvents = this.auditEvents.length
    if (totalEvents === 0) return 100

    const violations = this.complianceReports.reduce((sum, report) => sum + report.violations.length, 0)
    const highRiskEvents = this.auditEvents.filter(e => e.riskLevel === 'high' || e.riskLevel === 'critical').length
    
    const violationPenalty = (violations / totalEvents) * 30
    const riskPenalty = (highRiskEvents / totalEvents) * 20
    
    return Math.max(0, 100 - violationPenalty - riskPenalty)
  }

  // Utilitários
  public maskSensitiveData(value: any, fieldType: string): string {
    if (!value) return ''
    
    const str = String(value)
    switch (fieldType) {
      case 'cpf':
        return str.replace(/(\d{3})\d{3}(\d{3})/, '$1.***.***-$2')
      case 'email':
        return str.replace(/(.{2})(.*)(@.*)/, '$1***$3')
      case 'phone':
        return str.replace(/(\(\d{2}\) \d{2})\d{4}(\d{4})/, '$1****-$2')
      case 'credit_card':
        return str.replace(/(\d{4})\d{8}(\d{4})/, '$1****-****-$2')
      default:
        return str.length > 10 ? str.substring(0, 3) + '***' + str.substring(str.length - 3) : '***'
    }
  }

  public getRiskLevelColor(riskLevel: AuditEvent['riskLevel']): string {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  public getOutcomeColor(outcome: AuditEvent['outcome']): string {
    switch (outcome) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'failure': return 'text-red-600 bg-red-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  public formatEventDescription(event: AuditEvent): string {
    let description = event.action.description
    
    if (event.resourceName) {
      description += ` (${event.resourceName})`
    }
    
    if (event.details.reason) {
      description += ` - ${event.details.reason}`
    }
    
    return description
  }
}

export const auditService = AuditService.getInstance()

export type {
  AuditEvent,
  AuditAction,
  AuditResource,
  AuditDetails,
  AuditChange,
  ComplianceFlags,
  AuditFilter,
  ComplianceReport,
  ComplianceMetrics,
  ComplianceViolation,
  SecurityAlert,
  SecurityAction,
  DataRetentionPolicy,
  PrivacyRequest
}