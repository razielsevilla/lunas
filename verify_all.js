const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.professionalProfile.updateMany({
    where: { prcStatus: 'PENDING' },
    data: { prcStatus: 'VERIFIED' },
  });
  console.log(`Successfully verified ${result.count} existing professionals for the demo.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
