try {
  const pkg = require('tailwindcss/package.json');
  console.log('tailwindcss version:', pkg.version);
} catch (e) {
  console.error('tailwindcss not found:', e.message);
  process.exit(1);
}
