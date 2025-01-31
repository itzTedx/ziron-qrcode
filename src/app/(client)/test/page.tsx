import { getCompanies } from "@/server/actions/get-company";

export default async function TestPage() {
  const { companies } = await getCompanies();

  console.log(companies);
  return (
    <div>
      Details
      <pre>{JSON.stringify(companies, null, 2)}</pre>
    </div>
  );
}
