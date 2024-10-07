import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Users, Calendar, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <h1 className="text-5xl font-extrabold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              MentorMatch
            </span>
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Empowering Peer-to-Peer Learning
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 flex items-center"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose MentorMatch?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <BookOpen className="mr-2" /> Expert Peer Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Gain insights and support from experienced senior students in
                  your subjects.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Users className="mr-2" /> Leadership Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Develop crucial leadership and communication skills by
                  becoming a mentor.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Calendar className="mr-2" /> Seamless Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Easily book sessions that align with your timetable during
                  peer-support periods.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16">
          <Card className="bg-gradient-to-r from-blue-50 to-teal-50">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-800">
                How MentorMatch Works
              </CardTitle>
              <CardDescription>
                Get started in three simple steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-4 text-gray-700">
                <li className="flex items-center">
                  <span className="font-semibold mr-2">Sign Up:</span>
                  Create your account as a mentor or mentee
                </li>
                <li className="flex items-center">
                  <span className="font-semibold mr-2">Connect:</span>
                  Browse available sessions or create your own
                </li>
                <li className="flex items-center">
                  <span className="font-semibold mr-2">Learn:</span>
                  Engage in productive peer-to-peer learning sessions
                </li>
              </ol>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white"
                >
                  Join MentorMatch Today
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </section>

        {/* Testimonial Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white shadow-md">
              <CardContent className="pt-6">
                <p className="italic text-gray-600">
                  "MentorMatch has significantly improved my understanding of
                  complex subjects. The peer-to-peer approach makes learning
                  more relatable and engaging."
                </p>
                <p className="mt-4 font-semibold">- Sarah J., Mentee</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md">
              <CardContent className="pt-6">
                <p className="italic text-gray-600">
                  "Being a mentor on MentorMatch has not only helped me
                  reinforce my knowledge but also developed my leadership
                  skills. It's a win-win for everyone involved."
                </p>
                <p className="mt-4 font-semibold">- Michael T., Mentor</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <footer className="text-center py-8">
          <p className="text-sm text-gray-600">
            © 2024 MentorMatch. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
