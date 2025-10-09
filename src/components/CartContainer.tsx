import DataService from "@/lib/DataService";
import { FloatingCartWidget, CartDetailsModal } from "../components";


export default async function CartContainer() {
    const {  planSettings } = await DataService.getStoreDataAndConfigs()
  if (planSettings.type === "plan_small") {
    return null;
  }
  return (
    <>
      <FloatingCartWidget/>
      <CartDetailsModal/>
    </>
  );
}
