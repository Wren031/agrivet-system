-- CreateTable
CREATE TABLE "inventory" (
    "id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "cost_price" DECIMAL(10,2) NOT NULL,
    "selling_price" DECIMAL(10,2) NOT NULL,
    "stock_level" INTEGER NOT NULL,
    "reorder_point" INTEGER NOT NULL,
    "expiry_date" TIMESTAMP(3),
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "category_id" TEXT,
    "subcategory_id" TEXT,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "sub_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
