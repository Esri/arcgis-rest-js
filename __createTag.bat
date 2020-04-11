for %%F in ("%cd%") do set "folder=%%~nxF"
echo git repository %folder%, branch >source.txt
git rev-parse --abbrev-ref HEAD >>source.txt
git log -1>>source.txt
