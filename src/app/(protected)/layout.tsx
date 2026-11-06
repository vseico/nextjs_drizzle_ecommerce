import { getCurrentUser } from "@/server-actions/auth/getCurrentUser";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({children}:LayoutProps<"/">){
    const currentUser = await getCurrentUser();
    if(!currentUser){
        redirect("/?login=true");
    }
    return (
        <>
        {children}
        </>
    )
}