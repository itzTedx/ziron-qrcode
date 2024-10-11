import Link from "next/link";

export default function CardPage() {
  return (
    <div className="container px-8 pt-3 md:pt-9">
      <Link href="/card/3">Edit Page</Link>
      <section>
        <h2>Links</h2>
      </section>
    </div>
  );
}
