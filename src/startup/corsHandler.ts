import cors, { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  exposedHeaders: ["x-auth-token"],
};

export default cors(corsOptions);
