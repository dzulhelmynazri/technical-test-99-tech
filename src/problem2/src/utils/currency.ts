import { DISPLAY_PRECISION } from "@/constants";

export function formatTokenAmount(value: number): string {
	if (value === 0) return "0";

	// For very small numbers, use more precision
	if (value < 0.000001) {
		return value.toExponential(4);
	}

	// For small numbers, show more decimals
	if (value < 1) {
		return value.toFixed(8).replace(/\.?0+$/, "");
	}

	// For larger numbers, show fewer decimals
	return value.toFixed(DISPLAY_PRECISION).replace(/\.?0+$/, "");
}

export function calculateAmount(
	inputAmount: string,
	exchangeRate: number | null
): string {
	if (!exchangeRate || !inputAmount) return "";

	const amount = parseFloat(inputAmount);
	if (isNaN(amount) || amount < 0) return "";

	return formatTokenAmount(amount * exchangeRate);
}

export function validateAmount(value: string): string | undefined {
	if (!value) return undefined;

	const num = parseFloat(value);
	if (isNaN(num)) return "Please enter a valid number";
	if (num < 0) return "Amount must be positive";
	if (num > 1e15) return "Amount too large";

	return undefined;
}

export function calculateUsdValue(amount: string, price: number): string {
	return (parseFloat(amount || "0") * price).toFixed(2);
}

export function calculateExchangeRate(
	fromPrice: number | undefined,
	toPrice: number | undefined
): number | null {
	if (!fromPrice || !toPrice) return null;
	return toPrice / fromPrice;
}

export function transformPricesToTokens(
	prices: Record<string, number>
): Array<{ symbol: string; price: number }> {
	return Object.entries(prices)
		.map(([symbol, price]) => ({ symbol, price }))
		.sort((a, b) => a.symbol.localeCompare(b.symbol));
}
