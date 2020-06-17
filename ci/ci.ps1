function AddBuildIdToYamlAppVersion([string]$pathToChartYaml,[string]$buildNumber)
{
    Write-Host "path $($pathToChartYaml)"
    Write-Host "BuilId $($buildNumber)"
    $fl = [System.IO.File]::ReadAllLines($pathToChartYaml);
	$r = New-Object System.Text.RegularExpressions.Regex("appVersion:(\s*)(\d+.\d+.\d+)\s*$");
    [String]$res = "";
    foreach ($j in [System.Linq.Enumerable]::Select($fl,[Func[object,int,object]]{param($l,$i) $r = @{l = $l; i = $i}; return $r; }))
	{
		if ($r.Match($j.l).Success)
		{
            $res = $j.l.TrimEnd()+".$($buildNumber)";
            $fl[$j.i] = $res;
            Write-Host "appVersion found"
		}
	}
    [System.IO.File]::WriteAllLines($pathToChartYaml,$fl);
    Write-Host "version with build is $($res)"
    return $res.Replace("appVersion:","").Trim();
}

function RegisterVersionOnITServiceRepo([string]$pathToChartDirectory,[string]$ServiceId,[string]$Version,[string]$Email)
{
    Add-Type -AssemblyName System.IO.Compression.FileSystem ; [System.IO.Compression.ZipFile]::CreateFromDirectory("$($pathToChartDirectory)", "$($pathToChartDirectory).zip");
    $Content=[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("$($pathToChartDirectory).zip"));
    Invoke-WebRequest -Uri http://m.it.ua/ws/api/servicedef.vers.create -UseBasicParsing -Method post -Body $('{ "ServiceDefinitionId":"'+$ServiceId+'","Version":"'+$Version+'","Content":"' +$Content+ '", "contenttype":"HelmChart", "Creator":"'+$Email+'" }')
}

function GetYamlAppVersion([string]$pathToChartYaml)
{
    return (Get-Content $pathToChartYaml | Select-String -Pattern "appVersion:(\s*)(\d+.\d+.\d+.\d+)\s*$").Matches.Groups[2].Value;
}

function DoReleasesFromSettings([string] $settingsPath,[string] $currentBranch,[string] $pathToChart)
{
    $settings =  Get-Content $settingsPath | ConvertFrom-Json
    if ($settings.SettingsVersion -ne 1) 
    {
        return    
    }
    foreach ($release in $settings.Releases) 
    {
        if (BranchesAreEqual $currentBranch $release.Branch) 
        {
            Write-Host "Deploing release $($release.Name) for project $($release.Project) and branch $($release.Branch) and user values $($release.UserValues)"
            DeployRelease $release.Name $pathToChart $release.UserValues   
        }
    }
}

function DeployRelease([string] $name, [string] $pathToChart, [string] $userValues)
{
    if ([string]::IsNullOrEmpty($userValues)) {
        helm upgrade $name.ToLower() $pathToChart -i --force --set xxx=zzz
    }
    else {
        $PathToUserValues = $pathToChart+(&{If($pathToChart.Substring($pathToChart.Length - 1) -eq "\") {""} Else {"\"}})+$userValues
        helm upgrade $name.ToLower() $pathToChart -i --force --values $PathToUserValues
    }
}

function BranchesAreEqual([string] $current, [string] $expected)
{
    Write-Host "$current"
    Write-Host "*$expected"
    return $($current -like "*$expected")
}