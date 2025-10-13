export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
}

export interface ClinicBranding {
  id: string
  clinicId: string
  
  // Logo and Images
  logo?: string
  favicon?: string
  backgroundImage?: string
  
  // Colors
  colors: ThemeColors
  
  // Typography
  fontFamily: string
  fontSize: 'small' | 'medium' | 'large'
  
  // Layout Options
  layout: 'modern' | 'classic' | 'minimal' | 'professional'
  headerStyle: 'fixed' | 'static' | 'transparent'
  
  // Content Customization
  welcomeMessage?: string
  customCSS?: string
  
  // Contact Information Display
  showPhone: boolean
  showEmail: boolean
  showAddress: boolean
  showSocialMedia: boolean
  
  // SEO
  metaTitle?: string
  metaDescription?: string
  
  // Advanced Options
  enableAnimations: boolean
  enableDarkMode: boolean
  
  // Status
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ThemeTemplate {
  id: string
  name: string
  description: string
  preview: string
  category: 'medical' | 'modern' | 'classic' | 'minimal'
  colors: ThemeColors
  layout: ClinicBranding['layout']
  headerStyle: ClinicBranding['headerStyle']
  fontFamily: string
  isPopular: boolean
}

export interface CustomPage {
  id: string
  clinicId: string
  title: string
  slug: string
  content: string
  isPublished: boolean
  showInMenu: boolean
  menuOrder?: number
  seoTitle?: string
  seoDescription?: string
  createdAt: Date
  updatedAt: Date
}

// Predefined color palettes
export const colorPalettes: Record<string, ThemeColors> = {
  'medical-blue': {
    primary: '#2563EB',
    secondary: '#64748B',
    accent: '#10B981',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1E293B',
    textSecondary: '#64748B'
  },
  'dental-green': {
    primary: '#059669',
    secondary: '#6B7280',
    accent: '#3B82F6',
    background: '#FFFFFF',
    surface: '#F0FDF4',
    text: '#1F2937',
    textSecondary: '#6B7280'
  },
  'modern-teal': {
    primary: '#0D9488',
    secondary: '#64748B',
    accent: '#F59E0B',
    background: '#FFFFFF',
    surface: '#F0FDFA',
    text: '#134E4A',
    textSecondary: '#64748B'
  },
  'professional-navy': {
    primary: '#1E40AF',
    secondary: '#475569',
    accent: '#DC2626',
    background: '#FFFFFF',
    surface: '#F1F5F9',
    text: '#1E293B',
    textSecondary: '#475569'
  },
  'warm-orange': {
    primary: '#EA580C',
    secondary: '#6B7280',
    accent: '#7C3AED',
    background: '#FFFBEB',
    surface: '#FEF3C7',
    text: '#92400E',
    textSecondary: '#6B7280'
  },
  'elegant-purple': {
    primary: '#7C3AED',
    secondary: '#64748B',
    accent: '#F59E0B',
    background: '#FFFFFF',
    surface: '#FAF5FF',
    text: '#581C87',
    textSecondary: '#64748B'
  }
}

// Predefined theme templates
export const themeTemplates: ThemeTemplate[] = [
  {
    id: 'medical-modern',
    name: 'Médico Moderno',
    description: 'Design limpo e profissional para clínicas médicas',
    preview: '/templates/medical-modern.jpg',
    category: 'medical',
    colors: colorPalettes['medical-blue'],
    layout: 'modern',
    headerStyle: 'fixed',
    fontFamily: 'Inter',
    isPopular: true
  },
  {
    id: 'dental-care',
    name: 'Cuidado Dental',
    description: 'Template especializado para clínicas odontológicas',
    preview: '/templates/dental-care.jpg',
    category: 'medical',
    colors: colorPalettes['dental-green'],
    layout: 'professional',
    headerStyle: 'static',
    fontFamily: 'Poppins',
    isPopular: true
  },
  {
    id: 'minimalist-clinic',
    name: 'Clínica Minimalista',
    description: 'Abordagem minimalista e elegante',
    preview: '/templates/minimalist-clinic.jpg',
    category: 'minimal',
    colors: colorPalettes['modern-teal'],
    layout: 'minimal',
    headerStyle: 'transparent',
    fontFamily: 'Roboto',
    isPopular: false
  },
  {
    id: 'classic-medical',
    name: 'Médico Clássico',
    description: 'Design tradicional e confiável',
    preview: '/templates/classic-medical.jpg',
    category: 'classic',
    colors: colorPalettes['professional-navy'],
    layout: 'classic',
    headerStyle: 'static',
    fontFamily: 'Open Sans',
    isPopular: false
  },
  {
    id: 'modern-wellness',
    name: 'Bem-estar Moderno',
    description: 'Para clínicas de bem-estar e estética',
    preview: '/templates/modern-wellness.jpg',
    category: 'modern',
    colors: colorPalettes['warm-orange'],
    layout: 'modern',
    headerStyle: 'transparent',
    fontFamily: 'Nunito',
    isPopular: false
  },
  {
    id: 'elegant-practice',
    name: 'Consultório Elegante',
    description: 'Sofisticação e elegância',
    preview: '/templates/elegant-practice.jpg',
    category: 'modern',
    colors: colorPalettes['elegant-purple'],
    layout: 'professional',
    headerStyle: 'fixed',
    fontFamily: 'Playfair Display',
    isPopular: true
  }
]

// Service principal para customização
export class ThemeCustomizationService {
  private branding: Map<string, ClinicBranding> = new Map()
  private customPages: Map<string, CustomPage[]> = new Map()

