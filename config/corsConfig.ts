// import cors from "cors";
// import { CorsOptions } from "cors";

// const corsOptions: CorsOptions = {
//   origin: ["http://localhost:4000"], // Adjust origins as needed
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };

// export default cors(corsOptions);


import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

export default corsOptions;