"use client"

import { deleteProduct } from "@/server-actions/products/deleteProducts";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiTrash } from "react-icons/fi";

interface DeleteProductButtonProps {
    productId:string
}
export default function DeleteProductButton({productId}:DeleteProductButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this product?")
        if(!confirmed) return;
        setIsDeleting(true);
        const result = await deleteProduct(productId);
        if(result.success){
            router.refresh();
        }
        else{
            toast.error(result.message);
            setIsDeleting(false)
        }
    }

  return (
    <button type="button" disabled={isDeleting} onClick={handleDelete} className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted transition hover:border-error hover:text-error disabled:cursor-not-allowed disabled:opacity-50">
        <FiTrash size={15}/>
        {isDeleting ? "Deleting...": "Delete"}
    </button>
  )
}
