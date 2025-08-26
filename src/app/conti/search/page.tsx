import { Suspense } from "react";
import ContiSearchComponent from "src/app/conti/search/ContiSearchComponent";

export default function Page() {
  return (
    <Suspense>
      <ContiSearchComponent />
    </Suspense>
  );
}
