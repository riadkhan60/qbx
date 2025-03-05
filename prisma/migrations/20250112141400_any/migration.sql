-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkID" TEXT NOT NULL DEFAULT '',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
