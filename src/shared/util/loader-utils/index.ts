export function loadChildren(parent: Instance): Array<unknown> {
	const children = parent.GetChildren();
	const modules = children.filter((instance) => instance.IsA("ModuleScript"));
    return modules.map((module) => require(module));
}