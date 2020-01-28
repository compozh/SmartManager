[void] [System.Reflection.Assembly]::LoadWithPartialName("System.Drawing") 
[void] [System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms")


$url = 'http://tfs2017:8080/tfs/DefaultCollection/'

$urlWebApps = 'WebApplications'



$objForm = New-Object System.Windows.Forms.Form
$objForm.Text = "Add Application to SP"
$objForm.Size = New-Object System.Drawing.Size(300,615)
$objForm.StartPosition = "CenterScreen"

$objForm.KeyPreview = $True
$objForm.Add_KeyDown({
    if ($_.KeyCode -eq "Enter"){
        $empID=$objTextBox1.Text;$sn=$objTextBox2.Text;$gn=$objTextBox3.Text;$email=$objTextBox4.Text;$title=$objDepartmentListbox.SelectedItem;
        $office=$objOfficeListbox.SelectedItem;$objForm.Close()
    }
})
$objForm.Add_KeyDown({
    if ($_.KeyCode -eq "Escape"){
        $objForm.Close()
    }
})



#РџСѓС‚СЊ Рє РІРµР± С‡Р°СЃС‚Рё SP
$TextBoxSpNumber = New-Object System.Windows.Forms.TextBox 
$TextBoxSpNumber.Location = New-Object System.Drawing.Size(10,40) 
$TextBoxSpNumber.Size = New-Object System.Drawing.Size(260,20)
$TextBoxSpNumber.TabIndex = 0 
$objForm.Controls.Add($TextBoxSpNumber)



	
$objLabel1 = New-Object System.Windows.Forms.Label
$objLabel1.Location = New-Object System.Drawing.Size(10,20) 
$objLabel1.Size = New-Object System.Drawing.Size(280,20) 
$objLabel1.Text = "SP NUMBER"
$objForm.Controls.Add($objLabel1) 


# Список приложений и апи
$domain = @()
$domain += @{"Name"="BpmnModeler"}
$domain += @{"Name"="Eam"}
$domain += @{"Name"="Keys"}
$domain += @{"Name"="Lms"}
$domain += @{"Name"="Mes"}
$domain += @{"Name"="Portal"}
$domain += @{"Name"="Purchases"}
$domain += @{"Name"="Skd"}
$domain += @{"Name"="SmartManager"}
$domain += @{"Name"="WorkflowLauncher"}
$domain += @{"Name"="GraphQL"}
$domain += @{"Name"="HealthSummary + api"}

# Расчитать высоту roupBox
$groupY = $domain.Count * 29

$groupBox = New-Object System.Windows.Forms.GroupBox
$groupBox.Location = New-Object System.Drawing.Size(20,80)  
$groupBox.text = "Apps" 
$groupBox.Size = New-Object System.Drawing.Size(200, $groupY); 
$objForm.Controls.Add($groupBox)


$y = 30
foreach ($a in $domain)
{    
    $Checkbox = New-Object System.Windows.Forms.CheckBox
    $Checkbox.Text = $a.Name
    $Checkbox.Location = New-Object System.Drawing.Size(10,$y)
	$CheckBox.Size = New-Object System.Drawing.Size(180,30)
    $y += 25
    $groupBox.Controls.Add($Checkbox) 
}

$objForm.Controls.Add($groupBox)

$buttonY = $groupY + 90
$buttonOk = New-Object System.Windows.Forms.Button
$buttonOk.Text = "Submit"
$buttonOk.Location = New-Object System.Drawing.Size(20,$buttonY)


$appArray = New-Object System.Collections.Generic.List[System.Object]
$haveWebApps = $false
$GlobalPath = ""


$arrPropsApp = @()

$eventSubmit = [System.EventHandler] {
    $arrPropsApp = @()
    write-host $arrPropsApp

    if($TextBoxSpNumber.Text -eq ""){
		Write-Host "Please write path to SP"
		return
	}

    foreach($checkBox in $groupBox.Controls){
        if($checkBox.Checked -eq $true){
            Write-Host $checkBox.Text
			$appArray.Add($checkBox.Text)
        }
    }
		
    if($appArray.Count -eq 0){
        Write-Host "Please select an applications"
        return
    }

	$GlobalPath = $TextBoxSpNumber.Text | ConvertTo-Json
	   
    Write-Host $GlobalPath
	    
	  
    foreach($app in $appArray){

    $appObject = @{
        appName = $app
        buildNumber = ''
        status = ''
        exit = $false
    }

        # Добавление GraphQL
        if($app -eq "GraphQL"){
            $body = @{
                definition = @{
                    id = 70
                }
                parameters = '{"pathToSP":'+$GlobalPath+',"system.debug":"false", "dir.projectName": "' + ($app) + '"}'
            }
            $resultGQ = Invoke-RestMethod -Uri "$($url)/$($urlWebApps)/_apis/build/builds?api-version=3.1" -UseDefaultCredentials -Method Post -ContentType 'application/json' -body ($body | convertto-json -Compress -Depth 10)
            
            $appObject.buildNumber = $resultGQ.buildNumber
            $arrPropsApp += $appObject

            continue
        }
            
        # HealthSummary Api  Потрудиться над нормальным выводом в HS
        if($app -eq "HealthSummary + api"){
            $body = @{
                definition = @{
                    id = 72
                }
                parameters = '{"pathToSP":'+$GlobalPath+',"system.debug":"false", "dir.projectName": "HealthSummaryApi"}'
            }


            $resultHSApi = Invoke-RestMethod -Uri "$($url)/$($urlWebApps)/_apis/build/builds?api-version=3.1" -UseDefaultCredentials -Method Post -ContentType 'application/json' -body ($body | convertto-json -Compress -Depth 10)
            
            $healthSummaryApi = @{
                appName = "healthSummaryApi"
                buildNumber = $resultHSApi.buildNumber
                status = ''
                exit = $false
            }
            $arrPropsApp += $healthSummaryApi

            # HealthSummary App
            $body = @{
                definition = @{
                    id = 73
                }
                parameters = '{"pathToSP":'+$GlobalPath+',"system.debug":"false", "dir.projectName": "HealthSummary"}'
            }
            $resultHS = Invoke-RestMethod -Uri "$($url)/$($urlWebApps)/_apis/build/builds?api-version=3.1" -UseDefaultCredentials -Method Post -ContentType 'application/json' -body ($body | convertto-json -Compress -Depth 10)
            
            $healthSummary = @{
                appName = "healthSummary"
                buildNumber = $resultHS.buildNumber
                status = ''
                exit = $false
            }
    
            $arrPropsApp += $healthSummary
            continue
        }


        # Добавление веб приложений
        $body = @{
            definition = @{
                id = 69
            }
            parameters = '{"pathToSP":'+$GlobalPath+',"system.debug":"false", "dir.projectName": "' + ($app) + '"}'
        }
        $resultApp = Invoke-RestMethod -Uri "$($url)/$($urlWebApps)/_apis/build/builds?api-version=3.1" -UseDefaultCredentials -Method Post -ContentType 'application/json' -body ($body | convertto-json -Compress -Depth 10)
        $appObject.buildNumber = $resultApp.buildNumber
        $arrPropsApp += $appObject
       
        $haveWebApps = $true
    }

    
    # Веб приложения не добавлены
    if($haveWebApps -eq $false){
        StatusBuilds
        return
    }
        
    # Дизейбл кнопки от повторного нажатия
    $buttonOk.Enabled = $false;

    # Добавление web.config для веб приложений
    $body = @{
        definition = @{
            id = 71
        }
        parameters = '{"pathToSP":'+$GlobalPath+',"system.debug":"false"}'# можно передавать просто имена, что обеспечит нам один билд, а не каждый под приложение
    }
    $appConfig = Invoke-RestMethod -Uri "$($url)/$($urlWebApps)/_apis/build/builds?api-version=3.1" -UseDefaultCredentials -Method Post -ContentType 'application/json' -body ($body | convertto-json -Compress -Depth 10)
    
    $appWebConfig = @{
        appName = "AppWebConfig"
        buildNumber = $appConfig.buildNumber
        status = ''
        exit = $false
    }
    
    $arrPropsApp += $appWebConfig

    # Рекурсивный вызов функции
    StatusBuilds
};




function StatusBuilds 
{ 
    # Переменная для выхода из рекурсии
    $exitBuildsCount = 0
    Write-Host  "Apppication               Buildnumber     Status"

    foreach($app in $arrPropsApp){
        $result = Invoke-RestMethod -Uri "$($url)/$($urlWebApps)/_apis/build/builds?buildNumber=$($app.buildNumber)&api-version=3.1" -UseDefaultCredentials -Method Get
        
        #-------------------------------------
        # Кустарный способ добавление пробелов
        $spacesName = ""
        $spacesBuilds = ""
        $countName = 24 - $app.appName.length
        $countBuilds = 14 - $app.buildNumber.length

        for($i=0; $i -lt $countName; $i++){
            $spacesName +=" "
        }
        for($i=0; $i -lt $countBuilds; $i++){
            $spacesBuilds +=" "
        }
        #-------------------------------------

        if($result.value.status -eq "inProgress"){
            Write-Host $app.appName $spacesName $app.buildNumber $spacesBuilds $result.value.status -ForegroundColor Cyan  
            
        }
        if($result.value.status -eq "notStarted"){
            Write-Host $app.appName $spacesName $app.buildNumber $spacesBuilds $result.value.status -ForegroundColor Gray
        }

        
        if($result.value.result -eq "succeeded"){
            Write-Host $app.appName $spacesName $app.buildNumber $spacesBuilds $result.value.result -ForegroundColor Green
            $app.exit = $true
        }

        if($result.value.result -eq "failed"){
            Write-Host $app.appName $spacesName $app.buildNumber $spacesBuilds $result.value.result -ForegroundColor Red 
            $app.exit = $true
        }

        if($result.value.result -eq "canceled"){
            Write-Host $app.appName $spacesName $app.buildNumber $spacesBuilds $result.value.result -ForegroundColor Yellow
            $app.exit = $true
        }
       
    }

    foreach($app in $arrPropsApp){
        if($app.exit -eq $true){
            $exitBuildsCount++
        }
    }

    Write-Host  $exitBuildsCount of $arrPropsApp.Count

    if($exitBuildsCount -eq $arrPropsApp.Count){
        Wait-Event -Timeout 2
        Write-Host -ForegroundColor Green Completed
        return
    }

    Wait-Event -Timeout 3
    clear
    StatusBuilds
}


$buttonOk.Add_Click($eventSubmit)

$objForm.Controls.Add($buttonOk)

$objForm.Add_Shown({$objForm.Activate()})
[void] $objForm.ShowDialog()



   
       