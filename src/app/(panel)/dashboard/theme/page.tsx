'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Palette,
  Eye,
  Save,
  Download,
  Upload,
  Monitor,
  Smartphone,
  Tablet,
  Brush,
  Type,
  Layout,
  Image,
  Settings,
  Star,
  Globe,
  Code,
  Camera,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { getSession } from 'next-auth/react'
import { 
  themeService, 
  type ClinicBranding,
  type ThemeTemplate,
  themeTemplates,
  colorPalettes,
  getFontFamilies,
  getLayoutOptions,
  getHeaderStyleOptions,
  generateColorVariations
} from '@/lib/theme-customization'

export default function ThemeCustomizationPage() {
  const [userPlan, setUserPlan] = useState<string>('BASIC')
  const [activeTab, setActiveTab] = useState<'templates' | 'colors' | 'typography' | 'layout' | 'content' | 'advanced'>('templates')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [showPreview, setShowPreview] = useState(false)
  
  const [currentBranding, setCurrentBranding] = useState<ClinicBranding | null>(null)
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  useEffect(() => {
    // Verificar plano do usuário
    const checkUserPlan = async () => {
      try {
        const session = await getSession()
        setUserPlan(session?.user?.plan || 'BASIC')
      } catch (error) {
        console.error('Erro ao verificar plano:', error)
      }
    }
    checkUserPlan()

    // Carregar branding atual
    loadCurrentBranding()
  }, [])

  // Se não for plano professional, mostrar upgrade
  if (userPlan !== 'PROFESSIONAL') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <Palette className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Personalização de Temas
          </h2>
          <p className="text-gray-600 mb-6">
            Customize completamente o visual do seu site público com cores, layouts, fontes e muito mais.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Esta funcionalidade está disponível apenas no plano Professional.
          </p>
          <Link href="/dashboard/plans">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Star className="w-4 h-4 mr-2" />
              Fazer Upgrade
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const loadCurrentBranding = () => {
    const branding = themeService.getBranding('current-clinic')
    setCurrentBranding(branding)
  }

  const handleBrandingUpdate = (updates: Partial<ClinicBranding>) => {
    if (!currentBranding) return

    const updated = { ...currentBranding, ...updates }
    setCurrentBranding(updated)
    setUnsavedChanges(true)
  }

  const handleSave = () => {
    if (!currentBranding) return

    try {
      themeService.updateBranding('current-clinic', currentBranding)
      setUnsavedChanges(false)
      console.log('Branding salvo com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar branding:', error)
    }
  }

  const applyTemplate = (templateId: string) => {
    const template = themeTemplates.find(t => t.id === templateId)
    if (!template) return

    handleBrandingUpdate({
      colors: template.colors,
      layout: template.layout,
      headerStyle: template.headerStyle,
      fontFamily: template.fontFamily
    })
  }

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates Populares</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themeTemplates.filter(t => t.isPopular).map(template => (
            <div key={template.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-4xl">{template.category === 'medical' ? '🏥' : template.category === 'modern' ? '✨' : template.category === 'minimal' ? '◽' : '📋'}</span>
                </div>
                {template.isPopular && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                
                {/* Color Preview */}
                <div className="flex space-x-1 mb-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: template.colors.primary }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: template.colors.secondary }}></div>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: template.colors.accent }}></div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => applyTemplate(template.id)}
                    size="sm"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    Aplicar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Todos os Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {themeTemplates.map(template => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">{template.name}</h4>
                <span className="text-lg">{template.category === 'medical' ? '🏥' : template.category === 'modern' ? '✨' : template.category === 'minimal' ? '◽' : '📋'}</span>
              </div>
              <div className="flex space-x-1 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.colors.primary }}></div>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.colors.secondary }}></div>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.colors.accent }}></div>
              </div>
              <Button
                onClick={() => applyTemplate(template.id)}
                size="sm"
                variant="outline"
                className="w-full"
              >
                Aplicar
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderColors = () => (
    <div className="space-y-6">
      {/* Paletas Predefinidas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Paletas de Cores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(colorPalettes).map(([key, palette]) => (
            <div key={key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 capitalize">{key.replace('-', ' ')}</h4>
                <Button
                  onClick={() => handleBrandingUpdate({ colors: palette })}
                  size="sm"
                  variant="outline"
                >
                  Aplicar
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="w-full h-8 rounded" style={{ backgroundColor: palette.primary }}></div>
                  <p className="text-xs text-gray-500 mt-1">Primária</p>
                </div>
                <div>
                  <div className="w-full h-8 rounded" style={{ backgroundColor: palette.secondary }}></div>
                  <p className="text-xs text-gray-500 mt-1">Secundária</p>
                </div>
                <div>
                  <div className="w-full h-8 rounded" style={{ backgroundColor: palette.accent }}></div>
                  <p className="text-xs text-gray-500 mt-1">Destaque</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customização Avançada */}
      {currentBranding && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalizar Cores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(currentBranding.colors).map(([colorKey, colorValue]) => (
              <div key={colorKey}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {colorKey === 'textSecondary' ? 'Texto Secundário' : colorKey}
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={colorValue}
                    onChange={(e) => handleBrandingUpdate({
                      colors: {
                        ...currentBranding.colors,
                        [colorKey]: e.target.value
                      }
                    })}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorValue}
                    onChange={(e) => handleBrandingUpdate({
                      colors: {
                        ...currentBranding.colors,
                        [colorKey]: e.target.value
                      }
                    })}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderTypography = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Tipografia</h3>
        
        {currentBranding && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Família da Fonte
              </label>
              <select
                value={currentBranding.fontFamily}
                onChange={(e) => handleBrandingUpdate({ fontFamily: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {getFontFamilies().map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamanho da Fonte
              </label>
              <select
                value={currentBranding.fontSize}
                onChange={(e) => handleBrandingUpdate({ fontSize: e.target.value as any })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="small">Pequeno</option>
                <option value="medium">Médio</option>
                <option value="large">Grande</option>
              </select>
            </div>
          </div>
        )}

        {/* Preview de Tipografia */}
        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
          <div 
            className="space-y-2" 
            style={{ 
              fontFamily: currentBranding?.fontFamily || 'Inter',
              fontSize: currentBranding?.fontSize === 'small' ? '14px' : currentBranding?.fontSize === 'large' ? '18px' : '16px'
            }}
          >
            <h1 className="text-2xl font-bold">Título Principal</h1>
            <h2 className="text-xl font-semibold">Subtítulo</h2>
            <p className="text-gray-600">
              Este é um exemplo de como o texto ficará no seu site público. 
              A fonte selecionada será aplicada em todo o conteúdo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderLayout = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Opções de Layout</h3>
        
        {currentBranding && (
          <div className="space-y-6">
            {/* Layout Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Estilo de Layout
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getLayoutOptions().map(option => (
                  <div
                    key={option.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      currentBranding.layout === option.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleBrandingUpdate({ layout: option.id })}
                  >
                    <h4 className="font-medium text-gray-900 mb-1">{option.name}</h4>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Header Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Estilo do Cabeçalho
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getHeaderStyleOptions().map(option => (
                  <div
                    key={option.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      currentBranding.headerStyle === option.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleBrandingUpdate({ headerStyle: option.id })}
                  >
                    <h4 className="font-medium text-gray-900 mb-1">{option.name}</h4>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Opções Adicionais */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Opções Adicionais
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={currentBranding.enableAnimations}
                    onChange={(e) => handleBrandingUpdate({ enableAnimations: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Habilitar animações</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={currentBranding.enableDarkMode}
                    onChange={(e) => handleBrandingUpdate({ enableDarkMode: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Suporte ao modo escuro</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Palette className="w-8 h-8 text-emerald-600" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Personalização de Temas
                </h1>
                <p className="text-sm text-gray-600">
                  Customize o visual do seu site público
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Device Preview Toggle */}
              <div className="hidden sm:flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-2 rounded ${previewDevice === 'desktop' ? 'bg-emerald-600 text-white' : 'text-gray-600'}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-2 rounded ${previewDevice === 'tablet' ? 'bg-emerald-600 text-white' : 'text-gray-600'}`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-2 rounded ${previewDevice === 'mobile' ? 'bg-emerald-600 text-white' : 'text-gray-600'}`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Ocultar' : 'Preview'}
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={!unsavedChanges}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {unsavedChanges ? 'Salvar Alterações' : 'Salvo'}
              </Button>
            </div>
          </div>

          {/* Navegação de Tabs */}
          <div className="flex space-x-1 mt-4 overflow-x-auto">
            {[
              { id: 'templates', label: 'Templates', icon: Layout },
              { id: 'colors', label: 'Cores', icon: Palette },
              { id: 'typography', label: 'Tipografia', icon: Type },
              { id: 'layout', label: 'Layout', icon: Monitor },
              { id: 'content', label: 'Conteúdo', icon: Globe },
              { id: 'advanced', label: 'Avançado', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Content Area */}
          <div className="xl:col-span-2">
            {activeTab === 'templates' && renderTemplates()}
            {activeTab === 'colors' && renderColors()}
            {activeTab === 'typography' && renderTypography()}
            {activeTab === 'layout' && renderLayout()}
            {activeTab === 'content' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalização de Conteúdo</h3>
                <p className="text-gray-600">Em desenvolvimento...</p>
              </div>
            )}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">CSS Customizado</h3>
                  <textarea
                    value={currentBranding?.customCSS || ''}
                    onChange={(e) => handleBrandingUpdate({ customCSS: e.target.value })}
                    rows={12}
                    placeholder="/* Adicione seu CSS customizado aqui */"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Adicione CSS customizado para personalizações avançadas. Use com cuidado.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Importar/Exportar</h3>
                  <div className="flex space-x-3">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Tema
                    </Button>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Importar Tema
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview Sidebar */}
          {showPreview && (
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Globe className="w-4 h-4 mr-2" />
                      Ver Site
                    </Button>
                  </div>
                </div>
                
                <div className={`border border-gray-300 rounded-lg overflow-hidden ${
                  previewDevice === 'mobile' ? 'max-w-sm mx-auto' :
                  previewDevice === 'tablet' ? 'max-w-md mx-auto' : 'w-full'
                }`}>
                  <div className="bg-gradient-to-br from-blue-50 to-emerald-50 p-8 text-center">
                    <div 
                      className="w-12 h-12 rounded-full mx-auto mb-4"
                      style={{ backgroundColor: currentBranding?.colors.primary || '#059669' }}
                    ></div>
                    <h2 
                      className="text-xl font-bold mb-2"
                      style={{ 
                        color: currentBranding?.colors.text || '#1F2937',
                        fontFamily: currentBranding?.fontFamily || 'Inter'
                      }}
                    >
                      Clínica Exemplo
                    </h2>
                    <p 
                      className="text-sm mb-4"
                      style={{ color: currentBranding?.colors.textSecondary || '#6B7280' }}
                    >
                      {currentBranding?.welcomeMessage || 'Bem-vindo à nossa clínica!'}
                    </p>
                    <button 
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                      style={{ backgroundColor: currentBranding?.colors.primary || '#059669' }}
                    >
                      Agendar Consulta
                    </button>
                  </div>
                  
                  <div className="p-4" style={{ backgroundColor: currentBranding?.colors.surface || '#F0FDF4' }}>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {unsavedChanges && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center text-yellow-800 text-sm">
                      <Zap className="w-4 h-4 mr-2" />
                      Alterações não salvas
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}