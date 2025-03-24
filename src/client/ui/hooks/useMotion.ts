import { RunService } from "@rbxts/services";
import { useEffect } from "@rbxts/react";
import { useMemo, Binding, useBinding } from "@rbxts/react";
import type { MotionGoal } from "@rbxts/ripple";
import { createMotion, Motion } from "@rbxts/ripple";

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
