-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "agent_profiles" ADD COLUMN     "status" "AgentStatus" NOT NULL DEFAULT 'PENDING';
