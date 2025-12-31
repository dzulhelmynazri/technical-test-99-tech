import { useState } from "react";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { CurrencySelectorProps } from "@/types";

export function CurrencySelector({
	tokens,
	selectedToken,
	onTokenChange,
	className,
}: CurrencySelectorProps) {
	const [imageError, setImageError] = useState(false);

	return (
		<div className={cn("relative", className)}>
			<Select
				value={selectedToken}
				onChange={(e) => {
					onTokenChange(e.target.value);
					setImageError(false);
				}}
				className="pl-12"
			>
				{tokens.map((token) => (
					<option key={token.symbol} value={token.symbol}>
						{token.symbol}
					</option>
				))}
			</Select>
			{selectedToken && !imageError && (
				<img
					src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${selectedToken}.svg`}
					alt={selectedToken}
					className="absolute left-3 top-1/2 -translate-y-1/2 size-6 rounded-full pointer-events-none"
					onError={() => setImageError(true)}
				/>
			)}
			{selectedToken && imageError && (
				<div className="absolute left-3 top-1/2 -translate-y-1/2 size-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold pointer-events-none">
					{selectedToken.charAt(0)}
				</div>
			)}
		</div>
	);
}
