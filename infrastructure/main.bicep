targetScope = 'subscription'

@description('The location for all resources')
param location string

@description('Environment name (dev, staging, prod)')
@allowed(['dev', 'staging', 'prod'])
param environment string

@description('The name prefix for all resources')
param appName string

@description('App Service Plan SKU')
@allowed(['B1', 'S1', 'P1v2', 'P2v2'])
param appServicePlanSku string

@description('SQL Database SKU')
@allowed(['Basic', 'S0', 'S1', 'S2'])
param sqlDatabaseSku string

@description('SQL Server administrator login')
param sqlAdminLogin string

@description('SQL Server administrator password')
@secure()
param sqlAdminPassword string

@description('JWT secret for authentication')
@secure()
param jwtSecret string

// Variables
var resourceNamePrefix = '${appName}-${environment}'
var resourceGroupName = '${resourceNamePrefix}-rg'
var sqlServerName = '${resourceNamePrefix}-sql'
var sqlDatabaseName = '${appName}-db'
var appServicePlanName = '${resourceNamePrefix}-plan'
var backendAppName = '${resourceNamePrefix}-backend'
var frontendAppName = '${resourceNamePrefix}-frontend'
var appInsightsName = '${resourceNamePrefix}-insights'
var logAnalyticsWorkspaceName = '${resourceNamePrefix}-logs'

// Resource Group
resource resourceGroup 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: resourceGroupName
  location: location
}

// Deploy resources to the resource group using a module
module resources './resources.bicep' = {

  scope: resourceGroup
  name: 'deploy-resources'
  params: {
    location: location
    sqlServerName: sqlServerName
    sqlDatabaseName: sqlDatabaseName
    sqlDatabaseSku: sqlDatabaseSku
    sqlAdminLogin: sqlAdminLogin
    sqlAdminPassword: sqlAdminPassword
    appServicePlanName: appServicePlanName
    appServicePlanSku: appServicePlanSku
    backendAppName: backendAppName
    frontendAppName: frontendAppName
    jwtSecret: jwtSecret
    appInsightsName: appInsightsName
    logAnalyticsWorkspaceName: logAnalyticsWorkspaceName
  }
}

// Outputs
output resourceGroupName string = resourceGroup.name
output sqlServerName string = resources.outputs.sqlServerName
output sqlServerFqdn string = resources.outputs.sqlServerFqdn
output sqlDatabaseName string = resources.outputs.sqlDatabaseName
output backendAppName string = resources.outputs.backendAppName
output backendAppUrl string = resources.outputs.backendAppUrl
output frontendAppName string = resources.outputs.frontendAppName
output frontendAppUrl string = resources.outputs.frontendAppUrl
output appServicePlanName string = resources.outputs.appServicePlanName
output appInsightsName string = resources.outputs.appInsightsName
output logAnalyticsWorkspaceName string = resources.outputs.logAnalyticsWorkspaceName
