# HTTPS Setup for React App

This React application is configured to run with HTTPS in development using ASP.NET Core development certificates.

## How it works

1. **Certificate Generation**: The `aspnetcore-https.js` script generates HTTPS certificates using the .NET dev-certs tool
2. **Environment Configuration**: The `aspnetcore-react.js` script creates a `.env.development.local` file with certificate paths
3. **Vite Configuration**: The `vite.config.js` file is configured to use these certificates for HTTPS

## Running with HTTPS

To start the development server with HTTPS:

```bash
npm start
```

This will:

1. Run the prestart script to ensure certificates are generated
2. Start Vite with HTTPS enabled on port 44334
3. Your app will be available at: https://localhost:44334/

## Certificate Management

- Certificates are automatically generated and trusted on first run
- Certificates are stored in: `~/.aspnet/https/` (macOS/Linux) or `%APPDATA%/ASP.NET/https` (Windows)
- To regenerate certificates, delete the existing ones and run `npm run prestart`

## Environment Variables

The following environment variables are automatically set in `.env.development.local`:

- `SSL_CRT_FILE`: Path to the certificate file
- `SSL_KEY_FILE`: Path to the private key file

## Troubleshooting

If you encounter certificate issues:

1. Run `dotnet dev-certs https --clean` to remove existing certificates
2. Run `dotnet dev-certs https --trust` to generate and trust new certificates
3. Run `npm run prestart` to regenerate the application-specific certificates

