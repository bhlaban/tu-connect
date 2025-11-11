#!/bin/bash

# TU Connect Azure Deployment Script

set -e

# Configuration
RESOURCE_GROUP="tuconnect-rg"
LOCATION="eastus"
ENVIRONMENT="dev"
SQL_ADMIN="sqladmin"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "Azure CLI is not installed. Please install it first."
    exit 1
fi

# Login to Azure (if not already logged in)
echo "Checking Azure login..."
az account show &> /dev/null || az login

# Create resource group
echo "Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Generate SQL password
SQL_PASSWORD=$(openssl rand -base64 32)
echo "Generated SQL password (save this securely!): $SQL_PASSWORD"

# Deploy infrastructure
echo "Deploying Azure infrastructure..."
az deployment group create \
  --resource-group $RESOURCE_GROUP \
  --template-file azure-resources.bicep \
  --parameters environment=$ENVIRONMENT \
               sqlAdminLogin=$SQL_ADMIN \
               sqlAdminPassword=$SQL_PASSWORD

# Get deployment outputs
echo "Getting deployment outputs..."
API_URL=$(az deployment group show \
  --resource-group $RESOURCE_GROUP \
  --name azure-resources \
  --query properties.outputs.apiAppUrl.value \
  --output tsv)

SQL_SERVER=$(az deployment group show \
  --resource-group $RESOURCE_GROUP \
  --name azure-resources \
  --query properties.outputs.sqlServerFqdn.value \
  --output tsv)

echo "Deployment complete!"
echo "API URL: $API_URL"
echo "SQL Server: $SQL_SERVER"
echo "SQL Admin: $SQL_ADMIN"
echo "SQL Password: $SQL_PASSWORD"
echo ""
echo "Next steps:"
echo "1. Deploy the database schema using DACPAC or EF Core migrations"
echo "2. Deploy the API application to the App Service"
echo "3. Configure feature flags in App Configuration"
echo "4. Test the API endpoints"
