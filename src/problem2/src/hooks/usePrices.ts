import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { toast } from "sonner";
import type { PriceData, ApiPriceItem } from "@/types";
import {
	FETCH_TIMEOUT_MS,
	PRICE_STALE_THRESHOLD_MS,
	API_URL,
} from "@/constants";

export function usePrices() {
	const [prices, setPrices] = useState<PriceData>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
	const isInitialLoad = useRef(true);
	const abortControllerRef = useRef<AbortController | null>(null);

	const fetchPrices = useCallback(async () => {
		const isRefetch = !isInitialLoad.current;

		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		const controller = new AbortController();
		abortControllerRef.current = controller;
		const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

		try {
			setLoading(true);
			setError(null);

			const response = await fetch(API_URL, { signal: controller.signal });

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();

			if (!Array.isArray(data)) {
				throw new Error("Invalid API response format");
			}

			const priceMap = new Map<string, { price: number; date: Date }>();

			for (const item of data as ApiPriceItem[]) {
				if (!item?.currency || typeof item.price !== "number") continue;

				const price = item.price;
				if (isNaN(price) || !isFinite(price) || price <= 0) continue;

				const date = item.date ? new Date(item.date) : new Date();
				const existing = priceMap.get(item.currency);

				if (!existing || date > existing.date) {
					priceMap.set(item.currency, { price, date });
				}
			}

			const priceData: PriceData = {};
			for (const [symbol, { price }] of priceMap.entries()) {
				priceData[symbol] = price;
			}

			if (Object.keys(priceData).length === 0) {
				throw new Error("No valid tokens found");
			}

			setPrices(priceData);
			setUpdatedAt(new Date());

			if (isRefetch) {
				toast.success("Prices updated successfully", {
					description: `Updated ${Object.keys(priceData).length} token prices`,
				});
			}
		} catch {
			setError("Failed to load prices");
			setPrices({});

			if (isRefetch) {
				toast.error("Failed to load prices");
			}
		} finally {
			setLoading(false);
			clearTimeout(timeoutId);
			isInitialLoad.current = false;
		}
	}, []);

	useEffect(() => {
		fetchPrices();

		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, [fetchPrices]);

	const isStale = useMemo(() => {
		if (!updatedAt) return false;
		return Date.now() - updatedAt.getTime() > PRICE_STALE_THRESHOLD_MS;
	}, [updatedAt]);

	return { prices, loading, error, updatedAt, isStale, refetch: fetchPrices };
}
