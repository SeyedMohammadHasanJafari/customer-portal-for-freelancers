import { ensureDemoData } from "../src/lib/demo-seed";

async function main() {
  console.log("Seeding database with demo data for Lumina Portal...");
  const user = await ensureDemoData();
  console.log("Demo user seeded successfully:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
