export function toSlug(path: string): string {
	return path.replace(/^\/|\/$/g, "");
}
