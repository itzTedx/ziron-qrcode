import { Logo } from "@/components/assets/logo";

export default function Footer() {
  return (
    <footer className="sr-only bottom-3 text-center text-xs opacity-50 sm:not-sr-only sm:fixed">
      Powered by <Logo className="scale-75" />{" "}
      <span className="sr-only">Ziron media</span>
    </footer>
  );
}
