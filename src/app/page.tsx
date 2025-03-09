import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Card>
          <CardHeader>Shadcn/ui Card</CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button variant={"secondary"} size={"lg"} className="cursor-pointer" >Go to Dashboard page</Button>
            </Link>
          </CardContent>
        </Card>
      </main>

    </div>
  );
}
