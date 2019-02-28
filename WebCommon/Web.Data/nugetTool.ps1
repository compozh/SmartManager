
#chcp 437

$scriptpath = $MyInvocation.MyCommand.Path
$dir = Split-Path $scriptpath
Write-host "My directory is $dir"
Push-Location $dir
dotnet build -c Release
nuget pack  -Prop Configuration=Release
nuget push -Source "It-Enterprise" -ApiKey kd7ncvz2trhymja23v3zqwbj2ijifrsvgoka3gbpytnurymfuyva *.nupkg
Remove-Item *.nupkg