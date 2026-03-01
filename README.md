# super-bas

A simple project with VS Code integration.

## Opening in VS Code

### Using the Script

The project includes an executable script to open VS Code. Simply run:

```bash
./open-vscode.sh
```

Note: The script is already executable. If you encounter permission issues, run:
```bash
chmod +x open-vscode.sh
```

### Manual Method

You can also open the project manually:

```bash
code .
```

Or from VS Code:
1. Open VS Code
2. Go to File → Open Folder
3. Select this project directory

## VS Code Configuration

This project includes:
- `.vscode/settings.json` - Recommended editor settings
- `.vscode/extensions.json` - Recommended VS Code extensions

VS Code will automatically suggest installing the recommended extensions when you open the project.