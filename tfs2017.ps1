[void] [System.Reflection.Assembly]::LoadWithPartialName("System.Drawing") 
[void] [System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms")


$url = 'http://tfs2017:8080/tfs/DefaultCollection/'

$urlWebApps = 'WebApplications'



$objForm = New-Object System.Windows.Forms.Form
$objForm.Text = "Add Application to SP"
$objForm.Size = New-Object System.Drawing.Size(300,615)
$objForm.StartPosition = "CenterScreen"

$objForm.KeyPreview = $True
$objForm.Add_KeyDown({if ($_.KeyCode -eq "Enter") 

{$empID=$objTextBox1.Text;$sn=$objTextBox2.Text;$gn=$objTextBox3.Text;$email=$objTextBox4.Text;$title=$objDepartmentListbox.SelectedItem;
     $office=$objOfficeListbox.SelectedItem;$objForm.Close()}})
$objForm.Add_KeyDown({if ($_.KeyCode -eq "Escape") 
    {$objForm.Close()}})



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

 $eventSubmit = [System.EventHandler] {



       
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
            # Добавление GraphQL
			if($app -eq "GraphQL"){
				 $body = @{
                    definition = @{
                        id = 70
                    }
                   parameters = '{"pathToSP":'+$GlobalPath+',"system.debug":"false", "dir.projectName": "' + ($app) + '"}'# можно передавать просто имена, что обеспечит нам один билд, а не каждый под приложение
                }
                Invoke-RestMethod -Uri "$($url)/$($urlWebApps)/_apis/build/builds?api-version=3.1" -UseDefaultCredentials -Method Post -ContentType 'application/json' -body ($body | convertto-json -Compress -Depth 10)
				continue
			}
            
             # HealthSummary Api
            if($app -eq "HealthSummary + api"){
                $body = @{
                    definition = @{
                        id = 72
                    }
                    parameters = '{"pathToSP":'+$GlobalPath+',"system.debug":"false", "dir.projectName": "ProjectSummaryHealthApi"}'# можно передавать просто имена, что обеспечит нам один билд, а не каждый под приложение
                }
                Invoke-RestMethod -Uri "$($url)/$($urlWebApps)/_apis/build/builds?api-version=3.1" -UseDefaultCredentials -Method Post -ContentType 'application/json' -body ($body | convertto-json -Compress -Depth 10)
            
             # HealthSummary App
                $body = @{
                    definition = @{
                        id = 73
                    }
                    parameters = '{"pathToSP":'+$GlobalPath+',"system.debug":"false", "dir.projectName": "ProjectHealthSummary"}'# можно передавать просто имена, что обеспечит нам один билд, а не каждый под приложение
                }
                Invoke-RestMethod -Uri "$($url)/$($urlWebApps)/_apis/build/builds?api-version=3.1" -UseDefaultCredentials -Method Post -ContentType 'application/json' -body ($body | convertto-json -Compress -Depth 10)
                continue
            }


            # Добавление веб приложений
            $body = @{
                definition = @{
                    id = 69
                }
                parameters = '{"pathToSP":'+$GlobalPath+',"system.debug":"false", "dir.projectName": "' + ($app) + '"}'# можно передавать просто имена, что обеспечит нам один билд, а не каждый под приложение
            }
            Invoke-RestMethod -Uri "$($url)/$($urlWebApps)/_apis/build/builds?api-version=3.1" -UseDefaultCredentials -Method Post -ContentType 'application/json' -body ($body | convertto-json -Compress -Depth 10)
            
            $haveWebApps = $true
		
        }

       

        # Если были добавлены веб приложения, значит добавляем и веб конфиг
        if($haveWebApps -eq $false){
            return
        }
        
        # Дизейбл кнопки от повторного нажатия
        $buttonOk.Enabled = $false;

        # Пауза 3 Сек, чтобы добавление конфига не лезло впереди
        Wait-Event -Timeout 3
        $body = @{
            definition = @{
                id = 71
            }
            parameters = '{"pathToSP":'+$GlobalPath+',"system.debug":"false"}'# можно передавать просто имена, что обеспечит нам один билд, а не каждый под приложение
        }
        Invoke-RestMethod -Uri "$($url)/$($urlWebApps)/_apis/build/builds?api-version=3.1" -UseDefaultCredentials -Method Post -ContentType 'application/json' -body ($body | convertto-json -Compress -Depth 10)


    };


$buttonOk.Add_Click($eventSubmit)


$objForm.Controls.Add($buttonOk)



$objForm.Add_Shown({$objForm.Activate()})
[void] $objForm.ShowDialog()
