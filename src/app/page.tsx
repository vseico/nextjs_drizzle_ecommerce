import Banner from "@/components/home/Banner";
import CategorySection from "@/components/home/CategorySection";
import FrontedLayouts from "@/components/layouts/FrontedLayouts";

export default function Home() {
  return (
      <FrontedLayouts>
        <div className="mt-8">
          <Banner/>
          <CategorySection/>
        </div>
      </FrontedLayouts>
  );
}
