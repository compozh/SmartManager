docker build . -t itenterprise.azurecr.io/it/smartmanager
docker push  itenterprise.azurecr.io/it/smartmanager
helm delete  smartmanager
helm install smartmanager ./chart
Start-Sleep -s 10
kubectl get pods -l release=smartmanager
