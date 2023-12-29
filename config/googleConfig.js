const { SHEET_ID, SERVICE_KEY_ID, SERVICE_KEY } = process.env;

module.exports = {
  googleSheetId: SHEET_ID,
  serviceAccountKey: {
    type: 'service_account',
    project_id: 'restowaves',
    private_key_id: SERVICE_KEY_ID,
    private_key: SERVICE_KEY.split(String.raw`\n`).join('\n'),
    client_email: 'ro300979koa@restowaves.iam.gserviceaccount.com',
    client_id: '106711100168522986249',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/ro300979koa%40restowaves.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com',
  },
};
