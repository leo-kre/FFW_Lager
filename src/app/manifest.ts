import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
      return {
            name: "FFW-KLU Lager",
            short_name: "FFW Lager",
            description: "Lager System der FFW KLU",
            start_url: "/",
            display: "standalone",
            background_color: "#fff",
            theme_color: "#fff",

            icons: [
                  {
                        src: "/favicon.ico",
                        sizes: "any",
                        type: "image/x-icon",
                  },
            ],
      };
}
