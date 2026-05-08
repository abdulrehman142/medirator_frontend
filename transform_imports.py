import os
import re
import sys

# Regex to match the import line
# import <identifier> from "/medirator_images/...";
# Groups: 1: identifier, 2: path
import_regex = re.compile(r'import\s+([a-zA-Z0-9_]+)\s+from\s+"(/medirator_images/[^"]+)";')

def transform_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    matches = list(import_regex.finditer(content))
    if not matches:
        return False

    modified_content = content
    skipped = False

    # Process matches in reverse order to not mess up indices if we were substituting ranges,
    # but here we'll just do global replaces of the identifier.
    # To be safe, we'll collect all transformations first.
    
    transformations = []
    for match in matches:
        identifier = match.group(1)
        path = match.group(2)
        full_import_line = match.group(0)
        transformations.append((identifier, path, full_import_line))

    # Check for potential conflicts: 
    # If the identifier is used in a way that might be ambiguous, we might skip.
    # But the requirement is "replace all whole-word usages".
    
    new_content = content
    for identifier, path, full_import_line in transformations:
        # Remove the import line
        new_content = new_content.replace(full_import_line, "")
        
        # Replace whole-word usages
        # Use regex for whole-word boundary
        word_regex = re.compile(r'\b' + re.escape(identifier) + r'\b')
        new_content = word_regex.sub(f'"{path}"', new_content)

    with open(filepath, 'w') as f:
        f.write(new_content)
    
    return True

if __name__ == "__main__":
    files = sys.argv[1:]
    modified_files = []
    for f in files:
        if transform_file(f):
            modified_files.append(f)
    print("\n".join(modified_files))
