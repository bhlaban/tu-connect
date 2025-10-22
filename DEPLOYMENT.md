# Azure Deployment Guide

## Prerequisites

- Azure account with active subscription
- Azure CLI installed (optional)
- Git installed

## Step 1: Create Azure SQL Database

1. **Using Azure Portal:**
   - Navigate to "Create a resource" > "Databases" > "SQL Database"
   - Configure:
     - Database name: `tu-connect`
     - Server: Create new or use existing
     - Compute + storage: Choose appropriate tier (Basic or Standard for development)
     - Backup storage redundancy: Locally-redundant

2. **Configure Firewall:**
   - Go to your SQL Server > "Security" > "Networking"
   - Add your client IP address
   - Enable "Allow Azure services and resources to access this server"

3. **Create Database Schema:**
   - Connect using Azure Data Studio or SSMS
   - Run the script from `database/schema.sql`

4. **Note Connection Details:**
   - Server name: `<your-server-name>.database.windows.net`
   - Database name: `tu-connect`
   - Admin username and password

## Step 2: Deploy Backend API (Azure App Service)

### Option A: Using Azure Portal

1. **Create Web App:**
   - Navigate to "Create a resource" > "Web App"
   - Configure:
     - Name: `tu-connect-api` (must be globally unique)
     - Runtime: Node.js 18 LTS
     - Operating System: Linux
     - Region: Choose nearest to your users

2. **Configure Environment Variables:**
   - Go to your App Service > "Configuration" > "Application settings"
   - Add the following:
     ```
     DB_SERVER=<your-server-name>.database.windows.net
     DB_DATABASE=tu-connect
     DB_USER=<your-username>
     DB_PASSWORD=<your-password>
     DB_PORT=1433
     JWT_SECRET=<your-secure-secret-key-minimum-32-characters>
     PORT=8080
     NODE_ENV=production
     ```

3. **Deploy Code:**
   - Using Local Git:
     ```bash
     git remote add azure https://<deployment-username>@<app-name>.scm.azurewebsites.net/<app-name>.git
     git push azure main
     ```
   - Or use GitHub Actions, Azure DevOps, or FTP

4. **Configure Startup Command:**
   - Go to "Configuration" > "General settings"
   - Startup Command: `cd backend && node server.js`

### Option B: Using Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create --name tu-connect-rg --location eastus

# Create App Service plan
az appservice plan create --name tu-connect-plan --resource-group tu-connect-rg --sku B1 --is-linux

# Create Web App
az webapp create --resource-group tu-connect-rg --plan tu-connect-plan --name tu-connect-api --runtime "NODE:18-lts"

# Configure app settings
az webapp config appsettings set --resource-group tu-connect-rg --name tu-connect-api --settings \
  DB_SERVER=<your-server-name>.database.windows.net \
  DB_DATABASE=tu-connect \
  DB_USER=<your-username> \
  DB_PASSWORD=<your-password> \
  DB_PORT=1433 \
  JWT_SECRET=<your-secure-secret> \
  NODE_ENV=production

# Deploy code
az webapp up --name tu-connect-api --resource-group tu-connect-rg
```

## Step 3: Deploy Frontend (Azure Static Web Apps)

### Option A: Using Azure Portal with GitHub

1. **Create Static Web App:**
   - Navigate to "Create a resource" > "Static Web App"
   - Configure:
     - Name: `tu-connect-frontend`
     - Sign in with GitHub
     - Select your repository and branch
     - Build Presets: React
     - App location: `/frontend`
     - Api location: (leave empty)
     - Output location: `build`

2. **Configure Environment Variables:**
   - Go to your Static Web App > "Configuration"
   - Add:
     ```
     REACT_APP_API_URL=https://tu-connect-api.azurewebsites.net/api
     ```

3. **Deploy:**
   - GitHub Actions workflow is automatically created
   - Push to your repository triggers automatic deployment

### Option B: Using Azure App Service for Frontend

1. **Build React App:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create Web App:**
   ```bash
   az webapp create --resource-group tu-connect-rg --plan tu-connect-plan --name tu-connect-frontend --runtime "NODE:18-lts"
   ```

3. **Deploy Build:**
   ```bash
   cd build
   zip -r build.zip .
   az webapp deployment source config-zip --resource-group tu-connect-rg --name tu-connect-frontend --src build.zip
   ```

4. **Configure:**
   - Add `REACT_APP_API_URL` environment variable
   - Configure web server to serve index.html for all routes

## Step 4: Configure CORS

1. **In Backend App Service:**
   - Go to "CORS" settings
   - Add your frontend URL:
     - `https://tu-connect-frontend.azurewebsites.net`
     - `https://<your-custom-domain>` (if applicable)
   - For development, you can add `http://localhost:3000`

## Step 5: Custom Domain (Optional)

### Backend API
1. Go to App Service > "Custom domains"
2. Add custom domain (e.g., `api.tuconnect.com`)
3. Configure DNS records as instructed

### Frontend
1. Go to Static Web App > "Custom domains"
2. Add custom domain (e.g., `tuconnect.com`)
3. Configure DNS records as instructed

## Step 6: Enable HTTPS/SSL

- Azure automatically provides free SSL certificates
- All traffic is encrypted by default
- Custom domains can use managed certificates or bring your own

## Monitoring and Logging

1. **Application Insights:**
   - Enable in App Service settings
   - Monitor performance, errors, and usage

2. **Log Stream:**
   - View real-time logs in Azure Portal
   - Go to App Service > "Log stream"

3. **Diagnostics:**
   - Enable diagnostic logging
   - Store logs in Storage Account or Log Analytics

## Cost Optimization

- **Development:**
  - App Service: Basic (B1) tier
  - SQL Database: Basic tier
  - Static Web Apps: Free tier

- **Production:**
  - App Service: Standard (S1) or Premium
  - SQL Database: Standard (S0-S3) based on load
  - Enable autoscaling as needed

## Backup and Disaster Recovery

1. **Database Backups:**
   - Azure SQL automatically backs up databases
   - Configure retention period and geo-redundancy

2. **App Service Backups:**
   - Configure scheduled backups
   - Store in Azure Storage

## Security Best Practices

1. **Network Security:**
   - Configure Virtual Network integration
   - Use Private Endpoints for database connections
   - Enable DDoS protection

2. **Authentication:**
   - Use Azure Key Vault for secrets
   - Rotate JWT secrets regularly
   - Implement rate limiting

3. **Database Security:**
   - Use strong admin passwords
   - Enable Transparent Data Encryption (TDE)
   - Configure audit logging
   - Regular security patches

## Troubleshooting

### Backend Issues
- Check Application Insights logs
- Verify environment variables
- Test database connectivity
- Check CORS settings

### Frontend Issues
- Verify API URL in environment variables
- Check browser console for errors
- Ensure CORS is configured correctly
- Test API endpoints directly

### Database Issues
- Verify firewall rules
- Check connection strings
- Monitor DTU usage
- Review query performance

## Maintenance

1. **Regular Updates:**
   - Update Node.js dependencies
   - Update React packages
   - Apply Azure SQL patches

2. **Monitoring:**
   - Set up alerts for errors and performance
   - Review logs regularly
   - Monitor costs

3. **Scaling:**
   - Monitor resource usage
   - Scale up/out as needed
   - Optimize queries for performance
