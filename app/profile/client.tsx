"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Session } from "next-auth";

export function Client({
  updateFunction,
  session,
}: {
  updateFunction: (
    name: string,
    email: string,
    sessionId: number
  ) => Promise<{ success: boolean; error?: string }>;
  session: Session;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState(session.user.name || "");
  const [email, setEmail] = useState(session.user.email || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await updateFunction(
        name,
        email,
        Number(session.user.id)
      );
      if (!response.success) {
        toast({
          title: "Error",
          description: response.error || "Failed to update profile.",
          variant: "destructive",
        });
        setIsEditing(false);
        return;
      }
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto mt-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            View and manage your profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={session.user.image || ""}
                alt={session.user.name || ""}
              />
              <AvatarFallback>
                {session.user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{session.user.name}</h2>
              <p className="text-muted-foreground">{session.user.role}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="role">Role</Label>
                <Input
                  type="text"
                  id="role"
                  value={session.user.role}
                  disabled
                />
              </div>
            </div>
            {isEditing && (
              <div className="mt-6 flex justify-end space-x-2">
                <Button type="submit">Save Changes</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
