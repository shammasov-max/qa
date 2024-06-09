import mongoose from "mongoose";
import { ServiceFactory } from "@common/mydux";

export const MongoService = new ServiceFactory(
  "mongo",
  async ({ MONGO_URI }: { MONGO_URI: string }) => {
    const res = await mongoose.connect(MONGO_URI, {});

    return res;
  }
);
