import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { Loading, LoadingSpinner } from "~/components/loading";
import { api } from "~/utils/api";

import { Layout } from "~/components/layout";
import { PostView } from "~/components/post-view";

function CreatePost() {
  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
  });

  const { user } = useUser();

  if (!user) return <div>Something went wrong!</div>;

  return (
    <>
      <Image
        src={user.imageUrl}
        alt={`${user.username}'s profile picture`}
        className="rounded-full"
        width={48}
        height={48}
        priority={true}
      />
      <input
        type="text"
        placeholder="What is happening?!"
        className="w-full bg-transparent outline-none"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
        value={input}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => mutate({ content: input })} disabled={isPosting}>
          Post
        </button>
      )}
      {isPosting && <LoadingSpinner size={20} />}
    </>
  );
}

function Feed() {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <Loading />;

  if (!data) return <div>Something went wrong!</div>;

  return (
    <div>
      {data.map((postWithAuthor) => (
        <PostView {...postWithAuthor} key={postWithAuthor.post.id} />
      ))}
    </div>
  );
}

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <Layout>
      <div className="flex items-center gap-3 border-b p-4">
        {isSignedIn && <CreatePost />}
        {!isSignedIn && <SignInButton />}
      </div>
      <Feed />
    </Layout>
  );
}
