-- CreateTable
CREATE TABLE "Prepay" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prepay_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Prepay" ADD CONSTRAINT "Prepay_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prepay" ADD CONSTRAINT "Prepay_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "EventMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
