const destack = require("../../lib/helpers/destack");

// Tests.
describe("destack()", () => {
	test("First argument must be nonempty string", () => {
		expect(destack("")).toEqual([]);
		expect(destack(123)).toEqual([]);
		expect(destack(true)).toEqual([]);
	});
	test("Chrome, Node, IE, Edge", () => {
		expect(destack("Error\n    at abc (file.js:1:2)")).toEqual([
			{ function: "abc()", file: "file.js", line: 1, column: 2, original: "    at abc (file.js:1:2)" },
		]);
		expect(destack("Error\n    at abc (file.js:1)")).toEqual([
			{ function: "abc()", file: "file.js", line: 1, column: null, original: "    at abc (file.js:1)" },
		]);
		expect(destack("Error\n    at abc (file.js)")).toEqual([
			{ function: "abc()", file: "file.js", line: null, column: null, original: "    at abc (file.js)" },
		]);
		expect(destack("Error\n    at <anonymous> (file.js:1:2)")).toEqual([
			{
				function: "",
				file: "file.js",
				line: 1,
				column: 2,
				original: "    at <anonymous> (file.js:1:2)",
			},
		]);
		expect(destack("Error\n    at file.js:1:2")).toEqual([
			{ function: "", file: "file.js", line: 1, column: 2, original: "    at file.js:1:2" },
		]);
		expect(destack("Error\n    at file.js:1")).toEqual([
			{ function: "", file: "file.js", line: 1, column: null, original: "    at file.js:1" },
		]);
		expect(destack("Error\n    at file.js")).toEqual([
			{ function: "", file: "file.js", line: null, column: null, original: "    at file.js" },
		]);
		expect(destack("Error\n    at <anonymous>:1:2")).toEqual([
			{ function: "", file: "", line: 1, column: 2, original: "    at <anonymous>:1:2" },
		]);
		expect(destack("Error\n    at <anonymous>:1")).toEqual([
			{ function: "", file: "", line: 1, column: null, original: "    at <anonymous>:1" },
		]);
		expect(destack("Error\n    at <anonymous>")).toEqual([
			{ function: "", file: "", line: null, column: null, original: "    at <anonymous>" },
		]);
		const stack2 = [
			"Error",
			"    at abc (<anonymous>:1:30)",
			"    at Object.def (<anonymous>:1:18)",
			"    at GHI.ghi (<anonymous>:2:9)",
			"    at <anonymous>:1:3",
			"    at <anonymous>:1",
			"    at <anonymous>",
		];
		expect(destack(stack2.join("\n"))).toEqual([
			{ function: "abc()", file: "", line: 1, column: 30, original: "    at abc (<anonymous>:1:30)" },
			{ function: "def()", file: "", line: 1, column: 18, original: "    at Object.def (<anonymous>:1:18)" },
			{ function: "GHI.ghi()", file: "", line: 2, column: 9, original: "    at GHI.ghi (<anonymous>:2:9)" },
			{ function: "", file: "", line: 1, column: 3, original: "    at <anonymous>:1:3" },
			{ function: "", file: "", line: 1, column: null, original: "    at <anonymous>:1" },
			{ function: "", file: "", line: null, column: null, original: "    at <anonymous>" },
		]);
		const stack3 = [
			"Error",
			"    at Object.test (/blork/test/functions/destack.test.js:21:15)",
			"    at Object.asyncFn (/jest-jasmine2/build/jasmine_async.js:129:432)",
			"    at resolve (/jest-jasmine2/build/queue_runner.js:51:12)",
			"    at new Promise (<anonymous>)",
			"    at mapper (/jest-jasmine2/build/queue_runner.js:40:274)",
			"    at promise.then (/jest-jasmine2/build/queue_runner.js:83:39)",
			"    at <anonymous>",
			"    at process._tickCallback (internal/process/next_tick.js:182:7)",
		];
		expect(destack(stack3.join("\n"))).toEqual([
			{
				function: "test()",
				file: "/blork/test/functions/destack.test.js",
				line: 21,
				column: 15,
				original: "    at Object.test (/blork/test/functions/destack.test.js:21:15)",
			},
			{
				function: "asyncFn()",
				file: "/jest-jasmine2/build/jasmine_async.js",
				line: 129,
				column: 432,
				original: "    at Object.asyncFn (/jest-jasmine2/build/jasmine_async.js:129:432)",
			},
			{
				function: "resolve()",
				file: "/jest-jasmine2/build/queue_runner.js",
				line: 51,
				column: 12,
				original: "    at resolve (/jest-jasmine2/build/queue_runner.js:51:12)",
			},
			{
				function: "new Promise()",
				file: "",
				line: null,
				column: null,
				original: "    at new Promise (<anonymous>)",
			},
			{
				function: "mapper()",
				file: "/jest-jasmine2/build/queue_runner.js",
				line: 40,
				column: 274,
				original: "    at mapper (/jest-jasmine2/build/queue_runner.js:40:274)",
			},
			{
				function: "promise.then()",
				file: "/jest-jasmine2/build/queue_runner.js",
				line: 83,
				column: 39,
				original: "    at promise.then (/jest-jasmine2/build/queue_runner.js:83:39)",
			},
			{ function: "", file: "", line: null, column: null, original: "    at <anonymous>" },
			{
				function: "process._tickCallback()",
				file: "internal/process/next_tick.js",
				line: 182,
				column: 7,
				original: "    at process._tickCallback (internal/process/next_tick.js:182:7)",
			},
		]);
	});
	test("Firefox, Safari", () => {
		// Firefox.
		expect(destack("trace@file:///C:/example.html:9:17")).toEqual([
			{
				function: "trace()",
				file: "file:///C:/example.html",
				line: 9,
				column: 17,
				original: "trace@file:///C:/example.html:9:17",
			},
		]);
		expect(destack("@file:///C:/example.html:16:13")).toEqual([
			{
				function: "",
				file: "file:///C:/example.html",
				line: 16,
				column: 13,
				original: "@file:///C:/example.html:16:13",
			},
		]);
		expect(destack("a@file:///C:/example.html:19")).toEqual([
			{
				function: "a()",
				file: "file:///C:/example.html",
				line: 19,
				column: null,
				original: "a@file:///C:/example.html:19",
			},
		]);
		expect(destack("Object.a@file:///C:/example.html:19")).toEqual([
			{
				function: "a()",
				file: "file:///C:/example.html",
				line: 19,
				column: null,
				original: "Object.a@file:///C:/example.html:19",
			},
		]);
		expect(destack("@debugger eval code:21:9")).toEqual([
			{ function: "", file: "", line: 21, column: 9, original: "@debugger eval code:21:9" },
		]);
		const stack1 = [
			"trace@file:///C:/example.html:9:17",
			"@file:///C:/example.html:16:13",
			"a@file:///C:/example.html:19", // No column.
			"@debugger eval code:21:9", // Console.
		];
		expect(destack(stack1.join("\n"))).toEqual([
			{
				function: "trace()",
				file: "file:///C:/example.html",
				line: 9,
				column: 17,
				original: "trace@file:///C:/example.html:9:17",
			},
			{
				function: "",
				file: "file:///C:/example.html",
				line: 16,
				column: 13,
				original: "@file:///C:/example.html:16:13",
			},
			{
				function: "a()",
				file: "file:///C:/example.html",
				line: 19,
				column: null,
				original: "a@file:///C:/example.html:19",
			},
			{ function: "", file: "", line: 21, column: 9, original: "@debugger eval code:21:9" },
		]);
		// Safari.
		expect(destack("def")).toEqual([{ function: "def()", file: "", line: null, column: null, original: "def" }]);
		const stack2 = [
			"def",
			"global code",
			"evaluateWithScopeExtension@[native code]",
			"_evaluateOn",
			"_evaluateAndWrap",
		];
		expect(destack(stack2.join("\n"))).toEqual([
			{ function: "def()", file: "", line: null, column: null, original: "def" },
			{ function: "", file: "", line: null, column: null, original: "global code" },
			{
				function: "evaluateWithScopeExtension()",
				file: "",
				line: null,
				column: null,
				original: "evaluateWithScopeExtension@[native code]",
			},
			{ function: "_evaluateOn()", file: "", line: null, column: null, original: "_evaluateOn" },
			{ function: "_evaluateAndWrap()", file: "", line: null, column: null, original: "_evaluateAndWrap" },
		]);
	});
});
