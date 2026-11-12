interface ProductCardSkeletonProps{
    number: number;
}

export default function ProductCardSkeleton({
    number,
}:ProductCardSkeletonProps){
    return(
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
            {Array.from({length: number}).map((_,index) => (
                <div key={index} className="animate-pulse overflow-hidden px-1 py-2 sm:px-2 md:px-3">
                    {/* Product Image  */}
                    <div className="aspect-square  w-full rounded-md bg-[#f5f5f5]"></div>
                    {/* Product Info  */}
                    <div className="space-y-2 pt-3">
                        {/* Category  */}
                        <div className="h-3 w-14 rounded bg-[#f5f5f5] sm:w-16"/>
                        {/* Product Name  */}
                        <div className="h-4 w-3/4 rounded bg-[#f5f5f5] sm:h-5"/>

                        {/* Price + Button  */}
                        <div className="flex items-center justify-between pt-1">
                            <div className="h-4 w-16 rounded bg-[#f5f5f5] sm:h-5 sm:w-20"/>
                            

                        </div>
                    </div>
                </div>  
            ))}
        </div>
    )
}