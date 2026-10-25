import AboutSection from "@/components/home/AboutSection";
import Banner from "@/components/home/Banner";
import CategorySection from "@/components/home/CategorySection";
import NewArrivals from "@/components/home/NewArrivals";
import FrontedLayouts from "@/components/layouts/FrontedLayouts";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
      <FrontedLayouts>
        <div className="mt-8">
          <Banner/>
          <CategorySection/>
          <NewArrivals/>
          <AboutSection/>
          
        </div>
      </FrontedLayouts>
  );
}
