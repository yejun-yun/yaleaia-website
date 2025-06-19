# Deployment Guide for yaleaia.org

## Backend Deployment

### Option 1: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project → Deploy from GitHub
4. Select your repository
5. Set environment variables:
   ```
   OPENAI_API_KEY=your_openai_key_here
   ANTHROPIC_API_KEY=your_anthropic_key_here
   FIREBASE_SERVICE_ACCOUNT_KEY_JSON={"type":"service_account","project_id":"your-project-id",...}
   ```
6. Deploy and get your URL (e.g., `https://your-app.railway.app`)

### Option 2: Render
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Build command: `npm install`
5. Start command: `npm run dev`
6. Add same environment variables as above

## Frontend Deployment

### Cloudflare Pages (Recommended for your domain)
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Pages → Create a project
3. Connect GitHub repository
4. Build settings:
   - Framework preset: `Create React App`
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Build output directory: `build`
5. Environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```
6. Deploy

### Alternative: Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Set root directory to `frontend`
4. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

## Domain Configuration

### Frontend (yaleaia.org)
1. In Cloudflare DNS:
   - Type: `CNAME`
   - Name: `@` (or leave empty)
   - Target: `your-cloudflare-pages-url.pages.dev`

### Backend (api.yaleaia.org)
1. In Cloudflare DNS:
   - Type: `CNAME`
   - Name: `api`
   - Target: `your-backend-url.com`

## Environment Variables Checklist

### Backend (.env)
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
FIREBASE_SERVICE_ACCOUNT_KEY_JSON={"type":"service_account",...}
```

### Frontend (.env.local)
```
REACT_APP_API_URL=https://api.yaleaia.org
```

## Testing After Deployment

1. Test backend: `curl https://api.yaleaia.org/test`
2. Test frontend: Visit `https://yaleaia.org`
3. Test chat: Navigate to `/chat` and try logging in

## Troubleshooting

### Common Issues:
- **CORS errors**: Make sure backend allows requests from your frontend domain
- **Authentication errors**: Verify Firebase configuration
- **API not found**: Check that REACT_APP_API_URL is correct
- **Build failures**: Ensure all dependencies are in package.json

### Backend CORS Configuration
Make sure your backend allows requests from your domain:
```javascript
app.use(cors({
  origin: ['https://yaleaia.org', 'http://localhost:3000']
}));
``` 