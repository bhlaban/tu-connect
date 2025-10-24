@description('Location for resources')
param location string

@description('SQL Server name')
param sqlServerName string

@description('SQL Database SKU')
param sqlDatabaseSku string

@description('SQL Database name')
param sqlDatabaseName string

@description('SQL Server administrator login')
param sqlAdminLogin string

@description('SQL Server administrator password')
@secure()
param sqlAdminPassword string

@description('App Service Plan name')
param appServicePlanName string

@description('App Service Plan SKU')
param appServicePlanSku string

@description('Backend App Service name')
param backendAppName string

@description('Frontend App Service name')
param frontendAppName string

@description('JWT secret for authentication')
@secure()
param jwtSecret string

@description('App Insights name')
param appInsightsName string

@description('Log Analytics workspace name')
param logAnalyticsWorkspaceName string

// SQL Server
resource sqlServer 'Microsoft.Sql/servers@2023-05-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: sqlAdminLogin
    administratorLoginPassword: sqlAdminPassword
    version: '12.0'
    publicNetworkAccess: 'Enabled'
  }

  // Firewall rule to allow Azure services
  resource allowAzureServices 'firewallRules@2023-05-01-preview' = {
    name: 'AllowAllWindowsAzureIps'
    properties: {
      startIpAddress: '0.0.0.0'
      endIpAddress: '0.0.0.0'
    }
  }
}

// SQL Database
resource sqlDatabase 'Microsoft.Sql/servers/databases@2023-05-01-preview' = {
  parent: sqlServer
  name: sqlDatabaseName
  location: location
  sku: {
    name: sqlDatabaseSku
    tier: sqlDatabaseSku == 'Basic' ? 'Basic' : 'Standard'
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
  }
}

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanSku
    capacity: 1
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// Backend App Service
resource backendApp 'Microsoft.Web/sites@2023-01-01' = {
  name: backendAppName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|18-lts'
      alwaysOn: appServicePlanSku != 'B1' ? true : false
      ftpsState: 'Disabled'
      httpLoggingEnabled: true
      logsDirectorySizeLimit: 35
      detailedErrorLoggingEnabled: true
      appCommandLine: 'node server.js'
      cors: {
        allowedOrigins: [
          'https://${frontendAppName}.azurewebsites.net'
        ]
        supportCredentials: false
      }
    }
    httpsOnly: true
    clientAffinityEnabled: false
  }
}

// Frontend App Service
resource frontendApp 'Microsoft.Web/sites@2023-01-01' = {
  name: frontendAppName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|18-lts'
      alwaysOn: appServicePlanSku != 'B1' ? true : false
      ftpsState: 'Disabled'
      httpLoggingEnabled: true
      logsDirectorySizeLimit: 35
      detailedErrorLoggingEnabled: true
      appSettings: [
        {
          name: 'REACT_APP_API_URL'
          value: 'https://${backendAppName}.azurewebsites.net/api'
        }
        {
          name: 'GENERATE_SOURCEMAP'
          value: 'false'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '18-lts'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'true'
        }
        {
          name: 'WEBSITE_COMPRESS_STATIC_FILES'
          value: 'true'
        }
        {
          name: 'WEBSITE_ENABLE_SYNC_UPDATE_SITE'
          value: 'true'
        }
      ]
    }
    httpsOnly: true
    clientAffinityEnabled: false
  }
}

// Log Analytics workspace
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsWorkspaceName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

// Application Insights for monitoring
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
}

// Add Application Insights instrumentation key to backend
resource backendAppInsightsConfig 'Microsoft.Web/sites/config@2023-01-01' = {
  parent: backendApp
  name: 'appsettings'
  properties: {
    APPINSIGHTS_INSTRUMENTATIONKEY: appInsights.properties.InstrumentationKey
    APPLICATIONINSIGHTS_CONNECTION_STRING: appInsights.properties.ConnectionString
    DB_SERVER: sqlServer.properties.fullyQualifiedDomainName
    DB_DATABASE: sqlDatabaseName
    DB_USER: sqlAdminLogin
    DB_PASSWORD: sqlAdminPassword
    DB_PORT: '1433'
    JWT_SECRET: jwtSecret
    NODE_ENV: 'production'
    PORT: '8080'
    WEBSITE_NODE_DEFAULT_VERSION: '18-lts'
    SCM_DO_BUILD_DURING_DEPLOYMENT: 'true'
  }
}

// Outputs
output sqlServerName string = sqlServer.name
output sqlServerFqdn string = sqlServer.properties.fullyQualifiedDomainName
output sqlDatabaseName string = sqlDatabase.name
output appServicePlanName string = appServicePlan.name
output backendAppName string = backendApp.name
output backendAppUrl string = 'https://${backendApp.properties.defaultHostName}'
output frontendAppName string = frontendApp.name
output frontendAppUrl string = 'https://${frontendApp.properties.defaultHostName}'
output logAnalyticsWorkspaceName string = logAnalyticsWorkspace.name
output appInsightsName string = appInsights.name
