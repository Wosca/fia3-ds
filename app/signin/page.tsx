import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { signIn } from "@/auth";

export default function SignIn() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <p className="mb-4">
        Please enter the following sample credentials to sign in:
      </p>
      <ul className="mb-4 list-disc list-inside">
        <li>
          <strong>Name:</strong> TestingMentor
        </li>
        <li>
          <strong>Email:</strong> mentor@ds123.com or mentee@ds123.com
        </li>
        <li>
          <strong>Password:</strong> temppassword
        </li>
        <li>
          Check box doesn't do anything if account is already created (which
          they are)
        </li>
        <li>
          <a className="underline" href="/api/auth/signout">
            Sign out
          </a>
        </li>
      </ul>
      <form
        action={async (e) => {
          "use server";

          const name = e.get("name");
          const email = e.get("email");
          const password = e.get("password");
          const mentor = e.get("mentor") === "on";

          await signIn("credentials", {
            email: email,
            password: password,
            name: name,
            mentor: mentor,
            redirectTo: "/dashboard",
          });
        }}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mentor" className="text-right">
              Are you a mentor?
            </Label>
            <Switch id="mentor" name="mentor" className="col-span-3" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Sign in</Button>
        </div>
      </form>
    </div>
  );
}
