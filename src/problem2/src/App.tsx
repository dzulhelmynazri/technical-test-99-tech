import "./App.css";
import { SwapForm } from "@/components/SwapForm";
import { Toaster } from "@/components/ui/sonner";

function App() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<SwapForm />
			<Toaster />
		</div>
	);
}

export default App;
