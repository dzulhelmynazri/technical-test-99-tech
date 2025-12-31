import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
	onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
	return (
		<Card className="w-full max-w-md mx-auto">
			<CardContent className="py-8">
				<div className="flex flex-col items-center gap-4 text-center">
					<AlertCircle className="size-12 text-destructive" />
					<div>
						<h3 className="font-semibold text-lg mb-1">
							Unable to Load Prices
						</h3>
						<p className="text-sm text-muted-foreground">
							"No tokens available. Please check your connection."
						</p>
					</div>
					<Button onClick={onRetry} variant="outline">
						<RefreshCw className="size-4" />
						Try Again
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
