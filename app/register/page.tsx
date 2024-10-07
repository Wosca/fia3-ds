"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

export default function Register() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const mentor = formData.get("mentor") === "on";

    try {
      const result = await signIn("credentials", {
        email: email,
        password: password,
        name: name,
        mentor: mentor,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Error",
          description: "Registration failed. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Registration successful. Redirecting to dashboard...",
        });
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
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Create a new account to join the mentoring platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="mentor" name="mentor" />
                <Label htmlFor="mentor">I want to be a mentor</Label>
              </div>
              <Button loading={loading} type="submit" className="w-full">
                Register
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Already have an account?
          </p>
          <Link href="/login" className="text-sm underline">
            Sign in here
          </Link>
        </CardFooter>
      </Card>
      <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">
          Important Note for Assignment
        </h2>
        <p className="text-sm text-gray-700">
          This form is functional however I have already made two accounts, one
          mentor and one mentee at the{" "}
          <Link href="/login" className="underline">
            login page
          </Link>
          . Feel free to use those or create a new account here.
        </p>
      </div>
    </div>
  );
}
