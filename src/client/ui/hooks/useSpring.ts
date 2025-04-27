import React, { useEffect, useRef } from '@rbxts/react';
import { type Binding, useBinding, useMemo } from '@rbxts/react';
import type { MotionGoal, SpringOptions } from '@rbxts/ripple';
import { Motion, createMotion } from '@rbxts/ripple';
import { RunService } from '@rbxts/services';
import { useMotion } from './useMotion';
import useSignal from './useSignal';

function getBindingValue<T extends MotionGoal>(goal: T | Binding<T>): T {
	// check if T is a binding type
	if (typeIs(goal, 'table') && (goal as Binding<T>).getValue) {
		return (goal as Binding<T>).getValue();
	} else {
		return goal as T;
	}
}

export function useSpring<T extends MotionGoal>(goal: T | Binding<T>, options?: SpringOptions): Binding<T>;

export function useSpring(goal: MotionGoal | Binding<MotionGoal>, options?: SpringOptions) {
	const [binding, motion] = useMotion(getBindingValue(goal));
	const previousValue = useRef(getBindingValue(goal));

	useSignal(RunService.Heartbeat, () => {
		const currentValue = getBindingValue(goal);

		if (currentValue !== previousValue.current) {
			previousValue.current = currentValue;
			motion.spring(currentValue, options);
		}
	});

	return binding;
}

// function useSprings should take a table of goals and return an object of bindings
// it should be properly typed to ensure that the keys of the object are preserved
export function useSprings<T extends { [key: string]: MotionGoal }>(
	goals: T,
	options?: SpringOptions,
): { [K in keyof T]: Binding<T[K]> } {
	const bindings = useMemo(() => {
		const result = {} as { [K in keyof T]: Binding<T[K]> };

		for (const [key, goal] of pairs(goals)) {
			result[key as keyof T] = useSpring(goal, options) as Binding<T[keyof T]>;
		}

		return result;
	}, [goals, options]);

	return bindings;
}
