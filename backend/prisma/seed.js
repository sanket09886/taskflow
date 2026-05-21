import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const addDays = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

async function main() {
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const [adminPassword, alicePassword, bobPassword] = await Promise.all([
    bcrypt.hash("Admin@123", 10),
    bcrypt.hash("Alice@123", 10),
    bcrypt.hash("Bob@123", 10)
  ]);

  const admin = await prisma.user.create({ data: { name: "TaskFlow Admin", email: "admin@taskflow.com", password: adminPassword, role: "ADMIN" } });
  const alice = await prisma.user.create({ data: { name: "Alice Johnson", email: "alice@taskflow.com", password: alicePassword, role: "MEMBER" } });
  const bob = await prisma.user.create({ data: { name: "Bob Smith", email: "bob@taskflow.com", password: bobPassword, role: "MEMBER" } });

  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: "Website Redesign",
        description: "Refresh the marketing website with a cleaner information architecture and modern visuals.",
        deadline: addDays(30),
        members: { create: [{ userId: admin.id, role: "ADMIN" }, { userId: alice.id, role: "MEMBER" }, { userId: bob.id, role: "MEMBER" }] }
      }
    }),
    prisma.project.create({
      data: {
        name: "Mobile App Launch",
        description: "Coordinate release tasks for the first TaskFlow mobile app launch.",
        deadline: addDays(60),
        members: { create: [{ userId: admin.id, role: "ADMIN" }, { userId: alice.id, role: "MEMBER" }, { userId: bob.id, role: "MEMBER" }] }
      }
    })
  ]);

  const statuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
  const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
  const titles = {
    "Website Redesign": ["Map current pages", "Build landing wireframe", "Review component library", "Ship homepage polish"],
    "Mobile App Launch": ["Finalize beta checklist", "Connect push notifications", "Run QA pass", "Prepare launch notes"]
  };

  for (const project of projects) {
    for (let index = 0; index < statuses.length; index += 1) {
      await prisma.task.create({
        data: {
          title: titles[project.name][index],
          description: `${titles[project.name][index]} for ${project.name}.`,
          status: statuses[index],
          priority: priorities[index],
          dueDate: addDays(5 + index * 4),
          projectId: project.id,
          assigneeId: index % 2 === 0 ? alice.id : bob.id,
          createdById: admin.id
        }
      });
    }
  }

  console.log("Seed complete: admin@taskflow.com / Admin@123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
