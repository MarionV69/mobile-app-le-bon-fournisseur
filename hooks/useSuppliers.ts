import api from "@/api/axiosConfig";
import { Supplier } from "@/types/supplier";
import { useEffect, useState } from "react";

export function useSuppliers(search: string, city: string) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSuppliers() {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<Supplier[]>("/suppliers", {
          params: {
            ...(search && { search }),
            ...(city && { city }),
          },
        });
        setSuppliers(response.data);
      } catch {
        setError(
          "Impossible de charger les fournisseurs pour le moment. Veuillez réessayer plus tard.",
        );
      } finally {
        setLoading(false);
      }
    }
    loadSuppliers();
  }, [search, city]);

  return { suppliers, error, loading };
}
