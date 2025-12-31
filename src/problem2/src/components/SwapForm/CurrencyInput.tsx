import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencySelector } from "@/components/CurrencySelector";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Token } from "@/types";
import { calculateUsdValue } from "@/utils/currency";

interface CurrencyInputProps {
	label: string;
	amount: string;
	amountError?: string;
	selectedToken: string;
	availableTokens: Token[];
	tokenPrice?: number;
	onAmountChange: (value: string) => void;
	onTokenChange: (token: string) => void;
}

export function CurrencyInput({
	label,
	amount,
	amountError,
	selectedToken,
	availableTokens,
	tokenPrice,
	onAmountChange,
	onTokenChange,
}: CurrencyInputProps) {
	return (
		<div className="space-y-2">
			<Label>{label}</Label>
			<div className="flex gap-2">
				<Input
					type="text"
					inputMode="decimal"
					placeholder="0.0"
					value={amount}
					onChange={(e) => onAmountChange(e.target.value)}
					className={cn(
						"text-2xl font-semibold flex-1",
						amountError && "border-destructive focus-visible:ring-destructive"
					)}
				/>
				<CurrencySelector
					tokens={availableTokens}
					selectedToken={selectedToken}
					onTokenChange={onTokenChange}
				/>
			</div>
			{selectedToken && tokenPrice && amount && !amountError && (
				<p className="text-xs text-muted-foreground">
					≈ ${calculateUsdValue(amount, tokenPrice)}
				</p>
			)}
			{amountError && (
				<div className="flex items-center gap-1 text-destructive text-sm">
					<AlertCircle className="size-3" />
					<span>{amountError}</span>
				</div>
			)}
		</div>
	);
}
