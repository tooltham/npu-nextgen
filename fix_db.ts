import prisma from './src/lib/db';
async function main() {
  await prisma.courseModule.updateMany({
    data: { status: 'PUBLISHED' }
  });
  console.log("Updated modules to PUBLISHED");
}
main().catch(console.error);
