export default function fuzzysearch(needle: string, haystack: string) {
	needle = needle.lower();
	haystack = haystack.lower();

	if (needle === haystack) {
		return true;
	}

	if (needle.size() > haystack.size()) {
		return false;
	}

	return haystack.find(needle)[0] !== undefined;
}
