-- Rename id_image_url to id_verification_url
ALTER TABLE "agent_profiles" RENAME COLUMN "id_image_url" TO "id_verification_url";

-- Drop address column
ALTER TABLE "agent_profiles" DROP COLUMN "address";
