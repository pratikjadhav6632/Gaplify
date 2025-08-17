# Deployment Guide - SkillBridge AI

## Environment Variables Setup

### Frontend (Vercel) Environment Variables

Set these in your Vercel dashboard under Project Settings > Environment Variables:

```
VITE_API_URL=https://gaplify.onrender.com
NODE_ENV=production
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_FACEBOOK_PIXEL_ID=your_facebook_pixel_id
```

### Backend (Render) Environment Variables

Set these in your Render dashboard under your service > Environment:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

## CORS Configuration

The backend is configured to allow requests from:
- `https://skillbridge-ai.vercel.app`
- `https://skillbridge-ai-git-main.vercel.app`
- `https://skillbridge-ai-git-develop.vercel.app`
- `*.vercel.app` (any Vercel subdomain)
- `https://gaplify.in`
- `https://www.gaplify.in`

## Troubleshooting

### Login/Signup Issues

1. **Check Browser Console**: Look for CORS errors or network failures
2. **Verify API URL**: Ensure `VITE_API_URL` is set correctly in Vercel
3. **Check Backend Health**: Visit `https://gaplify.onrender.com` to ensure the server is running
4. **Environment Variables**: Verify all environment variables are set in both Vercel and Render

### Common Error Messages

- **"Network Error"**: Backend server is down or CORS issue
- **"Request timeout"**: Backend is slow to respond
- **"User not found"**: Email doesn't exist in database
- **"Invalid credentials"**: Wrong password

### Testing Steps

1. Test backend health: `curl https://gaplify.onrender.com`
2. Test CORS: Open browser dev tools and check for CORS errors
3. Test login with known credentials
4. Check server logs in Render dashboard

## Deployment Commands

### Frontend (Vercel)
```bash
cd client
npm run build
```

### Backend (Render)
```bash
cd server
npm install
npm start
```

## Monitoring

- Check Render logs for backend errors
- Monitor Vercel function logs for frontend issues
- Use browser dev tools to debug API calls
- Verify MongoDB connection in Render logs
