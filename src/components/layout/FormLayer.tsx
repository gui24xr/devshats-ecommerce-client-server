"use client"

import { Loader2, X } from "lucide-react"
import { useState, useEffect } from "react"

export default function FormLayer({ formInstructions, loading, errorMessage, action, onSubmit,icon  }: { formInstructions: any, loading: boolean, errorMessage: string, action?: (formData: FormData) => void, onSubmit?: () => void, icon: React.ReactNode }) {
  
  if (action && onSubmit) throw new Error("action and onSubmit cannot be used together")
  if (!action && !onSubmit) throw new Error("action or onSubmit must be provided")
  

  const [showError, setShowError] = useState(true)

  // Resetear el estado cuando cambie el errorMessage
  useEffect(() => {
    if (errorMessage) {
      setShowError(true)
    }
  }, [errorMessage])


  const getFieldComponent = (field: any) => {
    switch (field.type) {
      case "select":
        return <select id={field.id} name={field.name} required={field.required} hidden={field.hidden} defaultValue={field.defaultValue} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200" >
          <option disabled selected hidden value={field.selected?.value}>{field.selected?.label}</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      case "checkboxGroup":
        return <div className="w-full p-4 border border-gray-300 rounded-md bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {field.options.map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer hover:bg-white rounded-md p-2 transition-colors duration-200">
                <input 
                  type="checkbox" 
                  name={field.name} 
                  value={option.value}
                  hidden={field.hidden}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-200"
                  data-required={field.required}
                  defaultChecked={option.checked}
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {field.required && (
            <div className="mt-2 text-xs text-red-600">
              * Debe seleccionar al menos una opción
            </div>
          )}
        </div>
      default:
        return <input 
          type={field.type} 
          id={field.id} 
          name={field.name} 
          required={field.required} 
          hidden={field.hidden} 
          placeholder={field.placeholder}
          defaultValue={field.defaultValue} 
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200" 
          />
    }
  }

  return (
    <div className="space-y-8">
      <form action={action} >
        {/* Card Container */}
        <div className="bg-white shadow-md border border-gray-200 overflow-hidden space-y-4 min-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-700 px-4 py-3 border-b border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                   {icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{formInstructions.title}</h2>
                <p className="text-sm text-blue-100">
                  {formInstructions.description}
                </p>
              </div>
              {loading && <div className="p-2 bg-white/20 rounded-lg">
                   <Loader2 className="w-4 h-4 animate-spin" />
              </div>}
            </div>
          </div>

    
          {/*Dynamic Optional Sections*/}
          {formInstructions.optionalReactNodes && formInstructions.optionalReactNodes.map((node: any, key: any) => (
            <div key={key}>
              {node}
            </div>
          ))}

          {/* Content */}
          {formInstructions.hiddenFields && formInstructions.hiddenFields.map((hiddenField: any,key: any) => (
            <input key={key} type="hidden" id={hiddenField.id} name={hiddenField.name} value={hiddenField.defaultValue} />
          ))}

          <div className="px-8 py-2 space-y-8">
            
            <div className="px-8 py-2 grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(450px,1fr))] gap-6">
              {formInstructions.sections.map((section) => (
                <div className="flex flex-col gap-4 " key={section.title}>
                  <div className="flex flex-col" >
                    <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-blue-200">{section.title}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
               
               
                  {section.fields.map((field) => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-xs font-medium text-gray-700 mb-1">
                        {field.label} <span className="text-red-500">*</span>
                      </label>
                      {getFieldComponent(field)}
                        
                      
                    </div>
                  ))}

                </div>
                

              ))}
            </div>
          
          </div>

       



          {/* Error Message - Sutil y elegante con botón de cerrar */}
          {errorMessage && showError && (
            <div className="px-8 py-3 bg-amber-50 border-l-4 border-amber-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-sm text-amber-700 font-medium">{errorMessage}</span>
                </div>
                <button
                  onClick={() => setShowError(false)}
                  className="text-amber-500 hover:text-amber-700 transition-colors duration-200 p-1 rounded-full hover:bg-amber-100"
                  aria-label="Cerrar mensaje de error"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-6 border-t border-gray-200 space-y-12">
            <div className="flex justify-center">
              {formInstructions.buttons.map((button) => (
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-1.5 rounded text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  {button.icon}
                  {button.label}
                </button>
              ))}
            </div>
            <ul className="px-8 py-3 bg-amber-50 border-l-4 border-amber-400 list-disc list-inside text-sm text-gray-600">
              {formInstructions.instructions && formInstructions.instructions.map((instruction) => (
                <li key={instruction} className="text-sm text-gray-600">{instruction}</li>
              ))}
            </ul>
          </div>
        </div>
       
      </form>
    </div>
  )
}