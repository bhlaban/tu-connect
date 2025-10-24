# Azure Infrastructure Deployment Script for TU Connect
# Usage: .\deploy.ps1 [environment] [resource-group-name]

param(
    [string]$Environment = "dev",
    [string]$ResourceGroup = "tu-connect-$Environment-rg",
    [string]$Location = "North Central US"
)

Write-Host "🚀 Deploying TU Connect infrastructure..." -ForegroundColor Green
Write-Host "Environment: $Environment" -ForegroundColor Cyan
Write-Host "Resource Group: $ResourceGroup" -ForegroundColor Cyan
Write-Host "Location: $Location" -ForegroundColor Cyan

# Check if Azure CLI is installed
try {
    az --version | Out-Null
} catch {
    Write-Host "❌ Azure CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check if user is logged in
try {
    az account show | Out-Null
} catch {
    Write-Host "🔐 Please log in to Azure first:" -ForegroundColor Yellow
    az login
}

# Deploy Bicep template at subscription level (creates resource group automatically)
Write-Host "🏗️  Deploying infrastructure..." -ForegroundColor Blue
$deploymentResult = az deployment sub create `
    --location $Location `
    --template-file "main.bicep" `
    --parameters "@main.$Environment.parameters.json" `
    --output json | ConvertFrom-Json

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
    
    # Display outputs
    Write-Host "📋 Deployment Details:" -ForegroundColor Yellow
    $deploymentResult.properties.outputs.PSObject.Properties | ForEach-Object {
        Write-Host "$($_.Name): $($_.Value.value)" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "🎉 Next Steps:" -ForegroundColor Green
    Write-Host "1. Update your GitHub secrets with the deployment details" -ForegroundColor White
    Write-Host "2. Run the database schema script against the SQL database" -ForegroundColor White
    Write-Host "3. Push your code to trigger the GitHub Actions deployment" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Useful commands:" -ForegroundColor Yellow
    Write-Host "- View resources: az resource list --resource-group $ResourceGroup --output table" -ForegroundColor White
    Write-Host "- Delete everything: az group delete --name $ResourceGroup --yes --no-wait" -ForegroundColor White
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}