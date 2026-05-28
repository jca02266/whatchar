import * as path from 'path';
import * as fs from 'fs';
import * as Mocha from 'mocha';

function findTestFiles(dir: string): string[] {
	const results: string[] = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...findTestFiles(full));
		} else if (entry.name.endsWith('.test.js')) {
			results.push(full);
		}
	}
	return results;
}

export function run(): Promise<void> {
	const mocha = new Mocha({ ui: 'tdd', color: true });
	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((c, e) => {
		findTestFiles(testsRoot).forEach(f => mocha.addFile(f));
		try {
			mocha.run(failures => {
				if (failures > 0) {
					e(new Error(`${failures} tests failed.`));
				} else {
					c();
				}
			});
		} catch (err) {
			console.error(err);
			e(err);
		}
	});
}
