const required = [
  'DATABASE_URL',
  'JWT_SECRET',
  'CORS_ORIGIN',
  'CRM_ADMIN_EMAIL',
  'CRM_ADMIN_PASSWORD',
  'CRM_N8N_API_KEY',
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error('Faltan variables obligatorias:', missing.join(', '));
  process.exit(1);
}
console.log('Variables backend OK');
