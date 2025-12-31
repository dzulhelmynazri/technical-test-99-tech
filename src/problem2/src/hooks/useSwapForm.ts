import { useState, useEffect, useMemo } from "react";
import type { Token, PriceData } from "@/types";
import { useDebounce } from "./useDebounce";
import { calculateAmount, validateAmount, calculateExchangeRate } from "@/utils/currency";
import { DEBOUNCE_MS, DISPLAY_PRECISION } from "@/constants";

interface UseSwapFormProps {
	prices: PriceData;
	tokens: Token[];
	isStale: boolean;
}

export function useSwapForm({ prices, tokens, isStale }: UseSwapFormProps) {
	const [fromToken, setFromToken] = useState("");
	const [toToken, setToToken] = useState("");
	const [fromAmount, setFromAmount] = useState("");
	const [fromAmountError, setFromAmountError] = useState<string | undefined>();

	// Debounce the input for smoother UX
	const debouncedFromAmount = useDebounce(fromAmount, DEBOUNCE_MS);

	// Initialize default tokens
	useEffect(() => {
		if (tokens.length >= 2 && !fromToken && !toToken) {
			setFromToken(tokens[0].symbol);
			setToToken(tokens[1].symbol);
		}
	}, [tokens, fromToken, toToken]);

	// Calculate exchange rate
	const exchangeRate = useMemo(() => {
		return calculateExchangeRate(prices[fromToken], prices[toToken]);
	}, [fromToken, toToken, prices]);

	// Calculate toAmount based on fromAmount (single direction)
	const toAmount = useMemo(() => {
		return calculateAmount(debouncedFromAmount, exchangeRate);
	}, [debouncedFromAmount, exchangeRate]);

	// Validate fromAmount
	useEffect(() => {
		setFromAmountError(validateAmount(fromAmount));
	}, [fromAmount]);

	// Handle input changes
	const handleFromAmountChange = (value: string) => {
		// Allow empty, numbers, and decimal point
		if (value === "" || /^\d*\.?\d*$/.test(value)) {
			setFromAmount(value);
		}
	};

	// Handle token swap
	const handleSwap = () => {
		// Swap tokens only - amounts will recalculate automatically
		const tempToken = fromToken;
		setFromToken(toToken);
		setToToken(tempToken);
	};

	// Filter available tokens for "to" selector (exclude selected "from" token)
	const availableToTokens = useMemo(() => {
		return tokens.filter((t) => t.symbol !== fromToken);
	}, [tokens, fromToken]);

	const availableFromTokens = useMemo(() => {
		return tokens.filter((t) => t.symbol !== toToken);
	}, [tokens, toToken]);

	// Handle submission
	const handleSubmit = () => {
		if (!fromAmount || parseFloat(fromAmount) <= 0) {
			setFromAmountError("Please enter a valid amount");
			return;
		}

		if (fromAmountError) return;

		if (!fromToken || !toToken) return;

		if (isStale) {
			if (!confirm("Exchange rates may be outdated. Continue anyway?")) {
				return;
			}
		}

		alert(
			`Swap ${fromAmount} ${fromToken} for ${toAmount} ${toToken}?\n\n` +
				`Exchange Rate: 1 ${fromToken} = ${exchangeRate?.toFixed(
					DISPLAY_PRECISION
				)} ${toToken}\n\n` +
				`This is a demo. No actual swap will occur.`
		);
	};

	return {
		fromToken,
		setFromToken,
		toToken,
		setToToken,
		fromAmount,
		fromAmountError,
		toAmount,
		exchangeRate,
		availableToTokens,
		availableFromTokens,
		handleFromAmountChange,
		handleSwap,
		handleSubmit,
	};
}

