import { formatTokenAmount } from "@/utils/currency";

interface ExchangeRateDisplayProps {
	fromToken: string;
	toToken: string;
	exchangeRate: number;
}

export function ExchangeRateDisplay({
	fromToken,
	toToken,
	exchangeRate,
}: ExchangeRateDisplayProps) {
	return (
		<div className="bg-muted rounded-lg p-3">
			<div className="flex justify-between items-center text-sm">
				<span className="text-muted-foreground">Exchange Rate</span>
				<span className="font-medium">
					1 {fromToken} = {formatTokenAmount(exchangeRate)} {toToken}
				</span>
			</div>
		</div>
	);
}
