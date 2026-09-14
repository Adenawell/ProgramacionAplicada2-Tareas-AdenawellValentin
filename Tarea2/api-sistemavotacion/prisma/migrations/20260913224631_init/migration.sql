/*
  Warnings:

  - You are about to drop the column `texto` on the `Opcion` table. All the data in the column will be lost.
  - Added the required column `name` to the `Opcion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Opcion" DROP COLUMN "texto",
ADD COLUMN     "name" TEXT NOT NULL;
