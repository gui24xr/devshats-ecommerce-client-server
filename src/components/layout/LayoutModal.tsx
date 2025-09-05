"use client"
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { X } from 'lucide-react'
import { useStoreTemplateConfig } from '@/stores'

export default function LayoutModal({
  isOpen = false,
  onClose,
  title = "Mi modal",
  description = "descripcion del modal",
  minWidth = "w-full",
  maxWidth = "w-full",
  content = <DefaultHeader />,
  footer = <DefaultFooter />
}) {

  const portrait = useStoreTemplateConfig(state => state.portrait)
  const loading = useStoreTemplateConfig(state => state.loading)

  if (loading) return <div className="text-center text-gray-500 py-4">Cargando...</div>
  return (
    <>
      {/* El Modal con transiciones */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => onClose(false)}>

          {/* Backdrop con animación */}
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden ">
              <div className={`pointer-events-none fixed inset-y-0 right-0 flex w-full xl:w-1/2`}>

                {/* Panel del modal deslizándose desde la derecha */}
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-full h-full">
                    <div className="h-full w-full flex flex-col bg-white shadow-2xl">

                      {/* Header */}
                      <div className={`${portrait.backgroundColor || "bg-gradient-to-br from-green-500 to-blue-500"} w-full flex items-center justify-between px-4 py-3 text-white flex-shrink-0`}>
                        <div>
                          <Dialog.Title className="font-bold text-md">
                            {portrait.titleLogoIcon} {title}
                          </Dialog.Title>
                          <p className="text-orange-100 text-sm">
                            {description}
                          </p>
                        </div>
                        <button
                          onClick={() => onClose(false)}
                          className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:scale-105"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Contenido scrolleable */}
                      <div className="flex-1 overflow-y-auto px-2
                       py-6">
                        {content}
                      </div>

                      {/* Footer 
                      <div className="bg-gray-500 p-4 flex-shrink-0 bg-black">
                        {footer}
                      </div>
                      */}

                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}


//-----------Partes defaults--------------------------------------------------------
function DefaultHeader() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <p>Contenido del modal aquí</p>
      <p>Este contenido puede ser muy largo y se hará scroll automáticamente.</p>
      <p>Puedes poner aquí lo que necesites.</p>
    </div>
  )
}

function DefaultFooter() {
  return (
    <div className="bg-gray-500 p-4 flex-shrink-0 bg-black">
      <p>Footer del modal</p>
    </div>
  )
}

