-- CreateEnum
CREATE TYPE "RequirementCategory" AS ENUM ('Functional', 'Non-functional', 'Security', 'Performance', 'AI', 'Data', 'Infrastructure', 'Business');

-- CreateEnum
CREATE TYPE "RequirementPriority" AS ENUM ('Low', 'Medium', 'High', 'Critical');

-- CreateEnum
CREATE TYPE "RequirementStatus" AS ENUM ('draft', 'confirmed');

-- CreateEnum
CREATE TYPE "ClarificationStatus" AS ENUM ('pending', 'answered', 'converted');

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "target_users" TEXT,
    "goal" TEXT,
    "constraints" TEXT,
    "tech" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "scale" TEXT,
    "budget" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requirement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "RequirementCategory" NOT NULL,
    "priority" "RequirementPriority" NOT NULL DEFAULT 'Medium',
    "constraints" TEXT,
    "assumptions" TEXT,
    "status" "RequirementStatus" NOT NULL DEFAULT 'draft',
    "project_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clarification" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "ambiguity" TEXT,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "answer" TEXT,
    "category" "RequirementCategory",
    "status" "ClarificationStatus" NOT NULL DEFAULT 'pending',
    "requirement_id" TEXT,
    "project_id" TEXT NOT NULL,
    "converted_req_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clarification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_user_id_idx" ON "project"("user_id");

-- CreateIndex
CREATE INDEX "requirement_project_id_idx" ON "requirement"("project_id");

-- CreateIndex
CREATE INDEX "requirement_category_idx" ON "requirement"("category");

-- CreateIndex
CREATE INDEX "clarification_project_id_idx" ON "clarification"("project_id");

-- CreateIndex
CREATE INDEX "clarification_requirement_id_idx" ON "clarification"("requirement_id");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirement" ADD CONSTRAINT "requirement_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clarification" ADD CONSTRAINT "clarification_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "requirement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clarification" ADD CONSTRAINT "clarification_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
