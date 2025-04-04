import { UserInputService } from "@rbxts/services";

export type Keybind = Enum.UserInputType | Enum.KeyCode;
type Action = () => void;

export default class KeybindManager {
	private connection?: RBXScriptConnection;
	private keybinds: Map<Keybind, Action>;

	constructor() {
		this.keybinds = new Map();
	}

	public addKeybind(keybind: Keybind, action: Action): void {
		this.keybinds.set(keybind, action);
	}

	public removeKeybind(keybind: Keybind): void {
		this.keybinds.delete(keybind);
	}

	public connect(): RBXScriptConnection {
		const connection = UserInputService.InputBegan.Connect((input, processed) => {
			if (processed === false) {
				this.keybinds.forEach((callback, key) => {
					if (key.EnumType === Enum.KeyCode) {
						if (input.KeyCode === key) callback();
					} else {
						if (input.UserInputType === key) callback();
					}
				});
			}
		});

		this.connection = connection;
		return connection;
	}

	public disconnect(): void {
		if (this.connection !== undefined) {
			this.connection.Disconnect();
		}
	}
}
