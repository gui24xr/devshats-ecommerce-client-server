'use client'
import { useEffect } from 'react'
import {useBranchesStore } from '@/stores'


export default function ClientWrapper({ children }) {

    const fetchBranches = useBranchesStore(state => state.fetchBranches)
    const initializeBranchConfig = useBranchesStore(state => state.initializeBranchConfig)
    
  useEffect(() => {
    async function initializeApp(){
      await fetchBranches()
      initializeBranchConfig()
    }
   initializeApp()
  }, [])

  return (
    <div>
      {children}
    </div>
  )
}