export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Nullable<T> = {
	[P in keyof T]: T[P] | null;
};

export type NullableBy<T, K extends keyof T> = Omit<T, K> & Record<K, T[K] | null>;

export interface Response {
	error?: string;
	msg?: string;
}

export type Callback<D, R> = (data?: D, error?: string) => R;
