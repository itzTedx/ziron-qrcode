/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

import { getAbsoluteUrl } from "@/lib/get-absolute-url";
import { getCardBySlug } from "@/server/actions/get-card-by-slug";

async function loadGoogleFont(font: string, weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&display=swap`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export default async function Image({ params }: { params: { slug: string } }) {
  const { card } = await getCardBySlug(params.slug);
  if (!card) return;

  const basePath =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://ziron-qrcode.vercel.app";

  const data = {
    image: getAbsoluteUrl(card.image, basePath),
    cover: getAbsoluteUrl(card.cover, basePath),
  };

  //   // Font loading, process.cwd() is Next.js project directory
  //   const interSemiBold = await readFile(
  //     join(process.cwd(), "assets/Inter-SemiBold.ttf")
  //   );

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          backgroundColor: "white",
          borderRadius: "32px",
          overflow: "hidden",
        }}
      >
        <div tw="h-40 w-full flex">
          <img src={data.cover} alt="" tw="object-cover h-full w-full" />
        </div>
        <div tw="bg-gray-100 flex">
          <div tw="flex flex-row w-full py-10 px-16">
            <div tw="h-96 aspect-[4/3] flex">
              <img
                src={data.image}
                alt=""
                tw="object-cover h-full rounded-2xl"
              />
            </div>
            <div tw="flex flex-col justify-between px-12">
              <div tw="flex flex-col gap-0">
                <h2
                  tw="flex flex-col text-7xl font-bold tracking-tight leading-none text-gray-900 p-0 m-0 mb-2 text-left"
                  style={{ fontFamily: "Jakarta bold" }}
                >
                  {card.name}
                </h2>
                <p
                  tw="leading-none text-3xl p-0 m-0"
                  style={{ color: card.theme }}
                >
                  {card.designation} - {card.company.name}
                </p>
                <p>{card.bio}</p>
              </div>
              <div tw="flex flex-col">
                <p
                  tw="m-0 mb-3 text-2xl"
                  style={{
                    width: "60%",
                    textWrap: "wrap",
                  }}
                >
                  Address: {card.address}
                </p>
                <div
                  tw="flex flex-wrap text-xl"
                  style={{
                    width: "90%",
                    textWrap: "wrap",
                  }}
                >
                  {card.phones.map((phone) => (
                    <div key={phone.id} tw="flex flex-wrap">
                      <p tw="m-0 mr-3">{phone.phone}</p>
                    </div>
                  ))}
                  {card.emails.map((email) => (
                    <div key={email.id} tw="flex flex-wrap">
                      <p tw="m-0 mr-3">{email.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Jakarta normal",
          data: await loadGoogleFont("Plus+Jakarta+Sans", 400),
          weight: 400,
          style: "normal",
        },
        {
          name: "Jakarta semibold",
          data: await loadGoogleFont("Plus+Jakarta+Sans", 600),
          weight: 600,
          style: "normal",
        },
        {
          name: "Jakarta bold",
          data: await loadGoogleFont("Plus+Jakarta+Sans", 800),
          weight: 800,
          style: "normal",
        },
      ],
    }
  );
}
