'use client'
import { useEffect } from 'react'
import { useStoreTemplateConfig, useProductsStore } from '@/stores'


export default function ClientWrapper({ children }) {

    const setTemplateConfig = useStoreTemplateConfig((state) => state.setTemplateConfig)
    const fetchProducts = useProductsStore(state => state.fetchProducts)

    
  useEffect(() => {

    async function initializeApp(){
      setTemplateConfig()
      fetchProducts()
    }

   initializeApp()
   
  }, [])

  useEffect(()=>{

  },[])

  return (
    <div>
      {children}
    </div>
  )
}