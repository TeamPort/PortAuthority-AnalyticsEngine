const vscode = require('vscode');

function activate(context) 
{
    let disposable = vscode.commands.registerCommand('extension.analyze', () => {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn: undefined;

        if (AnalysisPanel.currentPanel) 
        {
            AnalysisPanel.currentPanel._panel.reveal(column);
            return;
        }
        else
        {
            const panel = vscode.window.createWebviewPanel(
                AnalysisPanel.viewType,
                'PortAuthority',
                column || vscode.ViewColumn.One,
                {
                    // Enable javascript in the webview
                    enableScripts: true,
                }
            );
            AnalysisPanel._panel = panel
        }

        AnalysisPanel._panel.webview.html = AnalysisPanel.getHtmlForWebview(context.extensionUri, AnalysisPanel._panel.webview)
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}

class AnalysisPanel 
{
    static _panel = undefined
    static getHtmlForWebview(extensionUri, webview) 
    {
        return `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="background-color:powderblue;">
    </body>
    </html>
`;
    }
}
