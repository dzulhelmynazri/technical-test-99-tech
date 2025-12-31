import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencySelector } from "@/components/CurrencySelector";
import type { Token } from "@/types";
import { calculateUsdValue } from "@/utils/currency";

interface CurrencyOutputProps {
	label: string;
	amount: string;
	selectedToken: string;
	availableTokens: Token[];
	tokenPrice?: number;
	onTokenChange: (token: string) => void;
}

export function CurrencyOutput({
	label,
	amount,
	selectedToken,
	availableTokens,
	tokenPrice,
	onTokenChange,
}: CurrencyOutputProps) {
	return (
		<div className="space-y-2">
			<Label>{label}</Label>
			<div className="flex gap-2">
				<Input
					type="text"
					placeholder="0.0"
					value={amount}
					readOnly
					className="text-2xl font-semibold flex-1 bg-muted/50"
				/>
				<CurrencySelector
					tokens={availableTokens}
					selectedToken={selectedToken}
					onTokenChange={onTokenChange}
				/>
			</div>
			{selectedToken && tokenPrice && amount && (
				<p className="text-xs text-muted-foreground">
					≈ ${calculateUsdValue(amount, tokenPrice)}
				</p>
			)}
		</div>
	);
}
