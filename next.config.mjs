/** @type {import('next').NextConfig} */
const nextConfig = {
      env: {
            NEXT_PUBLIC_HOSTDOMAIN: "http://localhost:5000",
            NEXT_PUBLIC_LOCATION_LIST: "MTF - A1.1, MTF - A1.2, MTF - A1.3, MTF - A2.1, MTF - A2.2, MTF - A2.3, MTF - A3.1, MTF - A3.2, MTF - A3.3",

            NEXT_PUBLIC_DB_HOST: "130.61.125.137",
            NEXT_PUBLIC_DB_USER: "webAccess",
            NEXT_PUBLIC_DB_PASSWORD: "webAccess_001",
            NEXT_PUBLIC_DB_DATABASE_NAME: "FFW_Lager",
      },
};

export default nextConfig;
