"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CopyIcon, CheckIcon, FormInputIcon } from "lucide-react";

export default function SignIn() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const fillForm = (text: string, field: string) => {
    setEmail(text);
    setPassword("temppassword");
    toast({
      title: "Filled",
      description: `${field} has been filled into the form.`,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Error",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto mt-10 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access the mentoring platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button loading={loading} type="submit" className="w-full">
                Sign in
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Don't have an account?
          </p>
          <Link href="/register" className="text-sm underline">
            Register here
          </Link>
        </CardFooter>
      </Card>
      <div className="mt-6 p-4 bg-blue-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">
          Sample Credentials for Assignment
        </h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between">
            <span>
              <strong>Mentor Email:</strong> mentor@ds123.com
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fillForm("mentor@ds123.com", "Mentor Email")}
            >
              <FormInputIcon className="h-4 w-4" />
            </Button>
          </li>
          <li className="flex items-center justify-between">
            <span>
              <strong>Mentee Email:</strong> mentee@ds123.com
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fillForm("mentee@ds123.com", "Mentee Email")}
            >
              <FormInputIcon className="h-4 w-4" />
            </Button>
          </li>
          <li className="flex items-center justify-between">
            <span>
              <strong>Password:</strong> temppassword
            </span>
          </li>
        </ul>
        <p className="mt-2 text-xs text-gray-600">
          Note: These credentials are for demonstration purposes only.
        </p>
      </div>
    </div>
  );
}
