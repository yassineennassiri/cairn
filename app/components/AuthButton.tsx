import { auth, signIn, signOut } from "@/lib/auth";

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
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit" className="text-sm underline">
          Sign out
        </button>
      </form>
    </div>
  );
}
