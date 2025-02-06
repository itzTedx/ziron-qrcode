import Link from "next/link";

export default function HeaderTitle() {
  return (
    <Link href="/" className="text-xl font-semibold md:text-2xl">
      Dashboard
    </Link>
  );
}
