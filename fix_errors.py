import os
import re

# We want to replace double quotes that wrap the path
# i.e., replace ""/medirator_images/..."" with "/medirator_images/..."
double_quoted_path_regex = re.compile(r'""(/medirator_images/[^"]+)""')

# We want to replace the case where it was inside an existing string:
# "https://www."/medirator_images/instaicon.png".com/..."
# this becomes "https://www." + "/medirator_images/instaicon.png" + ".com/..." if we want literal,
# but the requirement said: "replace all whole-word usages of that identifier in the same file with the corresponding string literal path"
# If the identifier was part of a string, it shouldn't have been replaced if we used word boundaries \b.
# Wait, "instaicon" was replaced inside a string because it was probably not a string but an identifier?
# Let's look at Navbar.tsx again.

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # 1. Fix the double-quote issue: ""/path"" -> "/path"
    new_content = double_quoted_path_regex.sub(r'"\1"', content)
    
    # 2. Fix the nested string issue: "prefix"/path"suffix" -> "prefix" + "/path" + "suffix"
    # Or more simply, since we know they were literal paths, just fix it to be a single string if possible.
    # Actually, the user asked to replace identifier with path. 
    # If the user had: const url = `https://${instaicon}.com`
    # and we replaced instaicon with "/path", it would be `https://${"/path"}.com` which is valid.
    # But if they had: href="https://www.instaicon.com"
    # then \binstaicon\b shouldn't have matched unless it was a separate word.
    
    # Let's look at what happened in Navbar.tsx:
    # href="https://www."/medirator_images/instaicon.png".com/mediratorinfo2026/"
    # This means the original was href="https://www.instaicon.com/..." ? 
    # No, that doesn't make sense if instaicon was an imported identifier.
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        return True
    return False

files = [
    "src/components/Dropdown.tsx",
    "src/components/Footer.tsx",
    "src/components/Hero.tsx",
    "src/components/Navbar.tsx",
    "src/components/Rating.tsx",
    "src/components/Whychooseus.tsx",
    "src/components/role-pages/RoleNavbar.tsx",
    "src/pages/FAQs.tsx",
    "src/pages/HowitWorks.tsx",
    "src/pages/Login.tsx",
    "src/pages/Medibot.tsx",
    "src/pages/PrivacyPolicy.tsx",
    "src/pages/Register.tsx",
    "src/pages/Terms&Conditions.tsx",
    "src/pages/services/Appointments.tsx",
    "src/pages/services/DataSecurity.tsx",
    "src/pages/services/HealthRisks.tsx",
    "src/pages/services/MedicalHistory.tsx",
    "src/pages/services/Salts.tsx",
    "src/pages/services/Services.tsx",
    "src/pages/services/TestResults.tsx",
    "src/pages/services/UnifiedRecords.tsx",
    "src/pages/services/Visualizer.tsx"
]

for f in files:
    if os.path.exists(f):
        if fix_file(f):
            print(f"Fixed {f}")
