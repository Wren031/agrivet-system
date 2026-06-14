-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "agent_profile_id" TEXT;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_agent_profile_id_fkey" FOREIGN KEY ("agent_profile_id") REFERENCES "agent_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
