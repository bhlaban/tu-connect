# Azure Deployment Guide

## Prerequisites

- Azure account with active subscription
- Azure CLI installed (optional)
- Git installed

## Step 1: Create Azure SQL Database

1. **Using Azure Portal:**
   - Navigate to "Create a resource" > "Databases" > "SQL Database"
   - Configure:
     - Database name: `tu-connect-db`
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
   - Database name: `tu-connect-db`
   - Admin username and password

## Step 2: Deploy Backend API (Azure App Service)

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



## Step 3: Deploy Frontend (Azure App Service)

#### Prerequisites
- Ensure your React app builds successfully locally
- Have your backend API URL ready (from Step 2)

#### 1. Environment Variables for React

**Important: Choose ONE approach based on where you build your app:**

**Option A: Building in GitHub Actions (Your Current Setup)**
- Environment variables are set in the workflow file
- No `.env.production` file needed
- No `REACT_APP_API_URL` in Application Settings needed

**Option B: Building on Azure App Service**
- Set `REACT_APP_API_URL` in Application Settings
- Azure reads these during the build process
- No `.env.production` file needed

#### 2. Build Configuration

Ensure your `frontend/package.json` has the build script:
```json
"scripts": {
  "build": "react-scripts build"
}
```

#### 2. Create Azure App Service for Frontend

1. **Create Web App:**
   - Navigate to "Create a resource" → "Web App"
   - Configuration:
     - **App name:** `tu-connect-frontend` (globally unique)
     - **Runtime stack:** Node.js 18 LTS
     - **Operating System:** Linux
     - **Region:** Same as your backend API
     - **App Service Plan:** Use existing or create new (B1 tier minimum)

2. **Configure Application Settings:**
   - Go to App Service → "Configuration" → "Application settings"
   - Add these settings:
     ```
     WEBSITE_NODE_DEFAULT_VERSION=18-lts
     SCM_DO_BUILD_DURING_DEPLOYMENT=true
     ```
   
   **Note:** If you're using GitHub Actions to build (like in your current setup), you don't need `REACT_APP_API_URL` in Application Settings since it's already set in the workflow.



#### 3. Configure Web Server for SPA

**Critical: Configure URL Rewriting for React Router**

Create `frontend/web.config` for proper SPA routing:
```xml
<?xml version="1.0"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
    </staticContent>
  </system.webServer>
</configuration>
```

**Alternative: Create startup script for Express server**
Create `frontend/server.js`:
```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Frontend server running on port ${port}`);
});
```

If using server.js approach, update `frontend/package.json`:
```json
{
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

#### 4. Deploy Frontend Code

**Method 1: Local Git Deployment**
```bash
# Navigate to frontend directory
cd frontend

# Initialize git if not already done
git init

# Add Azure remote
git remote add azure https://<deployment-username>@tu-connect-frontend.scm.azurewebsites.net/tu-connect-frontend.git

# Commit and push
git add .
git commit -m "Deploy frontend"
git push azure main
```

**Method 2: ZIP Deployment**
```bash
# Create deployment package
cd frontend
npm run build

# Create zip of entire project (not just build folder)
powershell Compress-Archive -Path * -DestinationPath deploy.zip -Force

# Deploy using Azure CLI
az webapp deployment source config-zip \
  --resource-group tu-connect-rg \
  --name tu-connect-frontend \
  --src deploy.zip
```

**Method 3: GitHub Actions (Recommended)**
Create `.github/workflows/frontend-deploy.yml`:
```yaml
name: Deploy Frontend to Azure App Service

on:
  push:
    branches: [ main ]
    paths: [ 'frontend/**' ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install and build
      run: |
        cd frontend
        npm ci
        npm run build
        
    - name: Deploy to Azure App Service
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'tu-connect-frontend'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: frontend
```

#### 5. Configure Startup Command

In Azure Portal:
1. Go to App Service → "Configuration" → "General settings"
2. **Startup Command:** 
   - If using web.config: Leave empty (IIS handles it)
   - If using server.js: `node server.js`
   - If serving build directly: `npx serve -s build -p $PORT`

#### 6. Enable Compression and Caching

Add to Application Settings:
```
WEBSITE_COMPRESS_STATIC_FILES=true
WEBSITE_ENABLE_SYNC_UPDATE_SITE=true
```

**Configure caching headers** by adding to `web.config`:
```xml
<staticContent>
  <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="31536000" />
</staticContent>
```

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
1. Go to App Service > "Custom domains"
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

**Common Problems and Solutions:**

1. **React Router not working (404 on refresh):**
   - Ensure `web.config` is properly configured for URL rewriting
   - Or use Express server with catch-all route
   - Verify startup command is correct

2. **API calls failing:**
   - Check `REACT_APP_API_URL` environment variable
   - Verify CORS settings on backend
   - Check browser network tab for actual URLs being called
   - Test API endpoints directly: `curl https://tu-connect-api.azurewebsites.net/api/auth/me`

3. **Build/Deployment Issues:**
   - Ensure `npm run build` works locally
   - Check deployment logs in Azure Portal (Deployment Center → Logs)
   - Verify Node.js version compatibility
   - Clear build cache: `rm -rf node_modules package-lock.json && npm install`

4. **Environment Variables not loading:**
   - React environment variables must start with `REACT_APP_`
   - Restart App Service after adding environment variables
   - Check that variables are set in Application Settings, not Connection Strings

5. **Static files not loading:**
   - Verify build folder structure is correct
   - Check that static files are in correct paths
   - Ensure MIME types are configured properly

**Debugging Steps:**
- Check deployment logs in Azure Portal: App Service → Deployment Center → Logs
- Test if app is responding: Visit `https://tu-connect-frontend.azurewebsites.net` in browser
- Check environment variables in Azure Portal: App Service → Configuration → Application settings

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
