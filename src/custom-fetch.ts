// Reads the response body as text rather than assuming JSON, so empty responses
// (e.g. 204 No Content) don't throw. Falls back to null and throws on invalid JSON.
const getBody = async <T>(response: Response | Request): Promise<T> => {
	const text = await response.text();
	if (!text || text.trim() === "") {
		return null as T;
	}
	try {
		return JSON.parse(text);
	} catch (error) {
		console.error("Failed to parse JSON response:", text);
		throw new Error(`Invalid JSON response: ${text}`);
	}
};

// Replaces the placeholder base URL in the orval-generated client with the real
// Umbraco host from NEXT_PUBLIC_UMBRACO_BASE_URL, preserving path and query string.
const getUrl = (contextUrl: string): string => {
	const url = new URL(contextUrl);
	const pathname = url.pathname;
	const search = url.search;
	const baseUrl = process.env.NEXT_PUBLIC_UMBRACO_BASE_URL;

	const requestUrl = new URL(`${baseUrl}${pathname}${search}`);

	return requestUrl.toString();
};

const getHeaders = (headers?: HeadersInit): HeadersInit => {
	return {
		...headers,
		"Content-Type": "application/json",
	};
};

export interface CustomFetchResult<T> {
	status: number;
	data: T;
	headers: Headers;
}

// Custom fetch used by orval-generated API clients instead of native fetch.
// Returns a normalised { status, data, headers } shape that the generated
// functions expect when checking response.status.
export const customFetch = async <T>(
	url: string,
	options: RequestInit
): Promise<T> => {
	const requestUrl = getUrl(url);
	const requestHeaders = getHeaders(options.headers);

	const requestInit: RequestInit = {
		...options,
		headers: requestHeaders,
	};

	const response = await fetch(requestUrl, requestInit);
	const data = await getBody<T>(response);

	return { status: response.status, data, headers: response.headers } as T;
};
