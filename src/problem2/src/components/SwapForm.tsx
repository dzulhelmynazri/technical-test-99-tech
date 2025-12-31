import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { usePrices } from "@/hooks/usePrices";
import { useSwapForm } from "@/hooks/useSwapForm";
import { transformPricesToTokens } from "@/utils/currency";
import { LoadingState } from "./SwapForm/LoadingState";
import { ErrorState } from "./SwapForm/ErrorState";
import { SwapFormHeader } from "./SwapForm/SwapFormHeader";
import { CurrencyInput } from "./SwapForm/CurrencyInput";
import { CurrencyOutput } from "./SwapForm/CurrencyOutput";
import { ExchangeRateDisplay } from "./SwapForm/ExchangeRateDisplay";

export function SwapForm() {
	const { prices, loading, updatedAt, isStale, refetch } = usePrices();

	const tokens = useMemo(() => {
		return transformPricesToTokens(prices);
	}, [prices]);

	const {
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
	} = useSwapForm({ prices, tokens, isStale });

	if (loading) return <LoadingState />;

	if (tokens.length === 0) {
		return <ErrorState onRetry={refetch} />;
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<SwapFormHeader
				updatedAt={updatedAt}
				isStale={isStale}
				onRefresh={refetch}
			/>
			<CardContent>
				<div className="space-y-4">
					<CurrencyInput
						label="From"
						amount={fromAmount}
						amountError={fromAmountError}
						selectedToken={fromToken}
						availableTokens={availableFromTokens}
						tokenPrice={prices[fromToken]}
						onAmountChange={handleFromAmountChange}
						onTokenChange={setFromToken}
					/>

					<div className="flex justify-center">
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={handleSwap}
							disabled={!fromToken || !toToken}
							className="rounded-full cursor-pointer"
						>
							<ArrowUpDown className="size-4" />
						</Button>
					</div>

					<CurrencyOutput
						label="To"
						amount={toAmount}
						selectedToken={toToken}
						availableTokens={availableToTokens}
						tokenPrice={prices[toToken]}
						onTokenChange={setToToken}
					/>

					{exchangeRate !== null && fromToken && toToken && (
						<ExchangeRateDisplay
							fromToken={fromToken}
							toToken={toToken}
							exchangeRate={exchangeRate}
						/>
					)}

					<Button
						onClick={handleSubmit}
						className="w-full cursor-pointer"
						size="lg"
						disabled={
							isProcessing ||
							!fromAmount ||
							!!fromAmountError ||
							!fromToken ||
							!toToken
						}
					>
						{isProcessing ? "Swapping..." : "Swap"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
