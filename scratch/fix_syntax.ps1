$path = "d:\blockchain\src\app\portal\page.tsx"
$content = Get-Content $path
# Line 621 is index 620
$content[620] = "                                  params: [{"
# Line 629 is index 628
$content[628] = "                                  " # Clear line
$content | Set-Content $path
