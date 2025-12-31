import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

export function LoadingState() {
	return (
		<Card className="w-full max-w-md mx-auto">
			<CardContent className="flex items-center justify-center py-12">
				<div className="flex flex-col items-center gap-2">
					<RefreshCw className="size-8 animate-spin text-muted-foreground" />
					<p className="text-sm text-muted-foreground">
						Loading token prices...
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
