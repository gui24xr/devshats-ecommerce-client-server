'use client'
import { useEffect } from 'react'
import { useBranchesStore } from '@/stores'

export default function BranchesStoreHydrator({branchesData}:{branchesData:any}) {

  const hydrateAndConfigBranches = useBranchesStore(state => state.hydrateAndConfigBranches)
    
  useEffect(() => {
    hydrateAndConfigBranches(branchesData)
    //fetchBranches()
  }, [branchesData])

  return null
}