import { Portrait, SocialProofs, ProductsContainer } from "@/components";

export default function Home() {
  return (
    <div>
      <section>
        <Portrait />
      </section>
      <section>
        <ProductsContainer />
      </section>  
      <section>
        <SocialProofs />
      </section>
    </div>
  );
}