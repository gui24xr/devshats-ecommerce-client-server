"use client"
import { useState } from "react"
import axios from "axios"
import { Plus, X, Package, Check, Edit2, Eye, EyeOff } from "lucide-react"

type Option = {
  name: string
  modifiesPrice: boolean
  addPrice: number
  isActive: boolean
}

type CustomizationFeature = {
  type: "options" | "check"
  name: string
  label: string
  isActive: boolean
  required: boolean
  options: Option[]
}

type ProductTemplate = {
  templateName: string
  customizationFeatures: CustomizationFeature[]
}

export default function TemplateForm() {
  const [template, setTemplate] = useState<ProductTemplate>({
    templateName: "",
    customizationFeatures: []
  })
  
  const [editingFeatures, setEditingFeatures] = useState<CustomizationFeature[]>([])

  const updateTemplateName = (name: string) => {
    setTemplate(prev => ({ ...prev, templateName: name }))
  }

  const addEditingFeature = () => {
    // Solo agregar si no hay ninguna característica en edición
    if (editingFeatures.length === 0) {
      const newFeature: CustomizationFeature = {
        type: "options",
        name: "",
        label: "",
        isActive: true,
        required: false,
        options: []
      }
      setEditingFeatures([newFeature])
    }
  }

  const removeEditingFeature = (index: number) => {
    setEditingFeatures([])
  }

  const updateEditingFeature = (index: number, field: keyof CustomizationFeature, value: any) => {
    setEditingFeatures(prev => prev.map((feature, i) => 
      i === index ? { ...feature, [field]: value } : feature
    ))
  }

  const addOptionToEditing = (featureIndex: number) => {
    const newOption: Option = {
      name: "",
      modifiesPrice: false,
      addPrice: 0,
      isActive: true
    }
    setEditingFeatures(prev => prev.map((feature, i) => 
      i === featureIndex 
        ? { ...feature, options: [...feature.options, newOption] }
        : feature
    ))
  }

  const removeOptionFromEditing = (featureIndex: number, optionIndex: number) => {
    setEditingFeatures(prev => prev.map((feature, i) => 
      i === featureIndex 
        ? { ...feature, options: feature.options.filter((_, j) => j !== optionIndex) }
        : feature
    ))
  }

  const updateEditingOption = (featureIndex: number, optionIndex: number, field: keyof Option, value: any) => {
    setEditingFeatures(prev => prev.map((feature, i) => 
      i === featureIndex 
        ? {
            ...feature,
            options: feature.options.map((option, j) => 
              j === optionIndex ? { ...option, [field]: value } : option
            )
          }
        : feature
    ))
  }

  const acceptFeature = (index: number) => {
    const feature = editingFeatures[0] // Solo hay una
    if (feature.name.trim() && feature.label.trim() && feature.options.length > 0) {
      setTemplate(prev => ({
        ...prev,
        customizationFeatures: [...prev.customizationFeatures, feature]
      }))
      setEditingFeatures([]) // Limpiar la edición
    }
  }

  const removeAcceptedFeature = (index: number) => {
    setTemplate(prev => ({
      ...prev,
      customizationFeatures: prev.customizationFeatures.filter((_, i) => i !== index)
    }))
  }

  const editAcceptedFeature = (index: number) => {
    // Solo permitir editar si no hay ninguna característica en edición
    if (editingFeatures.length === 0) {
      const feature = template.customizationFeatures[index]
      setEditingFeatures([{ ...feature }])
      removeAcceptedFeature(index)
    }
  }

  const toggleFeatureActive = (index: number) => {
    setTemplate(prev => ({
      ...prev,
      customizationFeatures: prev.customizationFeatures.map((feature, i) => 
        i === index ? { ...feature, isActive: !feature.isActive } : feature
      )
    }))
  }

  const handleSubmit = () => {
    console.log("Template generado:", template)

    axios.post('/api/admin/products/templates', template)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-5 h-5 text-gray-600" />
          <h1 className="text-xl font-medium text-gray-900">Crear Template de Producto</h1>
        </div>
        <div className="w-full h-px bg-gray-200"></div>
      </div>

      {/* Nombre del Template */}
      <div className="mb-8">
        <label className="block text-sm text-gray-700 mb-2">Nombre del template</label>
        <input
          type="text"
          value={template.templateName}
          onChange={(e) => updateTemplateName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded focus:border-gray-400 focus:outline-none text-sm"
          placeholder="ej: hotdogs, pizzas, hamburguesas..."
        />
      </div>

      {/* Características de personalización en edición */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-900">Configurar Características de Personalización</h2>
          <button
            onClick={addEditingFeature}
            disabled={editingFeatures.length > 0}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-3 h-3" />
            Agregar nueva característica
          </button>
        </div>

        {editingFeatures.length > 0 && (
          <div className="border border-gray-200 rounded p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">Crear característica de personalización</h3>
              <button
                onClick={() => setEditingFeatures([])}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Nombre</label>
                <input
                  type="text"
                  value={editingFeatures[0].name}
                  onChange={(e) => updateEditingFeature(0, "name", e.target.value)}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:border-gray-400 focus:outline-none"
                  placeholder="ej: size, sauce..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Label (UI)</label>
                <input
                  type="text"
                  value={editingFeatures[0].label}
                  onChange={(e) => updateEditingFeature(0, "label", e.target.value)}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:border-gray-400 focus:outline-none"
                  placeholder="ej: Tamaño, Salsas..."
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-gray-600 mb-1">Tipo de selección</label>
              <select
                value={editingFeatures[0].type}
                onChange={(e) => updateEditingFeature(0, "type", e.target.value as "options" | "check")}
                className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:border-gray-400 focus:outline-none"
              >
                <option value="options">
                  Una sola opción - El cliente debe seleccionar una de las opciones existentes (Ej: Tamaño: Grande, mediana o chica)
                </option>
                <option value="check">
                  Múltiples opciones - El cliente puede marcar varias opciones (Ej: Salsas: mayonesa, ketchup, mostaza)
                </option>
              </select>
            </div>

            <div className="space-y-3 mb-4">
              <label className="text-xs text-gray-600">Opciones</label>

              {editingFeatures[0].options.length === 0 && (
                <div className="text-xs text-gray-400 text-center py-2 border border-dashed border-gray-200 rounded">
                  Sin opciones
                </div>
              )}

              {editingFeatures[0].options.map((option, j) => (
                <div key={j} className="bg-white p-3 rounded grid grid-cols-12 gap-2 items-center border">
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={option.name}
                      onChange={(e) => updateEditingOption(0, j, "name", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                      placeholder="Nombre de la opción"
                    />
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <label className="flex items-center gap-1 text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={option.isActive}
                        onChange={(e) => updateEditingOption(0, j, "isActive", e.target.checked)}
                        className="w-3 h-3"
                      />
                      Activa
                    </label>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <label className="flex items-center gap-1 text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={option.modifiesPrice}
                        onChange={(e) => updateEditingOption(0, j, "modifiesPrice", e.target.checked)}
                        className="w-3 h-3"
                      />
                      Modifica precio
                    </label>
                  </div>
                  
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={option.addPrice}
                      onChange={(e) => updateEditingOption(0, j, "addPrice", parseFloat(e.target.value) || 0)}
                      disabled={!option.modifiesPrice}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs disabled:bg-gray-100"
                      placeholder="$0"
                    />
                  </div>
                  
                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={() => removeOptionFromEditing(0, j)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => addOptionToEditing(0)}
                className="w-full text-xs text-gray-600 border border-gray-200 py-2 rounded hover:bg-gray-50 flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Agregar opción
              </button>
            </div>

            {/* Botón Aceptar */}
            <div className="flex justify-end">
              <button
                onClick={() => acceptFeature(0)}
                disabled={!editingFeatures[0].name.trim() || !editingFeatures[0].label.trim() || editingFeatures[0].options.length === 0}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Check className="w-3 h-3" />
                Aceptar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Características de personalización aceptadas */}
      {template.customizationFeatures.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Características de Personalización Agregadas</h2>
          <div className="space-y-4">
            {template.customizationFeatures.map((feature, i) => (
              <div key={i} className={`border rounded-lg p-5 ${
                feature.isActive 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="text-sm font-semibold text-gray-900">Nombre de característica: </span>
                      <span className="text-sm text-gray-700">{feature.name}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-sm font-semibold text-gray-900">Label: </span>
                      <span className="text-sm text-gray-700">{feature.label}</span>
                      {feature.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </div>
                    <div className="mb-2">
                      <span className="text-sm font-semibold text-gray-900">Tipo de selección: </span>
                      <span className="text-sm text-gray-600">
                        {feature.type === "options" ? "Solo una opción" : "Una o más opciones"}
                      </span>
                    </div>
                    <div className="mb-3">
                      <span className="text-sm text-gray-700">
                        El cliente/usuario debe {feature.type === "options" ? "elegir una" : "elegir varias"} de las siguientes opciones:
                      </span>
                    </div>
                    
                    {/* Opciones como chips/tags */}
                    <div className="flex flex-wrap gap-2">
                      {feature.options.map((option, j) => (
                        <div key={j} className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm border ${
                          feature.isActive && option.isActive 
                            ? 'bg-white border-gray-300 text-gray-700 shadow-sm' 
                            : 'bg-gray-100 border-gray-200 text-gray-400'
                        }`}>
                          <span>
                            {option.name}
                            {!option.isActive && (
                              <span className="text-xs text-gray-400 ml-1">(inactiva)</span>
                            )}
                          </span>
                          {option.modifiesPrice && (
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              feature.isActive && option.isActive 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-200 text-gray-400'
                            }`}>
                              +${option.addPrice}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => toggleFeatureActive(i)}
                      className={`p-2 rounded-full ${
                        feature.isActive 
                          ? 'text-gray-400 hover:text-orange-500 hover:bg-orange-50' 
                          : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
                      }`}
                      title={feature.isActive ? "Desactivar característica" : "Activar característica"}
                    >
                      {feature.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => editAcceptedFeature(i)}
                      className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                      title="Editar característica"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeAcceptedFeature(i)}
                      className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
                      title="Eliminar característica"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Configuración dentro de cada card */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={feature.isActive}
                        onChange={() => toggleFeatureActive(i)}
                        className="w-4 h-4"
                      />
                      Característica activa
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={feature.required}
                        onChange={(e) => {
                          setTemplate(prev => ({
                            ...prev,
                            customizationFeatures: prev.customizationFeatures.map((f, index) => 
                              index === i ? { ...f, required: e.target.checked } : f
                            )
                          }))
                        }}
                        className="w-4 h-4"
                      />
                      Campo obligatorio
                    </label>
                  </div>
                  
                  {/* Badges de estado */}
                  <div className="flex gap-2 mt-3">
                    {!feature.isActive && (
                      <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                        Inactiva
                      </span>
                    )}
                    {feature.required && (
                      <span className="text-xs text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                        Obligatorio
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botones finales */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={!template.templateName.trim() || template.customizationFeatures.length === 0}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Crear Template
          </button>
          <button
            onClick={() => {
              setTemplate({ templateName: "", customizationFeatures: [] })
              setEditingFeatures([])
            }}
            className="px-4 py-2 border border-gray-200 text-gray-700 text-sm rounded hover:bg-gray-50"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Preview del objeto */}
      {template.templateName && template.customizationFeatures.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Preview del objeto:</h3>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(template, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}