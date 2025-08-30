# Daily Notification Setup Guide

## Problem Analysis

Your daily reminder notifications aren't working due to several issues:

1. **Render Free Tier Limitations**: Render's free tier puts servers to sleep after 15 minutes of inactivity
2. **Missing Environment Variables**: OneSignal credentials may not be properly configured
3. **Conflicting Cron Systems**: Both server-side cron and GitHub Actions are trying to send notifications
4. **Server Sleep Issues**: When the server sleeps, cron jobs can't run

## Solution Steps

### 1. Environment Variables Setup

Add these environment variables to your Render dashboard:

```
ONE_SIGNAL_APP_ID=your_onesignal_app_id
ONE_SIGNAL_REST_API_KEY=your_onesignal_rest_api_key
CRON_SECRET_KEY=your_secret_key_for_cron_access
APP_PUBLIC_URL=https://www.gaplify.in
```

### 2. UptimeRobot Configuration

Set up UptimeRobot to ping your server every 5 minutes to keep it alive:

**Monitor Type**: HTTP(s)
**URL**: `https://gaplify.onrender.com/ping`
**Interval**: 5 minutes
**Timeout**: 30 seconds

### 3. Test the Setup

#### Test Server Health
```bash
curl https://gaplify.onrender.com/api/cron/health
```

#### Test Manual Notification
```bash
curl "https://gaplify.onrender.com/api/cron/trigger-notification?key=YOUR_CRON_SECRET_KEY"
```

### 4. Disable GitHub Actions (Optional)

Since you're using Render with uptime monitoring, you can disable the GitHub Actions workflow to avoid conflicts:

1. Go to your GitHub repository
2. Navigate to Settings > Actions > General
3. Disable "Allow all actions and reusable workflows"

Or comment out the workflow file:
```yaml
# name: Trigger Daily Notifications
# on:
#   schedule:
#     - cron: '30 2,5,7,9,14,16 * * *'
```

### 5. Alternative: Use GitHub Actions Only

If you prefer to keep using GitHub Actions instead of server-side cron:

1. Keep the GitHub Actions workflow enabled
2. Add the environment variables to GitHub Secrets:
   - `APP_URL`: `https://gaplify.onrender.com`
   - `CRON_SECRET_KEY`: Your secret key

3. Disable server-side cron by setting `DISABLE_SERVER_CRON=true` in Render environment variables

## Troubleshooting

### Check Logs
View your Render logs to see if notifications are being sent:
1. Go to Render Dashboard
2. Select your service
3. Click on "Logs" tab
4. Look for cron-related messages

### Common Issues

1. **"Missing OneSignal credentials"**
   - Check that `ONE_SIGNAL_APP_ID` and `ONE_SIGNAL_REST_API_KEY` are set in Render

2. **"Unauthorized" when testing notifications**
   - Verify `CRON_SECRET_KEY` is set correctly

3. **Server not responding**
   - Check if UptimeRobot is pinging the server regularly
   - Verify the `/ping` endpoint is working

4. **Notifications sent but not received**
   - Check OneSignal dashboard for delivery status
   - Verify users are subscribed to notifications
   - Check browser/app notification permissions

### Testing Commands

```bash
# Test server is alive
curl https://gaplify.onrender.com/ping

# Test health endpoint
curl https://gaplify.onrender.com/api/cron/health

# Test manual notification (replace YOUR_SECRET_KEY)
curl "https://gaplify.onrender.com/api/cron/trigger-notification?key=YOUR_SECRET_KEY"
```

## Monitoring

### UptimeRobot Setup
1. Create account at uptimerobot.com
2. Add new monitor:
   - Type: HTTP(s)
   - URL: `https://gaplify.onrender.com/ping`
   - Interval: 5 minutes
   - Timeout: 30 seconds
   - Alert when: Down

### Log Monitoring
Check Render logs regularly for:
- `[Cron] Daily reminder cron jobs scheduled successfully`
- `[OneSignal] Reminder sent successfully`
- Any error messages

## Expected Behavior

With proper setup, you should see:
1. Server stays alive (UptimeRobot shows "up")
2. Cron jobs trigger at scheduled times
3. Notifications are sent via OneSignal
4. Users receive push notifications

## Support

If issues persist:
1. Check Render logs for errors
2. Verify OneSignal credentials
3. Test manual notification endpoint
4. Ensure UptimeRobot is working
5. Check OneSignal dashboard for delivery status
