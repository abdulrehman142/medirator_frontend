import os
import re

# Regex for "prefix"/path"suffix"
nested_regex = re.compile(r'([^"]+)"(/medirator_images/[^"]+)"([^"]+)')

def fix_nested(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    new_lines = []
    changed = False
    for line in lines:
        # Check if line has "something"/path"something"
        # Specifically looking for the pattern in Navbar.tsx etc.
        if '"/medirator_images/' in line:
            # Match pattern: some_text"/medirator_images/..."some_text
            # But only within a single quoted segment or similar.
            # Let's try to find "..."/path"..." and merge them.
            new_line = re.sub(r'"(/medirator_images/[^"]+)"', r'\1', line)
            # This replaces "href="https://www."/path".com/" -> "href="https://www./path.com/"
            if new_line != line:
                new_lines.append(new_line)
                changed = True
                continue
        new_lines.append(line)
    
    if changed:
        with open(filepath, 'w') as f:
            f.writelines(new_lines)
        return True
    return False

files = [
    "src/components/Footer.tsx",
    "src/components/Navbar.tsx",
    "src/components/role-pages/RoleNavbar.tsx",
]

for f in files:
    if os.path.exists(f):
        if fix_nested(f):
            print(f"Fixed nested in {f}")
