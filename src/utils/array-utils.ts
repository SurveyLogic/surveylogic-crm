export const last = <T = any>(arr: T[]) => arr[arr.length - 1];

export function removeItem<T>(arr: T[], target: T) {
	return arr.filter((item) => item !== target);
}

export const replaceAt = <Value = any>(
  array: Value[],
  index: number,
  value: Value,
) => {
	const ret = array.slice(0);
	ret[index] = value;
	return ret;
};
