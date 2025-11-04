import os
import fnmatch

def print_tree_filtered(start_dir, ignore_dirs=None, ignore_files_patterns=None):
    if ignore_dirs is None:
        ignore_dirs = ['.git', '__pycache__', 'node_modules', '.venv', '.vscode']
    if ignore_files_patterns is None:
        ignore_files_patterns = ['*.log', '*.tmp']

    for root, dirs, files in os.walk(start_dir):
        
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        
        files = [f for f in files if not any(fnmatch.fnmatch(f, pattern) for pattern in ignore_files_patterns)]

        level = root.replace(start_dir, '').count(os.sep)
        indent = '│   ' * level
        
        if level > 0:
            print(f"{indent}├── {os.path.basename(root)}/")
        else:
            print(f"{os.path.basename(root)}/")

        for i, file in enumerate(files):
            is_last_file = i == len(files) - 1
            file_indent = '│   ' * (level + 1)
            print(f"{file_indent}├── {file}")

print_tree_filtered('C:/Users/lieds/OneDrive/Área de Trabalho/God Level Coder Challenge/godlevelanalytics')