'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Package,
  ArrowLeft,
  Save,
  AlertTriangle,
  DollarSign,
  MapPin,
  Calendar,
  Info,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import getSesion from '@/lib/getSession'
import { 
  inventoryService,
  type InventoryItem,
  getCategoryIcon
} from '@/lib/inventory'

export default function NewItemPage() {
  const router = useRouter()
  const [userPlan, setUserPlan] = useState<string>('BASIC')
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    currentStock: 0,
    minimumStock: 1,
    maximumStock: 100,
    unit: 'unid',
    supplierId: '',
    unitCost: 0,
    salePrice: 0,
    location: '',
    batch: '',
    expirationDate: '',
    status: 'active' as const
  })
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    // Verificar plano do usuário
    const checkUserPlan = async () => {
      try {
        const session = await getSesion()
        setUserPlan(session?.user?.plan || 'BASIC')
      } catch (error) {
        console.error('Erro ao verificar plano:', error)
      }
    }
    checkUserPlan()
  }, [])

  // Se não for plano professional, redirecionar
  if (userPlan !== 'PROFESSIONAL') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <Package className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Restrito
          </h2>
          <p className="text-gray-600 mb-6">
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

  const handleSave = () => {
    // Validar formulário
    const validationErrors: string[] = []

    if (!formData.name.trim()) {
      validationErrors.push('Nome do item é obrigatório')
    }

    if (!formData.categoryId) {
      validationErrors.push('Categoria é obrigatória')
    }

    if (!formData.supplierId) {
      validationErrors.push('Fornecedor é obrigatório')
    }

    if (formData.currentStock < 0) {
      validationErrors.push('Estoque atual não pode ser negativo')
    }

    if (formData.minimumStock < 0) {
      validationErrors.push('Estoque mínimo não pode ser negativo')
    }

    if (formData.unitCost <= 0) {
      validationErrors.push('Custo unitário deve ser maior que zero')
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    // Criar item
    try {
      const category = inventoryService.getAllCategories().find(c => c.id === formData.categoryId)
      const supplier = inventoryService.getAllSuppliers().find(s => s.id === formData.supplierId)

      if (!category || !supplier) {
        setErrors(['Categoria ou fornecedor não encontrado'])
        return
      }

      const item = inventoryService.createItem({
        name: formData.name,
        category,
        description: formData.description || undefined,
        currentStock: formData.currentStock,
        minimumStock: formData.minimumStock,
        maximumStock: formData.maximumStock || undefined,
        unit: formData.unit,
        supplier,
        unitCost: formData.unitCost,
        salePrice: formData.salePrice || undefined,
        location: formData.location || undefined,
        batch: formData.batch || undefined,
        expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : undefined,
        status: formData.status
      })

      console.log('Item criado:', item)
      router.push('/dashboard/inventory?tab=items')
    } catch (error) {
      console.error('Erro ao criar item:', error)
      setErrors(['Erro interno. Tente novamente.'])
    }
  }

  const categories = inventoryService.getAllCategories()
  const suppliers = inventoryService.getAllSuppliers()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/inventory" className="text-emerald-600 hover:text-emerald-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Novo Item de Estoque
                </h1>
                <p className="text-sm text-gray-600">
                  Adicione um novo material ou produto ao inventário
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Item
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Erros */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="text-sm font-semibold text-red-800">
                  Corrija os seguintes erros:
                </h3>
              </div>
              <ul className="list-disc list-inside text-sm text-red-700">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informações Básicas */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Item *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Resina Composta A2"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {getCategoryIcon(category.id)} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      placeholder="Descrição detalhada do item..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                      <option value="discontinued">Descontinuado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Fornecedor */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Fornecedor</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fornecedor *
                  </label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplierId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Selecione um fornecedor</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    <Link href="/dashboard/suppliers" className="text-emerald-600 hover:text-emerald-700">
                      Gerenciar fornecedores
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Estoque e Preços */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Controle de Estoque</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estoque Atual *
                      </label>
                      <input
                        type="number"
                        value={formData.currentStock}
                        onChange={(e) => setFormData(prev => ({ ...prev, currentStock: parseInt(e.target.value) || 0 }))}
                        min={0}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unidade
                      </label>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="unid">Unidade</option>
                        <option value="caixa">Caixa</option>
                        <option value="seringa">Seringa</option>
                        <option value="tubete">Tubete</option>
                        <option value="pote">Pote</option>
                        <option value="frasco">Frasco</option>
                        <option value="ml">Mililitro (ml)</option>
                        <option value="g">Grama (g)</option>
                        <option value="kg">Quilograma (kg)</option>
                        <option value="m">Metro (m)</option>
                        <option value="cm">Centímetro (cm)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estoque Mínimo *
                      </label>
                      <input
                        type="number"
                        value={formData.minimumStock}
                        onChange={(e) => setFormData(prev => ({ ...prev, minimumStock: parseInt(e.target.value) || 0 }))}
                        min={0}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estoque Máximo
                      </label>
                      <input
                        type="number"
                        value={formData.maximumStock}
                        onChange={(e) => setFormData(prev => ({ ...prev, maximumStock: parseInt(e.target.value) || 0 }))}
                        min={0}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preços */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  Preços e Custos
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custo Unitário *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.unitCost}
                        onChange={(e) => setFormData(prev => ({ ...prev, unitCost: parseFloat(e.target.value) || 0 }))}
                        min={0}
                        className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço de Venda
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.salePrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, salePrice: parseFloat(e.target.value) || 0 }))}
                        min={0}
                        className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    
                    {formData.unitCost > 0 && formData.salePrice > 0 && (
                      <div className="mt-2 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Margem de Lucro:</strong> {((formData.salePrice - formData.unitCost) / formData.unitCost * 100).toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Localização e Lote */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                  Localização e Lote
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localização no Estoque
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Ex: Armário A - Prateleira 2"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lote/Número de Série
                    </label>
                    <input
                      type="text"
                      value={formData.batch}
                      onChange={(e) => setFormData(prev => ({ ...prev, batch: e.target.value }))}
                      placeholder="Ex: L202412001"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      Data de Validade
                    </label>
                    <input
                      type="date"
                      value={formData.expirationDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Dica */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Dica:</p>
                    <p>Configure o estoque mínimo para receber alertas automáticos quando for necessário repor o item. Isso ajuda a evitar rupturas de estoque.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}