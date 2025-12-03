try {
  const pkg = require('tailwindcss/package.json');
  console.log('tailwindcss version:', pkg.version);
} catch (e) {
  // Tailwind removed: this script is now a no-op.
  console.log('Tailwind has been removed from this project.');
  console.log('Tailwind check skipped.');
}
