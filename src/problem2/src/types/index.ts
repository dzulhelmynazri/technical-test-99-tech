export interface PriceData {
	[token: string]: number;
}

export interface Token {
	symbol: string;
	price: number;
}

export interface CurrencySelectorProps {
	tokens: Token[];
	selectedToken: string;
	onTokenChange: (token: string) => void;
	className?: string;
}

export interface ApiPriceItem {
	currency: string;
	date: string;
	price: number;
}
