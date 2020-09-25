// NOTE: This file will show errors until you installed Prisma Client in your project.

import { PrismaClient, UserGetPayload } from "@prisma/client";

type UserWithPosts = UserGetPayload<{
  include: {
    posts: {
      select: { title: true };
    };
  };
}>;
const prisma = new PrismaClient();

async function main() {
  // const res  = await prisma.
  // await prisma.user.create({
  //   data: { email: "foo@bah.com" },
  // });
  await prisma.post.create({
    data: {
      title: `Hello World ${Date.now()}`,
      author: { connect: { id: 1 } },
    },
  });

  // const profile = await prisma.profile.create({
  //   data: { bio: "moo mah moomba", User: { connect: { id: 1 } } },
  // });
  // console.log(profile);
  //
  // Please either use `include` or `select`, but not both at the same time.
  const posts = await prisma.post.findMany({
    select: {
      title: true,
      /*User: true*/ author: {
        select: { name: true, profile: { select: { bio: true } } },
      },
    },
    where: { authorId: 1 },
    // include: { User: true },
    take: 3,
    skip: 1,
  });

  const users = await prisma.user.findMany({
    include: { posts: { select: { title: true } } },
  });
  const usersAndPosts: UserWithPosts[] = await prisma.user.findMany({
    include: { posts: { select: { title: true } } },
  });

  // console.log(usersAndPosts);
  console.log(JSON.stringify(usersAndPosts, null, 2));
  const sql = `
  SELECT MAX ("createdAt") AS "most-recent-post"
  FROM "public"."Post";
  `;

  const result = await prisma.queryRaw(sql);
  console.log(result[0]["most-recent-post"]);
  // await prisma.user.update({
  //   where: { email: "foo@bah.com" },
  //   data: { name: "boom" },
  // });

  const cat1 = await prisma.category.create({ data: { name: "foo" } });
  const cat2 = await prisma.category.create({ data: { name: "bah" } });

  await prisma.post.update({
    where: { id: 1 },
    data: { Category: { connect: [{ id: cat1.id }, { id: cat2.id }] } },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.disconnect());
