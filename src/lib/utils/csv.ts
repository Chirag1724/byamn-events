interface RegistrationEntry {
  name: string;
  email: string;
}

function escapeCSVField(field: string): string {
  // If the field contains a comma, double-quote, or newline, wrap in double-quotes
  // and escape internal double-quotes by doubling them (RFC 4180)
  if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function generateCSV(registrations: Array<RegistrationEntry>): string {
  const header = 'Name,Email';

  const rows = registrations.map(
    (r) => `${escapeCSVField(r.name)},${escapeCSVField(r.email)}`
  );

  return [header, ...rows].join('\r\n');
}
