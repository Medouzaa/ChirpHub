import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";
import { Loading, LoadingSpinner } from "~/components/loading";

function ProfileFeed() {
  const { data: posts, isLoading: isFeedLoading } =
    api.profile.getPostsByAuthor.useQuery();

  if (isFeedLoading) return <LoadingSpinner />;

  if (!posts) return <div>Something went wrong!</div>;
  console.log("posts", posts);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.content}</div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { data: user, isLoading } = api.profile.getUserByUsername.useQuery({
    username: "ou-zaa",
  });
  if (isLoading) return <Loading />;

  if (!user) return <div>404</div>;

  return (
    <>
      <Head>
        <title>chirp hub</title>
        <meta name="description" content="chirp hub profile page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-auto min-h-screen border-x border-slate-400 md:max-w-2xl">
        <div className="relative h-60 bg-blue-500">
          <Image
            src={user.imageUrl}
            alt={`${user.username}'s profile picture`}
            width={128}
            height={128}
            className="absolute bottom-[-64px] left-4 rounded-full border-4 border-black"
          />
        </div>
        <div className="h-20" />
        <div className="border-b px-4">
          <div className="text-2xl font-bold">{user.username}</div>
        </div>
        <ProfileFeed />
      </div>
    </>
  );
}
