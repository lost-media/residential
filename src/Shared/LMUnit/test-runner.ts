import { getDescendantsOfType } from "@rbxts/instance-utility";
import { flatten, hasMetadata } from "./utils";
import { Constructor, Metadata, TestMethod } from "./common";
import { StringBuilder } from "@rbxts/string-builder";
import Object from "@rbxts/object-utils";

type TestClassInstance = Record<string, Callback>;
type TestClassConstructor = Constructor<TestClassInstance>;

type TestClassType = {
	[Metadata.TestList]: Map<string, TestMethod>;
	setUp?: Callback;
	beforeAll?: Callback;
	beforeEach?: Callback;
	afterAll?: Callback;
	afterEach?: Callback;

	[key: string]: unknown;
};

interface TestCaseResult {
	readonly errorMessage?: string;
	readonly timeElapsed: number;
}

interface TestRunOptions {
	readonly reporter: (testResults: string) => void;
	readonly colors: boolean;
}

export class TestRunner {
	private readonly testClasses: [TestClassConstructor, TestClassInstance][];
	private results: Map<TestClassConstructor, Record<string, TestCaseResult>>;

	private failedTests: number;
	private passedTests: number;

	public constructor(...args: Instance[]) {
		this.testClasses = new Array<[TestClassConstructor, TestClassInstance]>();
		this.results = new Map<TestClassConstructor, Record<string, TestCaseResult>>();
		this.failedTests = 0;
		this.passedTests = 0;

		const modules = flatten(args.map((root) => getDescendantsOfType(root, "ModuleScript")));
		for (const module of modules) {
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			const testClass = <Constructor>require(module);
			this.addClass(testClass);
		}
	}

	private addClass(ctor: Constructor): void {
		const testClass = <TestClassConstructor>ctor;
		const newClass = <TestClassInstance>new ctor();

		if (newClass.setUp !== undefined) {
			newClass.setUp(newClass);
		}

		this.testClasses.push([testClass, newClass]);
	}

	public async run(): Promise<void> {
		const start = os.clock();

		for (const [testClass, testClassInstance] of this.testClasses) {
			// run beforeAll here
			if (testClassInstance.beforeAll !== undefined) {
				testClassInstance.beforeAll(testClass);
			}

			await this.runTestClass(testClass, testClassInstance);

			if (testClassInstance.afterAll !== undefined) {
				testClassInstance.afterAll(testClass);
			}
		}

		const elapsedTime = os.clock() - start;

		print(this.generateOutput(elapsedTime));
	}

	private getTestsFromTestClass(testClass: TestClassConstructor): ReadonlyArray<TestMethod> {
		if (hasMetadata(testClass, Metadata.TestList) === false) return [];

		const list: Map<string, TestMethod> = (testClass as unknown as TestClassType)[Metadata.TestList];

		const res = new Array<TestMethod>();
		list.forEach((val) => {
			res.push(val);
		});

		return res;
	}

	private async runTestClass(testClass: TestClassConstructor, testClassInstance: TestClassInstance): Promise<void> {
		const addResult = (name: string, result: TestCaseResult) => {
			let classResults = this.results.get(testClass);
			if (classResults === undefined) classResults = this.results.set(testClass, {}).get(testClass)!;

			classResults[name] = result;
		};

		const fail = (exception: unknown, name: string, results: Omit<TestCaseResult, "errorMessage">): void => {
			this.failedTests++;
			addResult(name, {
				errorMessage: tostring(exception),
				timeElapsed: results.timeElapsed,
			});
		};

		const pass = (name: string, results: Omit<TestCaseResult, "errorMessage">): void => {
			this.passedTests++;
			addResult(name, {
				timeElapsed: results.timeElapsed,
			});
		};

		const runTestCase = async (callback: Callback, name: string): Promise<boolean> => {
			const start = os.clock();
			try {
				await callback(testClassInstance);
			} catch (e) {
				const timeElapsed = os.clock();
				fail(e, name, { timeElapsed });
				return false;
			}

			const timeElapsed = os.clock() - start;
			pass(name, { timeElapsed });
			return true;
		};

		const testList = this.getTestsFromTestClass(testClass);

		testList.forEach(async (test) => {
			const callback = <Callback>(testClass as unknown as TestClassType)[test.name];
			await runTestCase(callback, test.name);
		});
	}

	private generateOutput(elapsedTime: number): string {
		const results = new StringBuilder("\n\n");

		const getSymbol = (passed: boolean) => (passed ? "+" : "×");

		this.results.forEach((testResultsRecord, testClass) => {
			const testResults = Object.entries(testResultsRecord);

			const allTestsPassed = testResults.every(([_, cases]) => cases.errorMessage === undefined);

			const totalTimeElapsed = testResults.map(([_, val]) => val.timeElapsed).reduce((sum, n) => sum + n);

			results.appendLine(
				`[${getSymbol(allTestsPassed)}] ${testClass} (${math.round(totalTimeElapsed * 1000)}ms)`,
			);

			testResults.forEach((testResult, index) => {
				const [testCaseName, testCase] = testResult;

				const passed = testCase.errorMessage === undefined;
				const timeElapsed = testCase.timeElapsed;
				const isLast = index === testResults.size() - 1;

				results.append(" │");

				results.appendLine(
					`\t${isLast ? "└" : "├"}── [${getSymbol(passed)}] ${testCaseName} (${math.round(timeElapsed * 1000)}ms) ${!passed ? "FAILED" : ""}`,
				);
			});

			results.appendLine("");
		});

		if (this.failedTests > 0) {
			results.appendLine("Failures:");

			let failureIndex = 0;

			for (const [className, testResults] of pairs(this.results))
				for (const [testCaseName, { errorMessage }] of pairs(testResults)) {
					if (errorMessage === undefined) continue;
					results.appendLine(`${++failureIndex}. ${className}.${testCaseName}`);

					const errorDisplay = tostring(errorMessage)
						.split("\n")
						.map((line) => "   " + line)
						.join("\n\t");
					results.appendLine(errorDisplay);
					results.appendLine("");
				}
		}

		const totalTests = this.passedTests + this.failedTests;
		results.appendLine("");
		results.appendLine(`\tRan ${totalTests} tests in ${math.round(elapsedTime * 1000)}ms`);
		results.appendLine(`\t\tPassed: ${this.passedTests}`);
		results.appendLine(`\t\tFailed: ${this.failedTests}`);
		results.appendLine("");

		return results.toString();
	}
}
