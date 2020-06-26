// model migration {
//   applied            Int
//   database_migration String
//   datamodel          String
//   datamodel_steps    String
//   errors             String
//   finished_at        DateTime?
//   name               String
//   revision           Int       @default(autoincrement()) @id
//   rolled_back        Int
//   started_at         DateTime
//   status             String

//   @@map("_migration")
// }

// model userfollows {
//   A String
//   B String

//   @@index([B], name: "_UserFollows_B_index")
//   @@map("_userfollows")
//   @@unique([A, B], name: "_UserFollows_AB_unique")
// }

// model comment {
//   Comment String
//   Email   String?
//   id      String  @id @default(cuid())
//   Postid  String?
//   users   users?  @relation(fields: [Email], references: [Email])
//   @@index([Email], name: "Email")

// }
//  model likes {
//     Email  String? 
//    Postid String @id
//    post   posts @relation(fields:[Postid], references:[id])
//    users      users?    @relation(fields: [Email], references: [Email])
//    @@unique([Email,Postid])
//  }

// model posts {
//   Author     String?
//   Avatar     String?
//   Content    String?
//   Created_at DateTime? @default(now())
//   Email      String?
//   id         String    @id @default(cuid())
//   PostLike   Int?
//   Title      String?
//   users      users?    @relation(fields: [Email], references: [Email])
//   Likes      likes[]

//   @@index([Email], name: "Email")
// }

// model profile {
//   About      String?
//   Email      String  @id
//   Hobbies    String?
//   Name       String?
//   Occupation String?
//   Skills     String?
// }

// model todo {
//   Content String?
//   Email   String?
//   id      String  @id @default(cuid())
//   Task    String?
//   users   users?  @relation(fields: [Email], references: [Email])
//   @@index([Email], name: "Email")
// }

// model users {
//   Avatar    String?
//   Email     String    @id
//   Name      String?
//   followedBy  users[]   @relation("UserFollows", references: [Email])
//   following   users[]   @relation("UserFollows", references: [Email])
//   Password  String?
//   Password2 String?
//   comment   comment[]
//   posts      posts[]
//   todo       todo[]
//   Likes      likes[]
// }

// # Environment variables declared in this file are automatically made available to Prisma.
// # See the documentation for more detail: https://pris.ly/d/prisma-schema#using-environment-variables

// # Prisma supports the native connection string format for PostgreSQL, MySQL and SQLite.
// # See the documentation for all the connection string options: https://pris.ly/d/connection-strings

// DATABASE_URL=postgres://dmrnpuvhcfvexy:45013b152e7b2eb574e3c76d6d83814d918e7a93f512b339aa1bbed320332e54@ec2-52-20-248-222.compute-1.amazonaws.com:5432/d834giik74dahn