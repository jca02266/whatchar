import * as vscode from 'vscode';
import * as iconv from 'iconv-lite';

const printableLetterRegexp = /^[^\p{Cc}\p{Cf}\p{Zl}\p{Zp}]$/

function whatchar(): string | void {
	const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
	if (editor && editor.selection.isEmpty) {
		const position = editor.selection.active;
		const offset = editor.document.offsetAt(position)
		const codePoint = editor.document.getText().codePointAt(offset)
		const letter = codePoint && String.fromCodePoint(codePoint)
		if (codePoint && letter) {
			const hex = "U+" + codePoint.toString(16).padStart(4, "0").toUpperCase();
			const dec = codePoint.toString(10);

			const utf8 = Buffer.from(letter, 'utf8').toString('hex').toUpperCase();
			const utf16be = iconv.encode(letter, 'utf-16be').toString('hex').toUpperCase();

			let cp932: string;
			try {
				const buf = iconv.encode(letter, 'cp932');
				// iconv-lite maps unmappable characters to '?'.
				// We check if the result is '?' and the original char was not '?'.
				if (buf.length === 1 && buf[0] === 0x3f && letter !== '?') {
					cp932 = '(unmappable)';
				} else {
					cp932 = buf.toString('hex').toUpperCase();
				}
			} catch (e) {
				cp932 = '(error)';
			}

			const detail = `(${hex}, Dec: ${dec}, UTF-8: ${utf8}, UTF-16BE: ${utf16be}, CP932: ${cp932})`
			if (printableLetterRegexp.test(letter)) {
				return `"${letter}" ${detail}`
			} else {
				return detail
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

	const updateStatusBar = () => {
		const enabled = vscode.workspace.getConfiguration('whatchar').get<boolean>('showOnCursorMove', true)
		if (!enabled) {
			item.hide()
			return
		}
		const text = whatchar()
		if (text) {
			item.text = text
			item.show()
		} else {
			item.hide()
		}
	}

	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(() => updateStatusBar()))

	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('whatchar.showOnCursorMove')) {
			updateStatusBar()
		}
	}))
}

export function deactivate() { }
