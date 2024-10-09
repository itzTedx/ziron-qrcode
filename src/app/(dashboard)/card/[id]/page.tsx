import CardForm from "../_components/card-form";
import ProfileDashboard from "../_components/profile-dashboard";

export default function CardPage() {
  return (
    <main className="relative">
      <ProfileDashboard />
      <div className="container grid max-w-6xl gap-8 pt-3 md:grid-cols-10 md:pt-9">
        <CardForm />
        <div className="col-span-4 hidden rounded-lg bg-background md:block">
          Preview
        </div>
      </div>
    </main>
  );
}
