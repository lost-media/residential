import { useEffect } from "@rbxts/react";
import { type Binding, useBinding, useMemo } from "@rbxts/react";
import type { MotionGoal } from "@rbxts/ripple";
import { type Motion, createMotion } from "@rbxts/ripple";
import { RunService } from "@rbxts/services";

export function useMotion<T extends MotionGoal>(initialValue: T): LuaTuple<[Binding<T>, Motion<T>]>;

export function useMotion<T extends MotionGoal>(initialValue: T) {
	const motion = useMemo(() => {
		return createMotion(initialValue);
	}, []);

	const [binding, setValue] = useBinding(initialValue);

	useEffect(() => {
		const heartbeat = RunService.Heartbeat.Connect((delta) => {
			const value = motion.step(delta);

			if (value !== binding.getValue()) {
				setValue(value);
			}
		});

		return () => heartbeat.Disconnect();
	}, [motion, binding, setValue]);

	return $tuple(binding, motion);
}
