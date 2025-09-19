'use client'
import { useEffect } from 'react'
import { useStoreTemplateConfig, useProductsStore, useBranchesStore } from '@/stores'


export default function ClientWrapper({ children }) {

    const setTemplateConfig = useStoreTemplateConfig((state) => state.setTemplateConfig)
    const fetchProducts = useProductsStore(state => state.fetchProducts)
    const fetchBranches = useBranchesStore(state => state.fetchBranches)
    const initializeBranchConfig = useBranchesStore(state => state.initializeBranchConfig)
    
  useEffect(() => {

    async function initializeApp(){
      setTemplateConfig()
      await fetchBranches()
      initializeBranchConfig()
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