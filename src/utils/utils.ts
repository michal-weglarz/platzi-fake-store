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

export function decodeJWT(token: string) {
	try {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
				.join("")
		);
		return JSON.parse(jsonPayload) as Record<string, any>;
	} catch {
		return null;
	}
}

export function isTokenExpiringSoon(token: string, bufferSeconds = 60) {
	const decoded = decodeJWT(token);
	if (decoded?.exp == null) return false;

	const now = Math.floor(Date.now() / 1000);
	const expiresIn = decoded.exp - now;

	return expiresIn <= bufferSeconds;
}
