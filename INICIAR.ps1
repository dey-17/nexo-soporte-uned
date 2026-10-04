$ErrorActionPreference = 'Stop'
$proyecto = Join-Path $PSScriptRoot 'ManteniWeb\ManteniWeb.csproj'
$vswhere = Join-Path ${env:ProgramFiles(x86)} 'Microsoft Visual Studio\Installer\vswhere.exe'
if (!(Test-Path -LiteralPath $vswhere)) { throw 'Instale Visual Studio con Desarrollo de ASP.NET y web y el targeting pack .NET Framework 4.8.' }
$msbuild = & $vswhere -latest -products '*' -find 'MSBuild\**\Bin\MSBuild.exe' | Select-Object -First 1
if (!$msbuild) { throw 'No se encontró MSBuild de Visual Studio.' }
& $msbuild $proyecto /t:Build /p:Configuration=Debug /verbosity:minimal /nologo
if ($LASTEXITCODE -ne 0) { throw 'La compilación no terminó correctamente.' }
$iis = Join-Path $env:ProgramFiles 'IIS Express\iisexpress.exe'
if (!(Test-Path -LiteralPath $iis)) { throw 'No se encontró IIS Express. Abra la solución en Visual Studio y use F5.' }
Write-Host 'Abra http://localhost:51840/ en su navegador. Ctrl+C detiene el servidor.'
& $iis "/path:$(Join-Path $PSScriptRoot 'ManteniWeb')" /port:51840 /systray:false
