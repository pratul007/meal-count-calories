// import Content from "./Content";
import SignInCard from "../pages/login";

export default function SignInSide() {
  return (
    <main className="relative flex flex-col justify-center min-h-screen pt-10">
      <div className="absolute inset-0 -z-10 bg-gradient-radial from-blue-50 to-white dark:from-blue-950 dark:to-gray-950"></div>
        <div className="flex flex-col md:flex-row justify-center gap-6 sm:gap-12 p-4 m-auto">
          <SignInCard />
        </div>
    </main>
  );
}
