# यो script ले सबै .md फाइलहरू delete गर्छ।
# This script deletes all .md files in the workspace.
Get-ChildItem -Path . -Filter *.md -Recurse | Remove-Item -Force