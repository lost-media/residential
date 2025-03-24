export function combineLists<T extends defined>(...lists: Array<T>[]): Array<T> {
	const res = new Array<T>();
	lists.forEach((nested) => {
		nested.forEach((val) => {
			res.push(val);
		});
	});
	return res;
}

export function getAverageOfList(list: Array<number>): number {
	if (list.size() === 0) {
		return 0;
	}
	return list.reduce((accumulator, val) => accumulator + val) / list.size();
}
