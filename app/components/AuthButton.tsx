import { auth, signIn, signOut } from "@/lib/auth";
import SignOutButton from "@/app/components/SignOutButton";

export default async function AuthButton() {
  const session = await auth();

  if (!session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <button type="submit" className="bg-black text-white rounded px-4 py-2">
          Sign in with GitHub
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">{session.user.email}</span>
      <SignOutButton />
    </div>
  );
}
