import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";
import { Loading } from "~/components/loading";
import { Layout } from "~/components/layout";

export default function ProfilePage() {
  const { data: user, isLoading } = api.profile.getUserByUsername.useQuery({
    username: "ou-zaa",
  });
  if (isLoading) return <Loading />;

  if (!user) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{user.username}</title>
      </Head>
      <Layout>
        <div className="relative h-48 bg-slate-600">
          <Image
            src={user.imageUrl}
            alt={`${user.username}'s profile picture`}
            width={128}
            height={128}
            className="absolute -bottom-16 left-4 rounded-full border-4 border-black"
          />
        </div>
        <div className="h-16" />
        <div className="p-4 text-2xl font-bold">{user.username}</div>
        <div className="w-full border-b border-slate-400" />
      </Layout>
    </>
  );
}
