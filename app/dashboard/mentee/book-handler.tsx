"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function BookHandler({
  sessionInfo,
  handleBookDB,
}: {
  sessionInfo: { booked: boolean; sessionId: number };
  handleBookDB: (
    sessionId: number,
    type: "book" | "remove"
  ) => Promise<{ success: boolean; error?: string }>;
}) {
  const [bookedState, setStateBooked] = useState(sessionInfo.booked);
  const [loading, setLoading] = useState(false);
  const handleBook = async () => {
    setLoading(true);
    handleBookDB(sessionInfo.sessionId, bookedState ? "remove" : "book").then(
      (res) => {
        if (res.success) {
          setStateBooked(!bookedState);
        }
        setLoading(false);
      }
    );
  };
  return (
    <div>
      <Button
        variant={bookedState ? "outline" : "default"}
        onClick={handleBook}
        loading={loading}
      >
        {bookedState ? "Booked" : "Book"}
      </Button>
    </div>
  );
}
