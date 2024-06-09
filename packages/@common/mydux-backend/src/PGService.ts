import mongoose from "mongoose";
import { ServiceFactory } from "@common/mydux";

export const PostgresService = new ServiceFactory(
  "pg",
  async ({ POSTGRES_URI }: { POSTGRES_URI: string }) => {
    const res = await mongoose.connect(POSTGRES_URI, {});

    return res;
  }
);
