'use client'
import { useEffect } from 'react'
import { useStoreTemplateConfig } from '@/stores'


export default function ClientWrapper({ children }) {

    const setTemplateConfig = useStoreTemplateConfig((state) => state.setTemplateConfig)
  
  useEffect(() => {
    setTemplateConfig()
  }, [])

  return (
    <div>
      {children}
    </div>
  )
}