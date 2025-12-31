import { useState, useEffect, useMemo, useCallback } from "react";
import type { PriceData, ApiPriceItem } from "@/types";

// Constants
const FETCH_TIMEOUT_MS = 10000;
const PRICE_STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export function usePrices() {
	const [prices, setPrices] = useState<PriceData>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

	const fetchPrices = useCallback(async () => {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

		try {
			setLoading(true);
			setError(null);

			const response = await fetch(
				"https://interview.switcheo.com/prices.json",
				{ signal: controller.signal }
			);

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();

			if (!Array.isArray(data)) {
				throw new Error("Invalid API response format");
			}

			// Process API data - group by currency and use latest price
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
		} catch (err) {
			if (err instanceof Error && err.name === "AbortError") {
				setError("Request timed out. Please try again.");
			} else {
				const message = err instanceof Error ? err.message : "Unknown error";
				setError(`Failed to load prices: ${message}`);
			}
			setPrices({});
		} finally {
			setLoading(false);
			clearTimeout(timeoutId);
		}
	}, []);

	useEffect(() => {
		fetchPrices();
	}, [fetchPrices]);

	const isStale = useMemo(() => {
		if (!updatedAt) return false;
		return Date.now() - updatedAt.getTime() > PRICE_STALE_THRESHOLD_MS;
	}, [updatedAt]);

	return { prices, loading, error, updatedAt, isStale, refetch: fetchPrices };
}

