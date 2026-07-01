-- Drop branch_orders table and related references
ALTER TABLE IF EXISTS "order_items" DROP CONSTRAINT IF EXISTS "order_items_branch_order_id_fkey";
DROP TABLE IF EXISTS "branch_orders";

-- Create cart_items table
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL,
    "branch_profile_id" TEXT NOT NULL,
    "inventory_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_CHECKOUT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- Add foreign keys
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_branch_profile_id_fkey" FOREIGN KEY ("branch_profile_id") REFERENCES "branch_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indexes
CREATE INDEX "cart_items_branch_profile_id_idx" ON "cart_items"("branch_profile_id");
CREATE INDEX "cart_items_inventory_id_idx" ON "cart_items"("inventory_id");
