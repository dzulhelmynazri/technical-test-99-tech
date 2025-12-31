import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import type { UseSwapFormProps } from "@/types";
import { useDebounce } from "./useDebounce";
import {
	calculateAmount,
	validateAmount,
	calculateExchangeRate,
} from "@/utils/currency";
import { DEBOUNCE_MS, DISPLAY_PRECISION } from "@/constants";

export function useSwapForm({ prices, tokens, isStale }: UseSwapFormProps) {
	const [fromToken, setFromToken] = useState("");
	const [toToken, setToToken] = useState("");
	const [fromAmount, setFromAmount] = useState("");
	const [fromAmountError, setFromAmountError] = useState<string | undefined>();
	const [isProcessing, setIsProcessing] = useState(false);

	const debouncedFromAmount = useDebounce(fromAmount, DEBOUNCE_MS);

	useEffect(() => {
		if (tokens.length >= 2 && !fromToken && !toToken) {
			setFromToken(tokens[0].symbol);
			setToToken(tokens[1].symbol);
		}
	}, [tokens, fromToken, toToken]);

	const exchangeRate = useMemo(
		() => calculateExchangeRate(prices[fromToken], prices[toToken]),
		[fromToken, toToken, prices]
	);

	const toAmount = useMemo(
		() => calculateAmount(debouncedFromAmount, exchangeRate),
		[debouncedFromAmount, exchangeRate]
	);

	useEffect(() => {
		setFromAmountError(validateAmount(fromAmount));
	}, [fromAmount]);

	const availableToTokens = useMemo(
		() => tokens.filter((t) => t.symbol !== fromToken),
		[tokens, fromToken]
	);

	const availableFromTokens = useMemo(
		() => tokens.filter((t) => t.symbol !== toToken),
		[tokens, toToken]
	);

	const handleFromAmountChange = (value: string) => {
		if (value === "" || /^\d*\.?\d*$/.test(value)) {
			setFromAmount(value);
		}
	};

	const handleSwap = () => {
		setFromToken(toToken);
		setToToken(fromToken);
	};

	const handleSubmit = async () => {
		if (!fromAmount || parseFloat(fromAmount) <= 0) {
			setFromAmountError("Please enter a valid amount");
			toast.error("Please enter a valid amount");
			return;
		}

		if (fromAmountError || !fromToken || !toToken) return;

		if (
			isStale &&
			!confirm("Exchange rates may be outdated. Continue anyway?")
		) {
			return;
		}

		setIsProcessing(true);

		const toastId = toast.loading("Processing swap...", {
			description: `Swapping ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
		});

		await new Promise((resolve) => setTimeout(resolve, 2000));

		toast.dismiss(toastId);
		toast.success("Swap completed successfully!", {
			description: `You swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}\nExchange Rate: 1 ${fromToken} = ${exchangeRate?.toFixed(
				DISPLAY_PRECISION
			)} ${toToken}`,
			duration: 5000,
		});

		setFromAmount("");
		setIsProcessing(false);
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
		isProcessing,
		handleFromAmountChange,
		handleSwap,
		handleSubmit,
	};
}
