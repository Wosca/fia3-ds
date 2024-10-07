import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SignIn() {
  return (
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
      <Input defaultValue="Oscar" type="name" name="name" />
      <Input
        defaultValue="oscarisnice1234@hotmail.com"
        type="email"
        name="email"
      />
      <Input defaultValue="temppassword" type="password" name="password" />
      <Switch defaultChecked name="mentor" id="mentor" />
      <Label htmlFor="mentor">Are you a mentor?</Label>
      <Button type="submit">Sign in</Button>
    </form>
  );
}
