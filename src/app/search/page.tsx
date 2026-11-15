import FrontedLayouts from "@/components/layouts/FrontedLayouts";


interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
    }>;
}


export default async function SearchPage({
    searchParams,
}:SearchPageProps){
    const params = await searchParams;
    const query = params.q?.trim() || "";
    return(
        <FrontedLayouts>
            <div className="my-6"></div>
        </FrontedLayouts>
    )
}