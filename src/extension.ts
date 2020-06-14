import * as vscode from 'vscode';

const printableLetterRegexp = /^[^\p{Cc}\p{Cf}\p{Zl}\p{Zp}]$/

function whatchar(): string | void {
	const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
	if (editor && editor.selection.isEmpty) {
		const position = editor.selection.active;
		const offset = editor.document.offsetAt(position)
		const codePoint = editor.document.getText().codePointAt(offset)
		const letter = codePoint && String.fromCodePoint(codePoint)
		if (codePoint && letter) {
			const code = "U+" + codePoint.toString(16).padStart(4, "0").toUpperCase()
			if (printableLetterRegexp.test(letter)) {
				return `"${letter}" (${code})`
			} else {
				return `(${code})`
			}
		}
	}
}

export function activate(context: vscode.ExtensionContext) {

	const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 10)

	context.subscriptions.push(item)

	context.subscriptions.push(vscode.commands.registerCommand('whatchar.show', () => {
		const text = whatchar()
		if (text) {
			vscode.window.showInformationMessage(text)
		} else {
			vscode.window.showInformationMessage("No character at point")
		}
	}))

	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection((e) => {
		const text = whatchar()
		if (text) {
			item.text = text
			item.show()
		}
	}))
}

export function deactivate() { }
