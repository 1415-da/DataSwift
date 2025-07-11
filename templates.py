import os
from pathlib import Path

# Define the Dataswift folder structure for a Linear-inspired React frontend
structure = {
    "frontend": {
        "public": [
            "index.html",
            "favicon.ico"
        ],
        "src": {
            "assets": [],
            "components": [
                "Sidebar.jsx",
                "Topbar.jsx",
                "Card.jsx",
                "List.jsx",
                "Button.jsx",
                "Input.jsx",
                "Avatar.jsx"
            ],
            "layouts": [
                "MainLayout.jsx"
            ],
            "pages": [
                "Data.jsx",
                "EDA.jsx",
                "ModelLab.jsx",
                "Testing.jsx",
                "Collaboration.jsx",
                "Docs.jsx",
                "History.jsx",
                "Settings.jsx"
            ],
            "styles": [
                "theme.module.css",
                "linear-inspired.module.css"
            ],
            "context": [
                "AuthContext.jsx",
                "ThemeContext.jsx"
            ],
            "services": [
                "apiService.js"
            ],
            "App.jsx": "",
            "main.jsx": ""
        },
        "tests": [],
        "vite.config.js": ""
    },
    "backend": {
        "src": {
            "api": [],
            "controllers": [],
            "models": [],
            "services": [],
            "utils": [],
            "middleware": [],
            "config": [],
            "app.js": ""
        },
        "tests": [],
        "requirements.txt": ""
    },
    "scripts": [],
    "docs": [],
    ".github": [],
    "README.md": "",
    "package.json": "",
    ".env": "",
    ".gitignore": "",
    "docker-compose.yml": ""
}

def create_structure(base_path, structure):
    for name, content in structure.items():
        path = Path(base_path) / name
        if isinstance(content, dict):
            path.mkdir(parents=True, exist_ok=True)
            create_structure(path, content)
        elif isinstance(content, list):
            path.mkdir(parents=True, exist_ok=True)
            for item in content:
                item_path = path / item
                if isinstance(item, dict):
                    create_structure(path, item)
                else:
                    if '.' in item:  # It's a file
                        item_path.touch()
                    else:  # It's a folder
                        item_path.mkdir(exist_ok=True)
        else:
            # It's a file
            path.touch()

if __name__ == "__main__":
    project_root = Path.cwd() / "Dataswift"
    project_root.mkdir(exist_ok=True)
    create_structure(project_root, structure)
    print(f"Dataswift folder structure created at {project_root.resolve()}")
