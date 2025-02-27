"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";

import { cardSchema } from "@/types/card-schema";
import { generateUniqueSlug } from "@/utils/generate-unique-slug";

import { db } from "../db";
import { emails, links, persons, phones } from "../schema";

const action = createSafeActionClient();

export const createCard = action
  .schema(cardSchema)
  .action(
    async ({
      parsedInput: {
        id,
        name,
        phones: phonesData,
        emails: emailsData,
        address,
        mapUrl,
        companyId,
        designation,
        attachmentFileName,
        attachmentUrl,
        bio,
        image,
        template,
        cover,
        theme,
        btnColor,
        links: linksData,
      },
    }) => {
      try {
        const uniqueSlug = await generateUniqueSlug(name);
        const placeholderImage = `https://ui-avatars.com/api/?background=random&name=${name}&size=128`;
        const placeholderCover = "/images/placeholder-cover.jpg";

        if (id) {
          const currentCard = await db.query.persons.findFirst({
            where: eq(persons.id, id),
          });

          if (!currentCard) return { error: "Card not found" };

          const editedCard = await db
            .update(persons)
            .set({
              name,
              address,
              bio,
              attachmentFileName,
              attachmentUrl,
              companyId,
              mapUrl,
              designation,
              template,
              theme,
              btnColor,
              image: image || placeholderImage,
              cover: cover || placeholderCover,
            })
            .where(eq(persons.id, id))
            .returning();

          //Delete Existing Links and update with new one
          await db.delete(links).where(eq(links.personId, editedCard[0].id));
          await db.delete(phones).where(eq(phones.personId, editedCard[0].id));
          await db.delete(emails).where(eq(emails.personId, editedCard[0].id));

          if (linksData && linksData.length) {
            await db.insert(links).values(
              linksData.map((link, i) => ({
                icon: link.icon,
                label: link.label,
                url: link.url,
                category: link.category,
                personId: editedCard[0].id,
                order: i,
              }))
            );
          }
          if (phonesData) {
            await db.insert(phones).values(
              phonesData.map((phone, i) => ({
                phone: phone.phone,
                label: phone.label,
                personId: editedCard[0].id,
                order: i,
              }))
            );
          }
          if (emailsData) {
            await db.insert(emails).values(
              emailsData.map((email, i) => ({
                email: email.email,
                label: email.label,
                personId: editedCard[0].id,
                order: i,
              }))
            );
          }
          revalidateTag("persons");
          revalidatePath("/");

          return {
            success: `Digital Card: (${editedCard[0].name}) has been Edited`,
            company: editedCard[0].companyId,
          };
        }

        if (!id) {
          const newCard = await db
            .insert(persons)
            .values({
              name,
              address,
              bio,
              attachmentFileName,
              attachmentUrl,
              companyId,
              mapUrl,
              designation,
              template,
              theme,
              btnColor,
              image: image || placeholderImage,
              cover: cover || placeholderCover,
              slug: uniqueSlug,
            })
            .returning();
          console.log("Person added");

          console.log("Checking for Phones");
          if (phonesData) {
            console.log("Phone found");
            await db.insert(phones).values(
              phonesData.map((phone, i) => ({
                phone: phone.phone,

                personId: newCard[0].id,
                order: i,
              }))
            );
            console.log("Phones added");
          }
          console.log("Checking for emails");
          if (emailsData) {
            console.log("Email found");
            await db.insert(emails).values(
              emailsData.map((email, i) => ({
                email: email.email,

                personId: newCard[0].id,
                order: i,
              }))
            );
            console.log("Emails added");
          }
          console.log("Checking for links");
          if (linksData && linksData.length) {
            console.log("Links found");
            await db.insert(links).values(
              linksData.map((link, i) => ({
                icon: link.icon,
                label: link.label,
                url: link.url,
                category: link.category,
                personId: newCard[0].id,
                order: i,
              }))
            );
            console.log("Links added");
          }

          revalidatePath("/");

          return {
            success: `Digital Card: (${newCard[0].name}) has been created`,
            company: newCard[0].companyId,
          };
        }
        redirect("/");
      } catch (err) {
        return { error: JSON.stringify(err) };
      }
    }
  );
