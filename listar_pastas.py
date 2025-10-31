import os
import fnmatch

def print_tree_filtered(start_dir, ignore_dirs=None, ignore_files_patterns=None):
    if ignore_dirs is None:
        ignore_dirs = ['.git', '__pycache__', 'node_modules', '.venv', '.vscode']
    if ignore_files_patterns is None:
        ignore_files_patterns = ['*.log', '*.tmp']

    # Caminha recursivamente
    for root, dirs, files in os.walk(start_dir):
        
        # Filtra pastas a serem ignoradas (impede o os.walk de entrar nelas)
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        
        # Filtra arquivos a serem ignorados
        files = [f for f in files if not any(fnmatch.fnmatch(f, pattern) for pattern in ignore_files_patterns)]

        # Calcula o nível de indentação
        level = root.replace(start_dir, '').count(os.sep)
        indent = '│   ' * level
        
        # Imprime a pasta atual
        if level > 0:
            print(f"{indent}├── {os.path.basename(root)}/")
        else:
            # Imprime a raiz do projeto sem indentação extra
            print(f"{os.path.basename(root)}/")

        # Imprime os arquivos dentro da pasta
        for i, file in enumerate(files):
            is_last_file = i == len(files) - 1
            file_indent = '│   ' * (level + 1)
            print(f"{file_indent}├── {file}")

# Exemplo de uso: substitua '.' pelo caminho do seu projeto
print_tree_filtered('C:/Users/lieds/OneDrive/Área de Trabalho/God Level Coder Challenge/godlevelanalytics')
