# OAuth Authentication Setup Guide

This guide will help you set up OAuth authentication for Google, GitHub, and LinkedIn in your application.

## Required Environment Variables

Add these environment variables to your backend `.env` file:

```env
# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# API URL (for OAuth callbacks)
API_URL=http://localhost:5000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

## OAuth Provider Setup

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `https://yourdomain.com/api/auth/google/callback` (for production)
7. Copy Client ID and Client Secret to your `.env` file

### 2. GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in application details:
   - Application name: Your App Name
   - Homepage URL: Your app URL
   - Authorization callback URL: `http://localhost:5000/api/auth/github/callback`
4. Click "Register application"
5. Copy Client ID and Client Secret to your `.env` file

### 3. LinkedIn OAuth Setup

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app
3. Go to "Auth" tab
4. Add redirect URLs:
   - `http://localhost:5000/api/auth/linkedin/callback`
   - `https://yourdomain.com/api/auth/linkedin/callback` (for production)
5. Request access to required scopes: `r_liteprofile` and `r_emailaddress`
6. Copy Client ID and Client Secret to your `.env` file

## Frontend Configuration

Update your frontend `.env` file with the API URL:

```env
VITE_API_URL=http://localhost:5000
```

## How OAuth Works

1. **User clicks OAuth button** (Google, GitHub, or LinkedIn)
2. **Popup window opens** with the provider's authentication page
3. **User authorizes** the application
4. **Provider redirects back** to our callback endpoint
5. **Backend creates/finds user** and generates JWT token
6. **Popup closes** and token is stored in localStorage
7. **User is logged in** and redirected to appropriate dashboard

## User Data Extraction

The following user data is automatically extracted and stored:

- **Name**: From user's profile
- **Email**: From user's verified email
- **Avatar**: Profile picture URL
- **Provider**: Which OAuth provider was used
- **Provider ID**: Unique ID from the provider

## Security Features

- **Password not required** for OAuth users
- **OAuth user protection** - OAuth users cannot login with passwords
- **Duplicate email protection** - existing users can link their OAuth accounts
- **JWT tokens** for secure session management
- **Provider-specific validation**
- **Automatic user creation** with default 'member' role

## Database Schema Changes

The User model now includes:
- `provider`: OAuth provider type ('google', 'github', 'linkedin')
- `providerId`: Unique identifier from the provider
- `password`: Optional for OAuth users (not required)

## Testing

1. Start your backend server: `npm run dev` (in backend folder)
2. Start your frontend server: `npm run dev` (in my-project folder)
3. **Without OAuth configured**: The app will work normally, and OAuth buttons will show "not configured" messages
4. **With OAuth configured**: Try logging in with any OAuth provider
5. Check the database to see new user records
6. Verify token storage in browser's localStorage

## Smart Configuration

The OAuth system is designed to be **optional and non-breaking**:
- ✅ **App works without OAuth credentials** - No server crashes
- ✅ **Graceful error handling** - Clear messages when OAuth is not configured
- ✅ **Conditional loading** - Only loads strategies when credentials are available
- ✅ **Frontend error feedback** - Users see helpful messages instead of broken functionality

## Troubleshooting

### Common Issues:

1. **"Invalid credentials" error**: OAuth users don't have passwords, so regular login won't work
2. **Callback URL mismatch**: Ensure redirect URLs match exactly in OAuth provider settings
3. **CORS errors**: Check that your API URL is properly configured
4. **Popup blocked**: Ensure popups are allowed for your domain

### Debug Steps:

1. Check browser console for errors
2. Verify all environment variables are set
3. Test OAuth endpoints directly in browser
4. Check server logs for authentication flow

## Production Deployment

1. Update API_URL in backend `.env` to your production domain
2. Update redirect URLs in all OAuth provider settings
3. Use HTTPS for all callbacks (required by most OAuth providers)
4. Set secure environment variables in your hosting platform
5. Test the complete flow in production environment