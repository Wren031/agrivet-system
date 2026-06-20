-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "admin_profile_id" TEXT;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_admin_profile_id_fkey" FOREIGN KEY ("admin_profile_id") REFERENCES "admin_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
