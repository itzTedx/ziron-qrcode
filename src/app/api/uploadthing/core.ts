import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "zironmedia" });

export const ourFileRouter = {
  photo: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(({ req }) => auth(req))
    .onUploadComplete((data) => console.log("file", data)),
  cover: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(({ req }) => auth(req))
    .onUploadComplete((data) => console.log("file", data)),
  attachments: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(({ req }) => auth(req))
    .onUploadComplete((data) => console.log("file", data)),

  logoUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    "image/svg+xml": { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
