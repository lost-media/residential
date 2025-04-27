import React, { type DependencyList } from '@rbxts/react';

export default function useSignal<T>(
	signal: RBXScriptSignal,
	callback: (...args: unknown[]) => void,
	dependencies?: DependencyList,
) {
	React.useEffect(() => {
		const connection = signal.Connect(callback);
		return () => connection.Disconnect();
	}, [signal, callback, ...(dependencies ?? [])]);
}
