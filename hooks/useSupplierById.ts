import api from "@/api/axiosConfig";
import type { supplierDetails } from "@/types/supplierDetails.type";
import { useEffect, useState } from "react";

export function useSupplierById(id: string) {

    const [supplier, setSupplier] = useState<supplierDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getSupplierById() {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get<supplierDetails>(`/suppliers/${id}`);
                setSupplier(response.data);
            } catch {
                setError("Impossible de charger le fournisseur pour le moment. Veuillez réessayer plus tard.")
            } finally {
                setLoading(false);
            }
        }
        getSupplierById();
    }, [id]);

    return {supplier, loading, error};
}