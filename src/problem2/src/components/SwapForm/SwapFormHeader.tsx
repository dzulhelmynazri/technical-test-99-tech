import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwapFormHeaderProps {
	updatedAt: Date | null;
	isStale: boolean;
	onRefresh: () => void;
}

export function SwapFormHeader({
	updatedAt,
	isStale,
	onRefresh,
}: SwapFormHeaderProps) {
	return (
		<CardHeader>
			<div className="flex items-center justify-between">
				<CardTitle>Currency Swap</CardTitle>
				{updatedAt && (
					<Button
						onClick={onRefresh}
						variant="ghost"
						size="sm"
						className={cn("gap-2 cursor-pointer", isStale && "text-amber-600")}
						title={isStale ? "Prices may be outdated" : "Refresh prices"}
					>
						<RefreshCw className="size-4" />
						<span className="text-xs">{isStale ? "Stale" : "Fresh"}</span>
					</Button>
				)}
			</div>
		</CardHeader>
	);
}
