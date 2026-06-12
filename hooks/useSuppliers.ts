import api from "@/api/axiosConfig";
import { filtersType } from "@/types/filters.types";
import { Supplier } from "@/types/supplier";
import { useEffect, useState } from "react";

export function useSuppliers(
  search: string,
  city: string,
  filters: filtersType,
) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);
  useEffect(() => {
    async function loadSuppliers() {
      try {
        setLoading(true);
        setError(null);
        const params = {
          ...(search && { search }),
          ...(city && { city }),
          ...(filters.productCategories.length > 0 && {
            productCategories: filters.productCategories,
          }),
          ...(filters.labels.length > 0 && { labels: filters.labels }),
          ...(filters.minRating && { minRating: filters.minRating }),
          ...(filters.priceRange.length > 0 && {
            priceRange: filters.priceRange,
          }),
        };
        console.log("params envoyés:", JSON.stringify(params));
        const response = await api.get<Supplier[]>("/suppliers", {
          params,
          paramsSerializer: (params) => {
            return Object.entries(params)
              .map(([key, value]) => {
                if (Array.isArray(value)) {
                  return value
                    .map((v) => `${key}=${encodeURIComponent(v)}`)
                    .join("&");
                }
                return `${key}=${encodeURIComponent(value)}`;
              })
              .join("&");
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
  }, [search, city, filters]);

  return { suppliers, error, loading };
}
