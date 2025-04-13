import GeneralSettingForm from "@/app/components/settings/generalSettingForm";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function GeneralSetting() {
  try {
    const general = await prisma.generalSetting.findMany();

    return (
      <div>
        <GeneralSettingForm general={general} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching General Settings:", error);
    return <div>Something went wrong!</div>;
  }
}