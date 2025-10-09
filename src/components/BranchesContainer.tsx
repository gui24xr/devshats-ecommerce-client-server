import DataService from "@/lib/DataService";
import { BranchesStoreHydrator } from "../components"
export default async function BranchesContainer() {

    const branches = await DataService.getBranches();

     return (
        <>
            <BranchesStoreHydrator branchesData={branches} /> 
        </>
     )
}