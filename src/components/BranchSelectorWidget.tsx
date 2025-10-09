'use client'
import { useBranchesStore } from "@/stores";
export default function BranchSelectorWidget() {

    const  branches  = useBranchesStore(store => store.branches);
    const selectedBranch = useBranchesStore(store => store.selectedBranch);
    const  changeSelectedBranch = useBranchesStore(store => store.changeSelectedBranch);
    const handleChange = (e: any) => {
        console.log('Cambiando sucursal...', e.target.value);
        changeSelectedBranch(e.target.value);
    }

    return (
    <div>
        <select onChange={(e) => handleChange(e)} value={selectedBranch?.id}>
            {branches.map((branch: any) => 
                <option 
                    key={branch.id} 
                    value={branch.id}>{branch.name}
                                     
                </option>)}
        </select>
    </div>)
}