  constructor() {
    this.initializeDefaultBranding()
  }

  // Inicializar branding padrão
  private initializeDefaultBranding() {
    const defaultBranding: ClinicBranding = {
      id: 'default-branding',
      clinicId: 'default',
      colors: colorPalettes['dental-green'],
      fontFamily: 'Inter',
      fontSize: 'medium',
      layout: 'modern',
      headerStyle: 'fixed',
      welcomeMessage: 'Bem-vindo à nossa clínica! Oferecemos cuidados odontológicos de qualidade com tecnologia avançada e atendimento humanizado.',
      showPhone: true,
      showEmail: true,
      showAddress: true,
      showSocialMedia: false,
      enableAnimations: true,
      enableDarkMode: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.branding.set('default', defaultBranding)
  }

  // CRUD para branding
  createBranding(clinicId: string, data: Partial<ClinicBranding>): ClinicBranding {
    const id = `branding-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const branding: ClinicBranding = {
      id,
      clinicId,
      colors: data.colors || colorPalettes['dental-green'],
      fontFamily: data.fontFamily || 'Inter',
      fontSize: data.fontSize || 'medium',
      layout: data.layout || 'modern',
      headerStyle: data.headerStyle || 'fixed',
      logo: data.logo,
      favicon: data.favicon,
      backgroundImage: data.backgroundImage,
      welcomeMessage: data.welcomeMessage,
      customCSS: data.customCSS,
      showPhone: data.showPhone ?? true,
      showEmail: data.showEmail ?? true,
      showAddress: data.showAddress ?? true,
      showSocialMedia: data.showSocialMedia ?? false,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      enableAnimations: data.enableAnimations ?? true,
      enableDarkMode: data.enableDarkMode ?? false,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.branding.set(clinicId, branding)
    return branding
  }

  updateBranding(clinicId: string, updates: Partial<ClinicBranding>): ClinicBranding | null {
    const existing = this.branding.get(clinicId)
    if (!existing) return null

    const updated: ClinicBranding = {
      ...existing,
      ...updates,
      id: existing.id,
      clinicId,
      updatedAt: new Date()
    }

    this.branding.set(clinicId, updated)
    return updated
  }

  getBranding(clinicId: string): ClinicBranding | null {
    return this.branding.get(clinicId) || this.branding.get('default') || null
  }

  // Aplicar template
  applyTemplate(clinicId: string, templateId: string): ClinicBranding | null {
    const template = themeTemplates.find(t => t.id === templateId)
    if (!template) return null

    const existing = this.getBranding(clinicId)
    
    const updated = this.updateBranding(clinicId, {
      colors: template.colors,
      layout: template.layout,
      headerStyle: template.headerStyle,
      fontFamily: template.fontFamily
    })

    return updated
  }

  // Gerar CSS customizado
  generateCustomCSS(branding: ClinicBranding): string {
    const { colors, fontFamily, fontSize } = branding
    
    const fontSizes = {
      small: { base: '14px', h1: '24px', h2: '20px', h3: '18px' },
      medium: { base: '16px', h1: '32px', h2: '24px', h3: '20px' },
      large: { base: '18px', h1: '40px', h2: '28px', h3: '24px' }
    }

    const sizes = fontSizes[fontSize]

    return `
      :root {
        --color-primary: ${colors.primary};
        --color-secondary: ${colors.secondary};
        --color-accent: ${colors.accent};
        --color-background: ${colors.background};
        --color-surface: ${colors.surface};
        --color-text: ${colors.text};
        --color-text-secondary: ${colors.textSecondary};
        
        --font-family: '${fontFamily}', sans-serif;
        --font-size-base: ${sizes.base};
        --font-size-h1: ${sizes.h1};
        --font-size-h2: ${sizes.h2};
        --font-size-h3: ${sizes.h3};
      }

      * {
        font-family: var(--font-family);
      }

      body {
        font-size: var(--font-size-base);
        background-color: var(--color-background);
        color: var(--color-text);
      }

      .btn-primary {
        background-color: var(--color-primary);
        border-color: var(--color-primary);
      }

      .btn-primary:hover {
        background-color: ${this.darkenColor(colors.primary, 10)};
        border-color: ${this.darkenColor(colors.primary, 10)};
      }

      .text-primary {
        color: var(--color-primary);
      }

      .bg-primary {
        background-color: var(--color-primary);
      }

      .bg-surface {
        background-color: var(--color-surface);
      }

      h1 { font-size: var(--font-size-h1); }
      h2 { font-size: var(--font-size-h2); }
      h3 { font-size: var(--font-size-h3); }

      ${branding.customCSS || ''}
    `
  }

  // Utilitários
  private darkenColor(color: string, percent: number): string {
    // Implementação simplificada para escurecer cores
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) - amt
    const G = (num >> 8 & 0x00FF) - amt
    const B = (num & 0x0000FF) - amt
    
    return '#' + (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1)
  }

  // Validar configuração
  validateBranding(branding: Partial<ClinicBranding>): string[] {
    const errors: string[] = []

    if (branding.colors) {
      // Validar formato de cores
      Object.entries(branding.colors).forEach(([key, value]) => {
        if (!this.isValidColor(value)) {
          errors.push(`Cor ${key} inválida: ${value}`)
        }
      })
    }

    if (branding.customCSS && branding.customCSS.length > 10000) {
      errors.push('CSS customizado muito longo (máximo 10KB)')
    }

    if (branding.welcomeMessage && branding.welcomeMessage.length > 500) {
      errors.push('Mensagem de boas-vindas muito longa (máximo 500 caracteres)')
    }

    return errors
  }

  private isValidColor(color: string): boolean {
    // Validação básica de cor hexadecimal
    return /^#[0-9A-F]{6}$/i.test(color)
  }

  // Páginas customizadas
  createCustomPage(clinicId: string, data: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>): CustomPage {
    const id = `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const page: CustomPage = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const existing = this.customPages.get(clinicId) || []
    existing.push(page)
    this.customPages.set(clinicId, existing)

    return page
  }

  getCustomPages(clinicId: string, publishedOnly = false): CustomPage[] {
    const pages = this.customPages.get(clinicId) || []
    
    if (publishedOnly) {
      return pages.filter(page => page.isPublished)
    }

    return pages.sort((a, b) => {
      if (a.menuOrder !== undefined && b.menuOrder !== undefined) {
        return a.menuOrder - b.menuOrder
      }
      return a.title.localeCompare(b.title)
    })
  }

  updateCustomPage(clinicId: string, pageId: string, updates: Partial<CustomPage>): CustomPage | null {
    const pages = this.customPages.get(clinicId) || []
    const pageIndex = pages.findIndex(p => p.id === pageId)
    
    if (pageIndex === -1) return null

    const updated = {
      ...pages[pageIndex],
      ...updates,
      id: pageId,
      updatedAt: new Date()
    }

    pages[pageIndex] = updated
    this.customPages.set(clinicId, pages)

    return updated
  }

  deleteCustomPage(clinicId: string, pageId: string): boolean {
    const pages = this.customPages.get(clinicId) || []
    const filtered = pages.filter(p => p.id !== pageId)
    
    if (filtered.length === pages.length) return false

    this.customPages.set(clinicId, filtered)
    return true
  }

  // Estatísticas e analytics
  getThemeStats(clinicId: string): {
    pageViews: number
    uniqueVisitors: number
    avgTimeOnSite: number
    mostViewedPages: string[]
    popularTemplate?: string
  } {
    // Simulação de dados analíticos
    return {
      pageViews: Math.floor(Math.random() * 1000) + 100,
      uniqueVisitors: Math.floor(Math.random() * 500) + 50,
      avgTimeOnSite: Math.floor(Math.random() * 300) + 60, // segundos
      mostViewedPages: ['home', 'servicos', 'contato', 'sobre'],
      popularTemplate: 'dental-care'
    }
  }

  // Export/Import
  exportBranding(clinicId: string): {
    branding: ClinicBranding | null
    customPages: CustomPage[]
    exportedAt: Date
  } {
    return {
      branding: this.getBranding(clinicId),
      customPages: this.getCustomPages(clinicId),
      exportedAt: new Date()
    }
  }

  importBranding(clinicId: string, data: {
    branding: ClinicBranding
    customPages: CustomPage[]
  }): boolean {
    try {
      // Importar branding
      this.branding.set(clinicId, {
        ...data.branding,
        clinicId,
        id: `imported-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // Importar páginas customizadas
      const pages = data.customPages.map(page => ({
        ...page,
        clinicId,
        id: `imported-page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }))

      this.customPages.set(clinicId, pages)
      return true
    } catch (error) {
      console.error('Erro ao importar branding:', error)
      return false
    }
  }
}

// Instância singleton do serviço
export const themeService = new ThemeCustomizationService()

// Helpers e utilitários
export const getFontFamilies = (): string[] => [
  'Inter',
  'Poppins',
  'Roboto',
  'Open Sans',
  'Nunito',
  'Playfair Display',
  'Montserrat',
  'Lato',
  'Source Sans Pro',
  'Work Sans'
]

export const getLayoutOptions = (): Array<{ id: ClinicBranding['layout']; name: string; description: string }> => [
  {
    id: 'modern',
    name: 'Moderno',
    description: 'Design contemporâneo com elementos visuais avançados'
  },
  {
    id: 'classic',
    name: 'Clássico',
    description: 'Estilo tradicional e atemporal'
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Design limpo com foco no conteúdo'
  },
  {
    id: 'professional',
    name: 'Profissional',
    description: 'Layout corporativo e confiável'
  }
]

export const getHeaderStyleOptions = (): Array<{ id: ClinicBranding['headerStyle']; name: string; description: string }> => [
  {
    id: 'fixed',
    name: 'Fixo',
    description: 'Header permanece visível durante a rolagem'
  },
  {
    id: 'static',
    name: 'Estático',
    description: 'Header normal que move com a página'
  },
  {
    id: 'transparent',
    name: 'Transparente',
    description: 'Header transparente sobre o conteúdo'
  }
]

export const generateColorVariations = (baseColor: string): string[] => {
  // Gera variações de uma cor base
  const variations: string[] = []
  
  // Implementação simplificada - em produção usar biblioteca como chroma.js
  const baseNum = parseInt(baseColor.replace('#', ''), 16)
  
  for (let i = -3; i <= 3; i++) {
    if (i === 0) {
      variations.push(baseColor)
      continue
    }
    
    const factor = i * 20
    const R = Math.max(0, Math.min(255, (baseNum >> 16) + factor))
    const G = Math.max(0, Math.min(255, ((baseNum >> 8) & 0x00FF) + factor))
    const B = Math.max(0, Math.min(255, (baseNum & 0x0000FF) + factor))
    
    const newColor = '#' + ((R << 16) | (G << 8) | B).toString(16).padStart(6, '0')
    variations.push(newColor)
  }
  
  return variations
}