export function debounce<T extends (...args: any[]) => any>(func: T, delay: number) {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return function (...args: Parameters<T>) {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			func(...args);
		}, delay);
	};
}

export function getRelativeTime(isoString: string) {
	const date = new Date(isoString);
	const now = new Date();
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (seconds < 60) return "just now";
	if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
	if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
	if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
	if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
	return `${Math.floor(seconds / 31536000)} years ago`;
}
